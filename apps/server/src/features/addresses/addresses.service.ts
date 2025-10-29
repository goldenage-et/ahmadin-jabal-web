import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  TAddress,
  TAddressQueryFilter,
  TAddressQueryUnique,
  TCreateAddress,
  TUpdateAddress,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class AddressesService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async create(userId: string, data: TCreateAddress): Promise<TAddress> {
    const newAddress = await this.db.address.create({
      data: {
        userId,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      },
    });

    return {
      id: newAddress.id,
      userId: newAddress.userId,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.zipCode,
      country: newAddress.country,
      createdAt: newAddress.createdAt,
      updatedAt: newAddress.updatedAt,
    } as TAddress;
  }

  async getMany(
    userId: string,
    filters?: TAddressQueryFilter,
  ): Promise<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters || {};

    // Build where conditions
    const where: any = {
      userId: userId,
    };

    if (search) {
      where.OR = [
        { street: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { zipCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await this.db.address.count({ where });

    // Build sort condition
    let orderBy: any = { createdAt: sortOrder };
    switch (sortBy) {
      case 'street':
        orderBy = { street: sortOrder };
        break;
      case 'city':
        orderBy = { city: sortOrder };
        break;
      case 'state':
        orderBy = { state: sortOrder };
        break;
      case 'country':
        orderBy = { country: sortOrder };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder };
        break;
    }
    console.log({ where });

    // Get paginated addresses
    const addresses = await this.db.address.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: [],
      total,
      page,
      limit,
      totalPages,
    } as any;
  }

  async getOne(userId: string, query: TAddressQueryUnique): Promise<TAddress> {
    const foundAddress = await this.db.address.findUnique({
      where: { id: query.id },
    });

    if (!foundAddress) {
      throw new NotFoundException('Address not found');
    }

    // Check if the address belongs to the user
    if (foundAddress.userId !== userId) {
      throw new UnauthorizedException('You can only access your own addresses');
    }

    return {
      id: foundAddress.id,
      userId: foundAddress.userId,
      street: foundAddress.street,
      city: foundAddress.city,
      state: foundAddress.state,
      zipCode: foundAddress.zipCode,
      country: foundAddress.country,
      createdAt: foundAddress.createdAt,
      updatedAt: foundAddress.updatedAt,
    } as TAddress;
  }

  async update(
    userId: string,
    query: TAddressQueryUnique,
    data: TUpdateAddress,
  ): Promise<TAddress> {
    // First check if the address exists and belongs to the user
    const existingAddress = await this.db.address.findUnique({
      where: { id: query.id },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    if (existingAddress.userId !== userId) {
      throw new UnauthorizedException('You can only update your own addresses');
    }

    const updatedAddress = await this.db.address.update({
      where: { id: query.id },
      data: { ...data, updatedAt: new Date() },
    });

    return {
      id: updatedAddress.id,
      userId: updatedAddress.userId,
      street: updatedAddress.street,
      city: updatedAddress.city,
      state: updatedAddress.state,
      zipCode: updatedAddress.zipCode,
      country: updatedAddress.country,
      createdAt: updatedAddress.createdAt,
      updatedAt: updatedAddress.updatedAt,
    } as TAddress;
  }

  async delete(userId: string, query: TAddressQueryUnique): Promise<boolean> {
    // First check if the address exists and belongs to the user
    const existingAddress = await this.db.address.findUnique({
      where: { id: query.id },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    if (existingAddress.userId !== userId) {
      throw new UnauthorizedException('You can only delete your own addresses');
    }

    await this.db.address.delete({
      where: { id: query.id },
    });

    return true;
  }

  // Admin method to get all addresses (for admin users)
  async getAllAddresses(filters?: TAddressQueryFilter): Promise<{
    data: TAddress[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      page = 1,
      limit = 10,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters || {};

    // Build where conditions
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { street: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { zipCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await this.db.address.count({ where });

    // Build sort condition
    let orderBy: any = { createdAt: sortOrder };
    switch (sortBy) {
      case 'street':
        orderBy = { street: sortOrder };
        break;
      case 'city':
        orderBy = { city: sortOrder };
        break;
      case 'state':
        orderBy = { state: sortOrder };
        break;
      case 'country':
        orderBy = { country: sortOrder };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder };
        break;
    }

    // Get paginated addresses
    const addresses = await this.db.address.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const mappedAddresses = addresses.map((address) => ({
      id: address.id,
      userId: address.userId,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }));

    const data = mappedAddresses as TAddress[];
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
