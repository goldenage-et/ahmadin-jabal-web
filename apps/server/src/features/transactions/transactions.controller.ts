import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
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
    TAuthUser,
    TTransactionQueryFilter,
    TUpdateTransaction,
    ZTransactionQueryFilter,
    ZUpdateTransaction
} from '@repo/common';
import { RolesService } from '../roles/roles.service';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(UserAuthGuard)
export class TransactionsController {
    constructor(private transactionsService: TransactionsService, private readonly rolesService: RolesService) { }

    @Get()
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZTransactionQueryFilter))
    async getMany(@CurrentUser() user: TAuthUser, @Query() query: TTransactionQueryFilter) {
        const canViewMany = this.rolesService.can(user, 'payment', 'viewMany');
        if (!canViewMany) {
            throw new ForbiddenException('You are not authorized to view many transactions');
        }
        return this.transactionsService.getMany(query);
    }

    @Get('payment/:paymentId')
    @UseGuards(UserAuthGuard)
    async getByPayment(@CurrentUser() user: TAuthUser, @Param('paymentId') paymentId: string) {
        const canViewOne = this.rolesService.can(user, 'payment', 'viewOne');
        if (!canViewOne) {
            throw new ForbiddenException('You are not authorized to view this transaction');
        }
        // Regular users can only see their own transactions
        return this.transactionsService.getByPayment(paymentId);
    }

    @Get('order/:orderId')
    @UseGuards(UserAuthGuard)
    async getByOrder(@CurrentUser() user: TAuthUser, @Param('orderId') orderId: string) {
        const canViewOne = this.rolesService.can(user, 'payment', 'viewOne');
        if (!canViewOne) {
            throw new ForbiddenException('You are not authorized to view this transaction');
        }
        // Regular users can only see their own transactions
        return this.transactionsService.getByOrder(orderId);
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    async getOne(@CurrentUser() user: TAuthUser, @Param('id') id: string) {
        const canViewOne = this.rolesService.can(user, 'payment', 'viewOne');
        if (!canViewOne) {
            throw new ForbiddenException('You are not authorized to view this transaction');
        }
        // Regular users can only see their own transactions
        return this.transactionsService.getOne(id);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateTransaction))
    async update(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() data: TUpdateTransaction,
    ) {
        const canUpdate = this.rolesService.can(user, 'payment', 'update');
        if (!canUpdate) {
            throw new ForbiddenException('You are not authorized to update this transaction');
        }
        return this.transactionsService.update(id, data);
    }
}
