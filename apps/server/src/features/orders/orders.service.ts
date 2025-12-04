import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EOrderStatus,
  EPaymentStatus,
  EShippingMethod,
  generateCode,
  TCreateOrder,
  TOrderBasic,
  TOrderDetail,
  TOrderMini,
  TOrderQueryFilter,
  TOrderStatusHistory,
  TUpdateOrder,
  TUserBasic,
  ZOrderBasic,
  ZOrderDetail,
  ZOrderMini
} from '@repo/common';
import { PaymentMethod, PrismaClient } from '@repo/prisma';
import { v4 as createId } from 'uuid';
@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(PRISMA_CLIENT) private readonly db: PrismaClient,

  ) { }

  async create(user: TUserBasic, data: TCreateOrder[]): Promise<TOrderMini[]> {
    this.logger.log(`Creating order`);
    const orderNumber = generateCode('ORD');
    this.logger.log(`Order number: ${orderNumber}`);
    const orderPromises = data.map(async (orderData) => {
      const subtotal = orderData.quantity * orderData.price;
      const tax = orderData.tax || 0;
      const shipping = orderData.shipping || 0;
      const discount = orderData.discount || 0;
      const total = subtotal + tax + shipping - discount;

      const statusHistory: TOrderStatusHistory = {
        id: createId(),
        status: EOrderStatus.pending,
        notes: 'Order created',
        updatedBy: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        createdAt: new Date(),
      };
      // Log shipping address data for debugging
      this.logger.log(`Shipping address data: ${JSON.stringify(orderData.shippingAddress)}`);
      const paymentMethod = orderData.paymentMethod as unknown as PaymentMethod;
      // Create order
      const order = await this.db.order.create({
        data: {
          userId: user.id,
          quantity: orderData.quantity,
          bookId: orderData.bookId,
          orderNumber: orderNumber,
          status: orderData.status || EOrderStatus.pending,
          paymentStatus: orderData.paymentStatus || EPaymentStatus.pending,
          paymentMethod: paymentMethod,
          shippingAddress: orderData.shippingAddress,
          subtotal: subtotal,
          tax: tax,
          shipping: shipping,
          discount: discount,
          total: total,
          currency: orderData.currency || 'ETB',
          shippingMethod: orderData.shippingMethod || EShippingMethod.standard,
          notes: orderData.notes,
          customerNotes: orderData.customerNotes,
          statusHistory: [statusHistory],
        }
      });

      this.logger.log(`Created order shipping address: ${JSON.stringify(order.shippingAddress)}`);

      return order
    });
    const orders = await Promise.all(orderPromises);
    this.logger.log(`Orders created: ${orders.length}`);
    return ZOrderMini.array().parse(orders);
  }

  async getMany(
    userId: string,
    query: TOrderQueryFilter,
  ): Promise<{ orders: TOrderBasic[]; total: number }> {
    this.logger.log(`Getting orders for user ${userId}`);

    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    const offset = (page - 1) * limit;

    // Build where conditions
    const where: any = {
      userId: userId,
    };

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.orderNumber = { contains: search, mode: 'insensitive' };
    }

    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
    }

    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    }

    // Get total count
    const totalCount = await this.db.order.count({ where });

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get orders with pagination
    const orders = await this.db.order.findMany({
      where,
      include: {
        user: true,
        book: true,
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    return {
      orders: ZOrderBasic.array().parse(orders),
      total: totalCount,
    };
  }

  async getOne(
    orderId: string,
    userId: string,
  ): Promise<TOrderDetail> {

    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        user: true,
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return ZOrderDetail.parse(order);;
  }

  async update(
    orderId: string,
    data: TUpdateOrder,
    user: TUserBasic,
  ): Promise<TOrderMini> {

    // Check if order exists and belongs to store
    const existingOrder = await this.getOne(orderId, user.id);

    // If status changed, add to history
    const statusHistory = Array.isArray(existingOrder.statusHistory)
      ? [...existingOrder.statusHistory]
      : [];
    if (data.status && data.status !== existingOrder.status) {
      statusHistory.push({
        id: createId(),
        status: data.status,
        notes: data.notes || `Status changed to ${data.status}`,
        updatedBy: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        createdAt: new Date(),
      });
    }

    const updatedOrder = await this.db.order.update({
      where: {
        id: orderId,
        userId: user.id,
      },
      data: {
        ...data,
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod as unknown as PaymentMethod,
        shippingAddress: data.shippingAddress,
        subtotal: data.subtotal ? data.subtotal : undefined,
        tax: data.tax ? data.tax : undefined,
        shipping: data.shipping ? data.shipping : undefined,
        discount: data.discount ? data.discount : undefined,
        total: data.total ? data.total : undefined,
        updatedAt: new Date(),
        statusHistory: statusHistory,
      },
    });

    return ZOrderMini.parse(updatedOrder);
  }

  async delete(orderId: string, user: TUserBasic): Promise<void> {
    try {
      await this.db.order.delete({
        where: {
          id: orderId,
          userId: user.id,
        },
      });
    } catch (error) {
      throw new NotFoundException('Order not found');
    }
  }

  async updateStatus(
    orderId: string,
    status: EOrderStatus,
    user: TUserBasic,
    notes?: string,
  ): Promise<TOrderMini> {
    this.logger.log(`Updating order ${orderId} status to ${status}`);

    const existingOrder = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    if (existingOrder.status === status) {
      throw new BadRequestException('Order already has this status');
    }

    const statusHistory = {
      id: createId(),
      status,
      notes,
      updatedBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      createdAt: new Date(),
    };

    const currentStatusHistory = Array.isArray(existingOrder.statusHistory)
      ? existingOrder.statusHistory
      : [];
    const updatedOrder = await this.db.order.update({
      where: {
        id: orderId,
      },
      data: {
        statusHistory: [...currentStatusHistory, statusHistory],
        status: status,
      },
    });

    if (!updatedOrder) {
      throw new NotFoundException('Order not found');
    }

    return ZOrderMini.parse(updatedOrder);
  }

  async addPayment(
    orderId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionId: string,
    user: TUserBasic,
  ): Promise<TOrderMini> {
    this.logger.log(
      `Adding payment to order ${orderId} for user ${user.id}, amount: ${amount}`
    );

    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Optional: Check if payment covers order.total and set paymentStatus
    let newPaymentStatus = EPaymentStatus.pending;
    const totalPaid = ((order.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)) + amount;
    if (totalPaid >= order.total) {
      newPaymentStatus = EPaymentStatus.paid;
    }

    // Add payment record to payments (assume payments is array on order)
    const newPayment = {
      id: createId(),
      amount,
      paymentMethod,
      transactionId,
      createdAt: new Date(),
      createdBy: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };

    const currentPayments = Array.isArray(order.payments) ? order.payments : [];
    const updatedOrder = await this.db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: newPaymentStatus,
      },
    });

    return ZOrderMini.parse(updatedOrder);
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: EPaymentStatus,
    user: TUserBasic,
  ): Promise<TOrderMini> {
    this.logger.log(
      `Updating order ${orderId} payment status to ${paymentStatus}`,
    );

    const updatedOrder = await this.update(
      orderId,
      { paymentStatus },
      user,
    );
    return ZOrderMini.parse(updatedOrder);
  }

  async addTrackingNumber(
    orderId: string,
    trackingNumber: string,
    user: TUserBasic,
  ): Promise<TOrderMini> {
    this.logger.log(`Adding tracking number to order ${orderId}`);

    const updatedOrder = await this.update(
      orderId,
      { trackingNumber },
      user,
    );
    return ZOrderMini.parse(updatedOrder);
  }

  async getMyOrders(userId: string, query: TOrderQueryFilter = {}): Promise<{ orders: TOrderMini[]; total: number }> {
    this.logger.log(`Getting orders for user ${userId} with query:`, query);

    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
    } = query;

    // Build where clause
    const where: any = {
      userId: userId
    };

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { orderItems: { some: { productName: { contains: search, mode: 'insensitive' } } } },
        { orderItems: { some: { productSku: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Build order by clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get total count
    const total = await this.db.order.count({ where });

    // Get orders with pagination
    const orders = await this.db.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { orders: ZOrderMini.array().parse(orders), total };
  }

  async getMyOrderDetails(userId: string, orderId: string): Promise<TOrderDetail> {
    this.logger.log(`Getting order details for user ${userId}, order ${orderId}`);

    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        user: true,
        book: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return ZOrderDetail.parse(order);
  }

  async cancelMyOrder(userId: string, orderId: string, reason?: string): Promise<TOrderDetail> {
    this.logger.log(`Cancelling order ${orderId} for user ${userId}`);

    // Get the order first
    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        user: true,
        book: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order can be cancelled (only pending or confirmed orders)
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.status}. Only pending or confirmed orders can be cancelled.`
      );
    }

    // Prepare cancellation notes
    const cancellationNote = reason
      ? `Order cancelled by customer. Reason: ${reason}`
      : 'Order cancelled by customer.';

    // Update order status to cancelled
    const updatedOrder = await this.db.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        notes: cancellationNote,
        customerNotes: reason || order.customerNotes,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        book: true,
      },
    });

    // TODO: Add status history entry with cancellation reason
    // TODO: Trigger refund if payment was already made
    // TODO: Send cancellation email notification with reason

    return ZOrderDetail.parse(updatedOrder);
  }

  async requestReturn(
    userId: string,
    orderId: string,
    reason?: string,
    items?: string[]
  ): Promise<TOrderDetail> {
    this.logger.log(`Processing return request for order ${orderId} by user ${userId}`);

    // Get the order first
    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        user: true,
        book: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order can be returned (only delivered orders)
    if (order.status !== 'delivered') {
      throw new BadRequestException(
        `Cannot request return for order with status: ${order.status}. Only delivered orders can be returned.`
      );
    }

    // Check if order is within return window (e.g., 30 days)
    const deliveredDate = order.updatedAt;
    const daysSinceDelivery = Math.floor(
      (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const returnWindowDays = 30;

    if (daysSinceDelivery > returnWindowDays) {
      throw new BadRequestException(
        `Return window has expired. Orders can only be returned within ${returnWindowDays} days of delivery.`
      );
    }

    // Prepare return request notes
    let returnNote = 'Return requested by customer.';
    if (reason) {
      returnNote += ` Reason: ${reason}`;
    }
    if (items && items.length > 0) {
      returnNote += ` Items: ${items.join(', ')}`;
    }

    // Update order with return request information
    const updatedOrder = await this.db.order.update({
      where: { id: orderId },
      data: {
        // You might want to add a returnStatus field to your schema
        notes: order.notes
          ? `${order.notes}\n\n${returnNote}`
          : returnNote,
        customerNotes: reason
          ? (order.customerNotes ? `${order.customerNotes}\n\nReturn reason: ${reason}` : `Return reason: ${reason}`)
          : order.customerNotes,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        book: true,
      },
    });

    // TODO: Create a separate returns table entry
    // TODO: Send return request notification email to customer and admin
    // TODO: Add status history entry for return request
    // TODO: Update order status to 'return_requested' (requires schema update)

    return ZOrderDetail.parse(updatedOrder);
  }

  async getMyOrderTracking(userId: string, orderId: string): Promise<{
    orderNumber: string;
    status: string;
    trackingNumber: string | null;
    estimatedDelivery: Date | null;
    shippingMethod: string;
    statusHistory: any[];
  }> {
    this.logger.log(`Getting tracking info for order ${orderId}, user ${userId}`);

    const order = await this.db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      select: {
        orderNumber: true,
        status: true,
        trackingNumber: true,
        estimatedDelivery: true,
        shippingMethod: true,
        statusHistory: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Parse status history from JSON
    let statusHistory: any[] = [];
    if (order.statusHistory) {
      try {
        statusHistory = Array.isArray(order.statusHistory)
          ? order.statusHistory
          : [];
      } catch (error) {
        this.logger.error('Error parsing status history:', error);
        statusHistory = [];
      }
    }

    // If no status history, create a basic one from order data
    if (statusHistory.length === 0) {
      statusHistory = [
        {
          status: order.status,
          timestamp: order.updatedAt,
          notes: 'Current order status',
        },
      ];
    }

    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      shippingMethod: order.shippingMethod,
      statusHistory,
    };
  }
}
