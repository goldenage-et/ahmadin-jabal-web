import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import {
    TAuthUser,
    TCreateSubscription,
    TSubscriptionWithPlan,
    TUpdateSubscription,
    ZCreateSubscription,
    ZSubscriptionQueryFilter,
    ZSubscriptionQueryUnique,
    ZUpdateSubscription,
    TPaginationResponse,
    TSubscriptionQueryFilter,
} from '@repo/common';
import { RolesService } from '../roles/roles.service';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
    private readonly logger = new Logger(SubscriptionsController.name);

    constructor(
        private readonly subscriptionsService: SubscriptionsService,
        private readonly rolesService: RolesService,
    ) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateSubscription))
    async subscribe(
        @Body() data: TCreateSubscription,
        @CurrentUser() user: TAuthUser,
    ): Promise<TSubscriptionWithPlan | { orderId: string; paymentId: string }> {
        this.logger.log(`User ${user.id} subscribing to plan ${data.planId}`);
        try {
            return await this.subscriptionsService.create(user.id, data);
        } catch (error: any) {
            // If error has orderId, it means payment is required - return order info
            if (error.orderId && error.paymentId) {
                return {
                    orderId: error.orderId,
                    paymentId: error.paymentId,
                };
            }
            throw error;
        }
    }

    @Get('me')
    @UseGuards(UserAuthGuard)
    async getMySubscription(
        @CurrentUser() user: TAuthUser,
    ): Promise<TSubscriptionWithPlan | null> {
        this.logger.log(`Getting subscription for user ${user.id}`);
        return this.subscriptionsService.getActiveSubscription(user.id);
    }

    @Get('me/active')
    @UseGuards(UserAuthGuard)
    async hasActiveSubscription(
        @CurrentUser() user: TAuthUser,
    ): Promise<{ hasActive: boolean }> {
        const hasActive = await this.subscriptionsService.hasActiveSubscription(
            user.id,
        );
        return { hasActive };
    }

    @Put('me/:id/cancel')
    @UseGuards(UserAuthGuard)
    async cancelMySubscription(
        @Param('id') id: string,
        @CurrentUser() user: TAuthUser,
    ): Promise<TSubscriptionWithPlan> {
        this.logger.log(`User ${user.id} cancelling subscription ${id}`);
        return this.subscriptionsService.cancel(id, user.id);
    }

    // Admin endpoints
    @Get()
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZSubscriptionQueryFilter))
    async getAllSubscriptions(
        @Query() query: TSubscriptionQueryFilter,
        @CurrentUser() user: TAuthUser,
    ): Promise<TPaginationResponse<TSubscriptionWithPlan[]>> {
        this.logger.log('Getting all subscriptions');
        const canViewMany = this.rolesService.can(user, 'plan', 'viewMany');
        if (!canViewMany) {
            throw new ForbiddenException(
                'You do not have permission to view all subscriptions.',
            );
        }
        return this.subscriptionsService.getMany(query);
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZSubscriptionQueryUnique))
    async getSubscription(
        @Param('id') id: string,
        @CurrentUser() user: TAuthUser,
    ): Promise<TSubscriptionWithPlan> {
        this.logger.log(`Getting subscription ${id}`);
        // Check if user is viewing their own subscription or has admin permission
        const subscription = await this.subscriptionsService.getOne({ id });
        const canViewMany = this.rolesService.can(user, 'plan', 'viewMany');

        if (subscription.userId !== user.id && !canViewMany) {
            throw new ForbiddenException(
                'You do not have permission to view this subscription.',
            );
        }

        return subscription;
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateSubscription))
    async updateSubscription(
        @Param('id') id: string,
        @Body() data: TUpdateSubscription,
        @CurrentUser() user: TAuthUser,
    ): Promise<TSubscriptionWithPlan> {
        this.logger.log(`Updating subscription ${id}`);
        const canUpdate = this.rolesService.can(user, 'plan', 'update');
        if (!canUpdate) {
            throw new ForbiddenException(
                'You do not have permission to update subscriptions.',
            );
        }
        return this.subscriptionsService.update({ id }, data);
    }

    @Post('expire')
    @UseGuards(UserAuthGuard)
    async expireSubscriptions(@CurrentUser() user: TAuthUser): Promise<{
        message: string;
        expiredCount: number;
    }> {
        this.logger.log('Expiring subscriptions');
        const canUpdate = this.rolesService.can(user, 'plan', 'update');
        if (!canUpdate) {
            throw new ForbiddenException(
                'You do not have permission to expire subscriptions.',
            );
        }
        const expiredCount = await this.subscriptionsService.expireSubscriptions();
        return {
            message: `Expired ${expiredCount} subscriptions`,
            expiredCount,
        };
    }
}

