import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  EOrderStatus,
  EPaymentStatus,
  TAuthUser,
  TCreateOrder,
  TOrderDetail,
  TOrderMini,
  TOrderQueryFilter,
  TUpdateOrder,
  ZCreateOrder,
  ZOrderQueryFilter,
  ZUpdateOrder
} from '@repo/common';
import { RolesService } from '../roles/roles.service';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(UserAuthGuard)
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService, private rolesService: RolesService) { }

  @Post()
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateOrder.array()))
  async create(
    @Body() data: TCreateOrder[],
    @CurrentUser() user: TAuthUser,

  ): Promise<TOrderMini[]> {
    this.logger.log(`Creating order`);
    return this.ordersService.create(user, data);
  }

  @Get()
  @UsePipes(QueryPipe(ZOrderQueryFilter))
  getMany(
    @CurrentUser() user: TAuthUser,
    @Query() query: TOrderQueryFilter,
  ): Promise<{ orders: TOrderMini[]; total: number }> {

    const allow = this.rolesService.can(user, 'order', 'viewMany')
    if (!allow) throw new ForbiddenException(`User Not Allow to view order`)

    return this.ordersService.getMany(user.id, query);
  }

  @Get('my')
  @UsePipes(QueryPipe(ZOrderQueryFilter))
  async getMyOrders(
    @CurrentUser() user: TAuthUser,
    @Query() query: TOrderQueryFilter,
  ): Promise<{ orders: TOrderMini[]; total: number }> {
    this.logger.log(`Getting orders for user ${user.id} with query:`, query);
    return this.ordersService.getMyOrders(user.id, query);
  }

  @Get('my/:id')
  async getMyOrderDetails(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
  ): Promise<TOrderDetail> {
    this.logger.log(`Getting order details for user ${user.id}, order ${id}`);
    return this.ordersService.getMyOrderDetails(user.id, id);
  }

  @Post('my/:id/cancel')
  async cancelMyOrder(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ): Promise<TOrderDetail> {
    this.logger.log(`Cancelling order ${id} for user ${user.id}`);
    return this.ordersService.cancelMyOrder(user.id, id, body.reason);
  }

  @Post('my/:id/return')
  async requestReturn(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
    @Body() body: { reason?: string; items?: string[] },
  ): Promise<TOrderDetail> {
    this.logger.log(`Return request for order ${id} by user ${user.id}`);
    return this.ordersService.requestReturn(user.id, id, body.reason, body.items);
  }

  @Get('my/:id/tracking')
  async getMyOrderTracking(
    @CurrentUser() user: TAuthUser,
    @Param('id') id: string,
  ): Promise<{
    orderNumber: string;
    status: string;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    shippingMethod: string;
    statusHistory: any[];
  }> {
    this.logger.log(`Getting tracking info for order ${id}, user ${user.id}`);
    return this.ordersService.getMyOrderTracking(user.id, id);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @CurrentUser() user: TAuthUser,
  ): Promise<TOrderDetail> {
    return this.ordersService.getOne(user.id, id);
  }

  @Put(':id')
  @UsePipes(BodyPipe(ZUpdateOrder))
  async update(
    @Param('id') id: string,
    @Body() data: TUpdateOrder,
    @CurrentUser() user: TAuthUser,
  ): Promise<TOrderMini> {
    return this.ordersService.update(id, data, user);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: TAuthUser,
  ): Promise<{ message: string }> {
    await this.ordersService.delete(id, user);
    return { message: 'Order deleted successfully' };
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: EOrderStatus; notes?: string },
    @CurrentUser() user: TAuthUser,
  ): Promise<TOrderMini> {
    return this.ordersService.updateStatus(
      id,
      body.status,
      user,
      body.notes,
    );
  }



  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { paymentStatus: EPaymentStatus },
    @CurrentUser() user: TAuthUser,
  ): Promise<TOrderMini> {
    return this.ordersService.updatePaymentStatus(
      id,
      body.paymentStatus,
      user,
    );
  }

  @Put(':id/tracking')
  async updateTrackingNumber(
    @Param('id') id: string,
    @Body() body: { trackingNumber: string },
    @CurrentUser() user: TAuthUser,
  ): Promise<TOrderMini> {
    return this.ordersService.addTrackingNumber(
      id,
      body.trackingNumber,
      user,
    );
  }
}
