import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes
} from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
    EPaymentStatus,
    TAuthUser,
    TCreatePayment,
    TPaymentQueryFilter,
    TUpdatePayment,
    ZCreatePayment,
    ZPaymentQueryFilter,
    ZUpdatePayment,
} from '@repo/common';
import { RolesService } from '../roles/roles.service';
import { PaymentsService } from './payments.service';

@Controller('payments')
@UseGuards(UserAuthGuard)
export class PaymentsController {
    constructor(private paymentsService: PaymentsService, private rolesService: RolesService) { }

    @Post()
    @UsePipes(BodyPipe(ZCreatePayment))
    async create(@CurrentUser() user: TAuthUser, @Body() data: TCreatePayment) {
        return this.paymentsService.create(data);
    }

    @Get()
    @UsePipes(QueryPipe(ZPaymentQueryFilter))
    async getMany(@CurrentUser() user: TAuthUser, @Query() query: TPaymentQueryFilter) {
        // Regular users can only see their own payments
        const canViewAll = this.rolesService.can(user, 'payment', 'viewMany');
        if (!canViewAll) {
            query.userId = user.id;
        }
        return this.paymentsService.getMany(query);
    }

    @Get('order/:orderId')
    async getByOrder(@CurrentUser() user: TAuthUser, @Param('orderId') orderId: string) {
        // Regular users can only see their own payments
        const query: TPaymentQueryFilter = {
        };
        const canViewAll = this.rolesService.can(user, 'payment', 'viewMany');
        if (!canViewAll) {
            query.userId = user.id;
        }
        return this.paymentsService.getByOrder(orderId, query.userId);
    }

    @Get(':id')
    async getOne(@CurrentUser() user: TAuthUser, @Param('id') id: string) {
        const query: TPaymentQueryFilter = {
        };
        const canViewOne = this.rolesService.can(user, 'payment', 'viewOne');
        if (!canViewOne) {
            query.userId = user.id;
        }
        return this.paymentsService.getOne(id, query.userId as string);
    }

    @Put(':id')
    @UsePipes(BodyPipe(ZUpdatePayment))
    async update(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() data: TUpdatePayment,
    ) {
        // Regular users can only update their own payments
        const canUpdate = this.rolesService.can(user, 'payment', 'update');
        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update payments.');
        }
        return this.paymentsService.update(id, data, user.id);
    }

    @Put(':id/status')
    async updateStatus(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() body: { status: EPaymentStatus; metadata?: any },
    ) {
        return this.paymentsService.updateStatus(id, body.status, body.metadata);
    }

    @Post('complete-payment')
    async completePayment(
        @CurrentUser() user: TAuthUser,
        @Body() body: {
            orderId: string;
            bankCode: string;
            referenceNumber: string;
            bankAccountId: string;
        },
    ) {
        return this.paymentsService.completePayment(
            body.orderId,
            body.bankCode,
            body.referenceNumber,
            body.bankAccountId,
            user.id,
        );
    }

    @Post('confirm-bank-transfer')
    async confirmBankTransfer(
        @CurrentUser() user: TAuthUser,
        @Body() body: {
            orderId: string;
            referenceNumber: string;
            receiptData: any;
        },
    ) {
        return this.paymentsService.confirmBankTransfer(
            body.orderId,
            body.referenceNumber,
            body.receiptData,
            user.id,
        );
    }
}

