import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import {
  TOrderBasic,
  TUserBasic,
  ZOrderBasic,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async getMyProfile(userId: string): Promise<{
    user: TUserBasic;
    totalOrders: number;
    totalSpent: number;
    addresses: any[];
  }> {
    this.logger.log(`Getting profile for user ${userId}`);

    // Get user data
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get order statistics
    const orderStats = await this.db.order.aggregate({
      _count: true,
      _sum: { total: true },
      where: { userId: userId },
    });


    const stats = orderStats[0] || { totalOrders: 0n, totalSpent: '0.00' };
    const addresses: any[] = [];

    return {
      user: user,
      totalOrders: Number(stats.totalOrders),
      totalSpent: parseFloat(stats.totalSpent),
      addresses,
    };
  }

  async getMyOrders(userId: string): Promise<TOrderBasic[]> {
    this.logger.log(`Getting orders for user ${userId}`);

    const orders = await this.db.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ZOrderBasic.array().parse(orders);
  }

  async getMyAddresses(userId: string): Promise<any[]> {
    this.logger.log(`Getting addresses for user ${userId}`);

    const addresses = await this.db.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return addresses;
  }

  async addAddress(
    userId: string,
    data: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      isDefault?: boolean;
    },
  ): Promise<any> {
    this.logger.log(`Adding address for user ${userId}`);

    // If this is set as default, unset other default addresses
    if (data.isDefault) {
      await this.db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await this.db.address.create({
      data: {
        ...data,
        userId,
        isDefault: data.isDefault || false,
      },
    });

    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      isDefault?: boolean;
    },
  ): Promise<any> {
    this.logger.log(`Updating address ${addressId} for user ${userId}`);

    // Verify the address belongs to the user
    const existingAddress = await this.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // If this is set as default, unset other default addresses
    if (data.isDefault) {
      await this.db.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await this.db.address.update({
      where: { id: addressId },
      data: {
        ...data,
        isDefault: data.isDefault || false,
      },
    });

    return address;
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    this.logger.log(`Deleting address ${addressId} for user ${userId}`);

    // Verify the address belongs to the user
    const existingAddress = await this.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    await this.db.address.delete({
      where: { id: addressId },
    });
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    this.logger.log(`Setting default address ${addressId} for user ${userId}`);

    // Verify the address belongs to the user
    const existingAddress = await this.db.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // Unset all other default addresses for this user
    await this.db.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set this address as default
    await this.db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
