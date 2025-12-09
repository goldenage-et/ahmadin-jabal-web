import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/prisma';
import {
    TCreatePayment,
    TUpdatePayment,
    TPaymentQueryFilter,
    EPaymentStatus,
    TPayment,
    TBankClientReceiptData,
    ESubscriptionStatus,
    EOrderStatus,
} from '@repo/common';
import { BankTransferService } from '../bank-transfer/bank-transfer.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { v4 as createId } from 'uuid';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient,
        private readonly bankTransferService: BankTransferService,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    async create(data: TCreatePayment): Promise<TPayment> {
        this.logger.log(`Creating payment for order: ${data.orderId}`);

        const payment = await this.prisma.payment.create({
            data: {
                ...data,
                paymentStatus: data.paymentStatus || EPaymentStatus.pending,
            },
        });

        this.logger.log(`Payment created: ${payment.id}`);
        return payment as TPayment;
    }

    async getOne(id: string, userId?: string): Promise<TPayment> {
        this.logger.log(`Fetching payment: ${id}`);

        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Optional: Check if user has access to this payment
        if (userId && payment.userId !== userId) {
            throw new NotFoundException('Payment not found');
        }

        return payment as TPayment;
    }

    async getByOrder(orderId: string, userId?: string): Promise<TPayment[]> {
        this.logger.log(`Fetching payments for order: ${orderId}`);

        const where: any = { orderId };
        if (userId) {
            where.userId = userId;
        }

        const payments = await this.prisma.payment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return payments as TPayment[];
    }

    async getMany(query: TPaymentQueryFilter): Promise<{ payments: TPayment[]; total: number }> {
        this.logger.log('Fetching payments with filters');

        const {
            page = 1,
            limit = 10,
            orderId,
            userId,
            paymentMethod,
            paymentStatus,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            startDate,
            endDate,
        } = query;

        const skip = (page - 1) * limit;

        const where: any = {};

        if (orderId) where.orderId = orderId;
        if (userId) where.userId = userId;
        if (paymentMethod) where.paymentMethod = paymentMethod;
        if (paymentStatus) where.paymentStatus = paymentStatus;

        if (search) {
            where.OR = [
                { referenceNumber: { contains: search, mode: 'insensitive' } },
                { transactionId: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.payment.count({ where }),
        ]);

        return {
            payments: payments as TPayment[],
            total,
        };
    }

    async update(id: string, data: TUpdatePayment, userId?: string): Promise<TPayment> {
        this.logger.log(`Updating payment: ${id}`);

        // Check if payment exists
        const existingPayment = await this.prisma.payment.findUnique({
            where: { id },
        });

        if (!existingPayment) {
            throw new NotFoundException('Payment not found');
        }

        // Optional: Check if user has access
        if (userId && existingPayment.userId !== userId) {
            throw new NotFoundException('Payment not found');
        }

        const payment = await this.prisma.payment.update({
            where: { id },
            data,
        });

        this.logger.log(`Payment updated: ${payment.id}`);
        return payment as TPayment;
    }

    async updateStatus(
        id: string,
        status: EPaymentStatus,
        metadata?: any,
    ): Promise<TPayment> {
        this.logger.log(`Updating payment status: ${id} to ${status}`);

        const updateData: any = {
            paymentStatus: status,
        };

        if (status === EPaymentStatus.paid) {
            updateData.paidAt = new Date();
        } else if (status === EPaymentStatus.refunded) {
            updateData.refundedAt = new Date();
        }

        if (metadata) {
            updateData.metadata = metadata;
        }

        const payment = await this.prisma.payment.update({
            where: { id },
            data: updateData,
        });

        // Also update the related order's payment status
        const order = await this.prisma.order.findUnique({
            where: { id: payment.orderId || '' },
        });

        if (order) {
            const updateData: any = { paymentStatus: status };

            // For subscription orders, automatically set order status to confirmed when payment is paid
            if (status === EPaymentStatus.paid && order.planId) {
                updateData.status = EOrderStatus.confirmed;

                // Update status history
                const currentStatusHistory = Array.isArray(order.statusHistory)
                    ? order.statusHistory
                    : [];
                const statusHistory = {
                    id: createId(),
                    status: EOrderStatus.confirmed,
                    notes: 'Subscription order automatically confirmed after payment',
                    updatedBy: {
                        id: payment.userId || '',
                        firstName: '',
                        lastName: '',
                        email: '',
                    },
                    createdAt: new Date(),
                };
                updateData.statusHistory = [...currentStatusHistory, statusHistory];
            }

            await this.prisma.order.update({
                where: { id: payment.orderId || '' },
                data: updateData,
            });

            // If payment status is paid and this is a subscription order, create or activate subscription
            if (status === EPaymentStatus.paid && order.planId) {
                let subscription = await this.prisma.subscription.findFirst({
                    where: { paymentId: payment.id },
                });

                if (!subscription) {
                    subscription = await this.prisma.subscription.findFirst({
                        where: {
                            planId: order.planId,
                            userId: order.userId,
                            paymentId: null,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    });
                }

                if (!subscription) {
                    const plan = await this.prisma.plan.findUnique({
                        where: { id: order.planId },
                    });

                    if (plan) {
                        const startDate = new Date();
                        let endDate: Date | null = null;

                        if (!plan.isLifetime && plan.durationDays) {
                            endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + plan.durationDays);
                        }

                        subscription = await this.prisma.subscription.create({
                            data: {
                                userId: order.userId,
                                planId: order.planId,
                                status: ESubscriptionStatus.active,
                                startDate: startDate,
                                endDate: endDate,
                                paymentId: payment.id,
                            },
                            include: {
                                plan: true,
                            },
                        });

                        this.logger.log(`Subscription created after payment status update: ${subscription.id}`);
                    }
                } else {
                    await this.prisma.subscription.update({
                        where: { id: subscription.id },
                        data: { paymentId: payment.id },
                    });

                    await this.subscriptionsService.activateSubscription(
                        subscription.id,
                        payment.id,
                    );
                    this.logger.log(`Subscription activated after payment status update: ${subscription.id}`);
                }
            }
        }

        this.logger.log(`Payment status updated: ${payment.id}`);
        return payment as TPayment;
    }

    async completePayment(
        orderId: string,
        bankCode: string,
        referenceNumber: string,
        bankAccountId: string,
        userId: string,
    ): Promise<{ payment: TPayment; receiptData: TBankClientReceiptData }> {
        this.logger.log(`Completing payment for order: ${orderId}`);

        // Get order details
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Verify order belongs to user
        if (order.userId !== userId) {
            throw new NotFoundException('Order not found');
        }

        // Check if already paid
        if (order.paymentStatus === EPaymentStatus.paid) {
            throw new BadRequestException('Order has already been paid');
        }

        const bankAccount = await this.prisma.bankAccount.findUnique({
            where: { id: bankAccountId },
        });

        if (!bankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        // Check if this referenceNumber has already been used for a paid payment
        const existingPaidPayment = await this.prisma.payment.findFirst({
            where: {
                referenceNumber,
                paymentStatus: EPaymentStatus.paid,
            },
        });

        if (existingPaidPayment) {
            throw new BadRequestException('This payment reference number has already been used for a paid order.');
        }
        // Validate reference using bank transfer service
        const receiptDataResult = await this.bankTransferService.validateReference(
            { bankCode, reference: referenceNumber },
            {
                bank: bankAccount.bankName,
                name: bankAccount.accountName,
                accountNumber: bankAccount.accountNumber,
            }
        );

        if (!receiptDataResult.success) {
            throw new BadRequestException(receiptDataResult.error);
        }

        const { receiptData, receiptPath } = receiptDataResult;

        const validationResult = await this.bankTransferService.validatePayment(
            { bankCode, accountNumber: bankAccount.accountNumber },
            order,
            receiptData,
        );

        if (!validationResult.success) {
            throw new BadRequestException(validationResult.error);
        }

        // Find existing payment or create new one
        let payment = await this.prisma.payment.findFirst({
            where: { orderId, userId },
        });

        if (!payment) {
            payment = await this.prisma.payment.create({
                data: {
                    orderId,
                    userId,
                    amount: order.total,
                    currency: order.currency,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: EPaymentStatus.paid,
                    referenceNumber,
                    bankCode,
                    bankAccountId,
                    receiptData: receiptData,
                    metadata: {
                        receiptPath,
                    },
                    paidAt: new Date(),
                },
            });
        } else {
            payment = await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: EPaymentStatus.paid,
                    referenceNumber,
                    bankCode,
                    bankAccountId,
                    receiptData: receiptData,
                    metadata: {
                        receiptPath,
                    },
                    paidAt: new Date(),
                },
            });
        }

        // Update order payment status and status (if order exists)
        if (orderId) {
            const updateData: any = { paymentStatus: EPaymentStatus.paid };

            // For subscription orders, automatically set order status to confirmed when paid
            if (order.planId) {
                updateData.status = EOrderStatus.confirmed;

                // Update status history
                const currentStatusHistory = Array.isArray(order.statusHistory)
                    ? order.statusHistory
                    : [];
                const statusHistory = {
                    id: createId(),
                    status: EOrderStatus.confirmed,
                    notes: 'Subscription order automatically confirmed after payment',
                    updatedBy: {
                        id: userId,
                        firstName: '',
                        lastName: '',
                        email: '',
                    },
                    createdAt: new Date(),
                };
                updateData.statusHistory = [...currentStatusHistory, statusHistory];
            }

            await this.prisma.order.update({
                where: { id: orderId },
                data: updateData,
            });
        }

        // Check if this is a subscription order (has planId)
        // If so, create or activate the subscription
        if (order.planId) {
            // Check if subscription already exists (shouldn't for new flow, but handle legacy)
            let subscription = await this.prisma.subscription.findFirst({
                where: { paymentId: payment.id },
            });

            // If not found by paymentId, check if subscription exists by planId and userId
            if (!subscription) {
                subscription = await this.prisma.subscription.findFirst({
                    where: {
                        planId: order.planId,
                        userId: order.userId,
                        paymentId: null, // Not yet linked to a payment
                    },
                    orderBy: {
                        createdAt: 'desc', // Get the most recent subscription
                    },
                });
            }

            // If subscription doesn't exist, create it now (payment is confirmed)
            if (!subscription) {
                // Get plan details
                const plan = await this.prisma.plan.findUnique({
                    where: { id: order.planId },
                });

                if (!plan) {
                    this.logger.error(`Plan ${order.planId} not found for subscription creation`);
                } else {
                    // Calculate dates
                    const startDate = new Date();
                    let endDate: Date | null = null;

                    if (!plan.isLifetime) {
                        if (plan.durationDays) {
                            endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + plan.durationDays);
                        }
                    }

                    // Create subscription now that payment is confirmed
                    subscription = await this.prisma.subscription.create({
                        data: {
                            userId: order.userId,
                            planId: order.planId,
                            status: ESubscriptionStatus.active,
                            startDate: startDate,
                            endDate: endDate,
                            paymentId: payment.id,
                        },
                        include: {
                            plan: true,
                        },
                    });

                    this.logger.log(`Subscription created after payment confirmation: ${subscription.id}`);
                }
            } else {
                // Subscription exists, activate it and link payment
                await this.prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { paymentId: payment.id },
                });

                await this.subscriptionsService.activateSubscription(
                    subscription.id,
                    payment.id,
                );
                this.logger.log(`Subscription activated: ${subscription.id}`);
            }
        }

        this.logger.log(`Payment completed: ${payment.id}`);
        return {
            payment: payment as TPayment,
            receiptData: receiptData,
        };
    }

    async confirmBankTransfer(
        orderId: string,
        referenceNumber: string,
        receiptData: any,
        userId: string,
    ): Promise<TPayment> {
        this.logger.log(`Confirming bank transfer for order: ${orderId}`);

        // Find existing payment or create new one
        let payment = await this.prisma.payment.findFirst({
            where: { orderId, userId },
        });

        if (!payment) {
            // Get order details to create payment
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            payment = await this.prisma.payment.create({
                data: {
                    orderId,
                    userId,
                    amount: order.total,
                    currency: order.currency,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: EPaymentStatus.paid,
                    referenceNumber,
                    receiptData,
                    paidAt: new Date(),
                },
            });
        } else {
            payment = await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: EPaymentStatus.paid,
                    referenceNumber,
                    receiptData,
                    paidAt: new Date(),
                },
            });
        }

        // Get order to check if it's a subscription order
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Update order payment status and status
        const updateData: any = { paymentStatus: EPaymentStatus.paid };

        // For subscription orders, automatically set order status to confirmed when paid
        if (order.planId) {
            updateData.status = EOrderStatus.confirmed;

            // Update status history
            const currentStatusHistory = Array.isArray(order.statusHistory)
                ? order.statusHistory
                : [];
            const statusHistory = {
                id: createId(),
                status: EOrderStatus.confirmed,
                notes: 'Subscription order automatically confirmed after payment',
                updatedBy: {
                    id: userId,
                    firstName: '',
                    lastName: '',
                    email: '',
                },
                createdAt: new Date(),
            };
            updateData.statusHistory = [...currentStatusHistory, statusHistory];
        }

        await this.prisma.order.update({
            where: { id: orderId },
            data: updateData,
        });

        // If this is a subscription order, create or activate subscription
        if (order.planId) {
            // Check if subscription already exists
            let subscription = await this.prisma.subscription.findFirst({
                where: { paymentId: payment.id },
            });

            if (!subscription) {
                subscription = await this.prisma.subscription.findFirst({
                    where: {
                        planId: order.planId,
                        userId: order.userId,
                        paymentId: null,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
            }

            // If subscription doesn't exist, create it now (payment is confirmed)
            if (!subscription) {
                const plan = await this.prisma.plan.findUnique({
                    where: { id: order.planId },
                });

                if (plan) {
                    const startDate = new Date();
                    let endDate: Date | null = null;

                    if (!plan.isLifetime && plan.durationDays) {
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + plan.durationDays);
                    }

                    subscription = await this.prisma.subscription.create({
                        data: {
                            userId: order.userId,
                            planId: order.planId,
                            status: ESubscriptionStatus.active,
                            startDate: startDate,
                            endDate: endDate,
                            paymentId: payment.id,
                        },
                        include: {
                            plan: true,
                        },
                    });

                    this.logger.log(`Subscription created after bank transfer confirmation: ${subscription.id}`);
                }
            } else {
                // Subscription exists, activate it and link payment
                await this.prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { paymentId: payment.id },
                });

                await this.subscriptionsService.activateSubscription(
                    subscription.id,
                    payment.id,
                );
                this.logger.log(`Subscription activated after bank transfer: ${subscription.id}`);
            }
        }

        this.logger.log(`Bank transfer confirmed: ${payment.id}`);
        return payment as TPayment;
    }

    async delete(id: string, userId?: string): Promise<{ message: string }> {
        this.logger.log(`Deleting payment: ${id}`);

        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        if (userId && payment.userId !== userId) {
            throw new NotFoundException('Payment not found');
        }

        // Only allow deletion of pending or failed payments
        if (payment.paymentStatus === EPaymentStatus.paid || payment.paymentStatus === EPaymentStatus.refunded) {
            throw new BadRequestException('Cannot delete paid or refunded payments');
        }

        await this.prisma.payment.delete({
            where: { id },
        });

        this.logger.log(`Payment deleted: ${id}`);
        return { message: 'Payment deleted successfully' };
    }
}

