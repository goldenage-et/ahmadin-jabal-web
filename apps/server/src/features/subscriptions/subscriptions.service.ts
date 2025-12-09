import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {
    TCreateSubscription,
    TSubscription,
    TSubscriptionWithPlan,
    TUpdateSubscription,
    ZSubscription,
    ZSubscriptionWithPlan,
    TSubscriptionQueryFilter,
    TSubscriptionQueryUnique,
    ESubscriptionStatus,
    TPaginationResponse,
    ZPaginationResponse,
    EOrderStatus,
    EPaymentStatus,
    EPaymentMethod,
    generateCode,
    TOrderStatusHistory,
} from '@repo/common';
import { v4 as createId } from 'uuid';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class SubscriptionsService {
    private readonly logger = new Logger(SubscriptionsService.name);

    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    /**
     * Create a new subscription for a user
     */
    async create(
        userId: string,
        data: TCreateSubscription,
    ): Promise<TSubscriptionWithPlan> {
        // Check if plan exists and is active
        const plan = await this.db.plan.findUnique({
            where: { id: data.planId },
        });

        if (!plan) {
            throw new NotFoundException(`Plan with id ${data.planId} not found`);
        }

        if (!plan.active) {
            throw new BadRequestException('Cannot subscribe to an inactive plan');
        }

        // Check if user already has an active subscription
        const activeSubscription = await this.getActiveSubscription(userId);
        if (activeSubscription) {
            throw new ConflictException(
                'User already has an active subscription. Please cancel the current subscription first.',
            );
        }

        // Calculate end date based on plan type
        const startDate = new Date();
        let endDate: Date | null = null;

        if (!plan.isLifetime) {
            if (!plan.durationDays) {
                throw new BadRequestException(
                    'Time-based plan must have durationDays specified',
                );
            }
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + plan.durationDays);
        }

        let paymentId: string | null = data.paymentId || null;

        // If plan is paid (price > 0) and no paymentId provided, create order and payment
        // DO NOT create subscription yet - it will be created when payment is confirmed
        if (plan.price > 0 && !paymentId) {
            // Get user details for order creation
            const user = await this.db.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            });

            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }

            // Create order for subscription
            const orderNumber = generateCode('ORD');
            const subtotal = plan.price;
            const tax = 0;
            const shipping = 0; // No shipping for subscriptions
            const discount = 0;
            const total = subtotal + tax + shipping - discount;

            const statusHistory: TOrderStatusHistory = {
                id: createId(),
                status: EOrderStatus.pending,
                notes: 'Subscription order created',
                updatedBy: {
                    id: user.id,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                },
                createdAt: new Date(),
            };

            const order = await this.db.order.create({
                data: {
                    userId: user.id,
                    planId: plan.id,
                    quantity: 1,
                    orderNumber: orderNumber,
                    status: EOrderStatus.pending,
                    paymentStatus: EPaymentStatus.pending,
                    paymentMethod: EPaymentMethod.bankTransfer, // Default payment method
                    shippingAddress: null, // No shipping for subscriptions
                    subtotal: subtotal,
                    tax: tax,
                    shipping: shipping,
                    discount: discount,
                    total: total,
                    currency: plan.currency || 'ETB',
                    shippingMethod: null, // No shipping for subscriptions
                    notes: `Subscription order for plan: ${plan.name}`,
                    customerNotes: null,
                    statusHistory: [statusHistory],
                },
            });

            // Create payment for the order
            const payment = await this.db.payment.create({
                data: {
                    orderId: order.id,
                    userId: user.id,
                    amount: total,
                    currency: plan.currency || 'ETB',
                    paymentMethod: EPaymentMethod.bankTransfer,
                    paymentStatus: EPaymentStatus.pending,
                },
            });

            paymentId = payment.id;
            this.logger.log(`Created order ${order.id} and payment ${payment.id} for subscription. Subscription will be created after payment confirmation.`);

            // For paid plans, don't create subscription yet - it will be created when payment is confirmed
            // Return orderId so client can redirect to payment page
            // We'll throw a special exception that the controller can catch and handle
            const error = new BadRequestException('Payment required for subscription');
            (error as any).orderId = order.id;
            (error as any).paymentId = payment.id;
            throw error;
        }

        // Only create subscription for free plans or if paymentId is already provided (payment confirmed)
        // For paid plans, subscription will be created when payment is confirmed
        const subscription = await this.db.subscription.create({
            data: {
                userId,
                planId: data.planId,
                status: ESubscriptionStatus.active,
                startDate: startDate,
                endDate: endDate,
                paymentId: paymentId,
            },
            include: {
                plan: true,
            },
        });

        return ZSubscriptionWithPlan.parse({
            ...subscription,
            plan: subscription.plan,
        });
    }

    /**
     * Get user's active subscription
     */
    async getActiveSubscription(
        userId: string,
    ): Promise<TSubscriptionWithPlan | null> {
        const subscription = await this.db.subscription.findFirst({
            where: {
                userId,
                status: ESubscriptionStatus.active,
            },
            include: {
                plan: true,
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        if (!subscription) {
            return null;
        }

        // Check if subscription has expired
        if (subscription.endDate && new Date() > subscription.endDate) {
            // Auto-expire the subscription
            await this.db.subscription.update({
                where: { id: subscription.id },
                data: { status: ESubscriptionStatus.expired },
            });
            return null;
        }

        return ZSubscriptionWithPlan.parse({
            ...subscription,
            plan: subscription.plan,
        });
    }

    /**
     * Check if user has a valid active subscription
     */
    async hasActiveSubscription(userId: string): Promise<boolean> {
        const subscription = await this.getActiveSubscription(userId);
        return subscription !== null;
    }

    /**
     * Get subscription by ID
     */
    async getOne(
        query: TSubscriptionQueryUnique,
    ): Promise<TSubscriptionWithPlan> {
        const subscription = await this.db.subscription.findUnique({
            where: { id: query.id },
            include: {
                plan: true,
            },
        });

        if (!subscription) {
            throw new NotFoundException(
                `Subscription with id ${query.id} not found`,
            );
        }

        return ZSubscriptionWithPlan.parse({
            ...subscription,
            plan: subscription.plan,
        });
    }

    /**
     * Get many subscriptions with filtering
     */
    async getMany(
        query?: TSubscriptionQueryFilter,
    ): Promise<TPaginationResponse<TSubscriptionWithPlan[]>> {
        const where: any = {};
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;

        if (query?.userId) {
            where.userId = query.userId;
        }

        if (query?.planId) {
            where.planId = query.planId;
        }

        if (query?.status) {
            where.status = query.status;
        }

        const [subscriptions, total] = await Promise.all([
            this.db.subscription.findMany({
                where,
                skip,
                take: limit,
                include: {
                    plan: true,
                },
                orderBy: {
                    [query?.sortBy || 'createdAt']: query?.sortOrder || 'desc',
                },
            }),
            this.db.subscription.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return ZPaginationResponse(ZSubscriptionWithPlan.array()).parse({
            data: subscriptions.map((sub) =>
                ZSubscriptionWithPlan.parse({
                    ...sub,
                    plan: sub.plan,
                }),
            ),
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    }

    /**
     * Update subscription
     */
    async update(
        query: TSubscriptionQueryUnique,
        data: TUpdateSubscription,
    ): Promise<TSubscriptionWithPlan> {
        const existing = await this.db.subscription.findUnique({
            where: { id: query.id },
        });

        if (!existing) {
            throw new NotFoundException(
                `Subscription with id ${query.id} not found`,
            );
        }

        const updated = await this.db.subscription.update({
            where: { id: query.id },
            data: {
                ...(data.status && { status: data.status }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
            },
            include: {
                plan: true,
            },
        });

        return ZSubscriptionWithPlan.parse({
            ...updated,
            plan: updated.plan,
        });
    }

    /**
     * Cancel a subscription
     */
    async cancel(
        subscriptionId: string,
        userId: string,
    ): Promise<TSubscriptionWithPlan> {
        const subscription = await this.db.subscription.findUnique({
            where: { id: subscriptionId },
            include: {
                plan: true,
            },
        });

        if (!subscription) {
            throw new NotFoundException(
                `Subscription with id ${subscriptionId} not found`,
            );
        }

        if (subscription.userId !== userId) {
            throw new BadRequestException(
                'You can only cancel your own subscriptions',
            );
        }

        if (subscription.status !== ESubscriptionStatus.active) {
            throw new BadRequestException(
                'Only active subscriptions can be cancelled',
            );
        }

        const updated = await this.db.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: ESubscriptionStatus.cancelled,
            },
            include: {
                plan: true,
            },
        });

        return ZSubscriptionWithPlan.parse({
            ...updated,
            plan: updated.plan,
        });
    }

    /**
     * Auto-expire subscriptions that have passed their end date
     * This should be called periodically (e.g., via a cron job)
     */
    async expireSubscriptions(): Promise<number> {
        const now = new Date();
        const result = await this.db.subscription.updateMany({
            where: {
                status: ESubscriptionStatus.active,
                endDate: {
                    lte: now,
                },
            },
            data: {
                status: ESubscriptionStatus.expired,
            },
        });

        this.logger.log(`Expired ${result.count} subscriptions`);
        return result.count;
    }

    /**
     * Activate subscription (typically called after payment confirmation)
     */
    async activateSubscription(
        subscriptionId: string,
        paymentId?: string,
    ): Promise<TSubscriptionWithPlan> {
        const subscription = await this.db.subscription.findUnique({
            where: { id: subscriptionId },
            include: {
                plan: true,
            },
        });

        if (!subscription) {
            throw new NotFoundException(
                `Subscription with id ${subscriptionId} not found`,
            );
        }

        const updated = await this.db.subscription.update({
            where: { id: subscriptionId },
            data: {
                status: ESubscriptionStatus.active,
                ...(paymentId && { paymentId }),
            },
            include: {
                plan: true,
            },
        });

        return ZSubscriptionWithPlan.parse({
            ...updated,
            plan: updated.plan,
        });
    }
}

