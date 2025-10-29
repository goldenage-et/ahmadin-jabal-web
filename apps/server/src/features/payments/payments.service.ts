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
} from '@repo/common';
import { BankTransferService } from '../bank-transfer/bank-transfer.service';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient,
        private readonly bankTransferService: BankTransferService,
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
        await this.prisma.order.update({
            where: { id: payment.orderId },
            data: { paymentStatus: status },
        });

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

        // Update order payment status
        await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: EPaymentStatus.paid },
        });

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

        // Update order payment status
        await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: EPaymentStatus.paid },
        });

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

