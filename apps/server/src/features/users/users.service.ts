import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  TRegister,
  TUpdateMe,
  TUpdateUser,
  TUserBasic,
  TUserDetail,
  TUserQueryFilter,
  TUserQueryUnique,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';
import * as argon2 from 'argon2';
import { z } from 'zod';
@Injectable()
export class UsersService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async create(data: TRegister): Promise<TUserBasic> {
    const userExist = await this.db.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (userExist?.email === data.email.toLowerCase()) {
      throw new ConflictException('User already exist with this Email');
    }

    if (data.phone && userExist?.phone === data.phone.trim()) {
      throw new ConflictException('User already exist with this Phone Number');
    }

    const ltpHash = await argon2.hash(data.password);

    // Get the default "user" root role
    const defaultRole = await this.db.role.findFirst({
      where: { name: 'user' },
    });

    if (!defaultRole) {
      throw new Error('Default "user" root role not found. Please seed roles first.');
    }

    const newUser = await this.db.user.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email.toLowerCase(),
        ltpHash: ltpHash,
        emailVerified: false,
        active: true,
        roles: {
          connect: { id: defaultRole.id },
        },
        image: null,
      },
      include: {
        roles: true,
      },
    });

    const mappedUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      middleName: newUser.middleName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      emailVerified: newUser.emailVerified,
      active: newUser.active,
      roles: newUser.roles,
      image: newUser.image,
      systemOwner: false,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    return mappedUser as any as TUserBasic;
  }

  async getMany(filters?: TUserQueryFilter): Promise<{
    data: TUserBasic[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      search,
      page = 1,
      limit = 10,
      active,
      roles,
      deleted,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters || {};

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (deleted !== undefined) {
      if (deleted) {
        where.deletedAt = { not: null };
      } else {
        where.deletedAt = null;
      }
    }

    if (active !== undefined) {
      where.active = active;
    }

    if (roles && roles.length > 0) {
      where.roles = {
        some: {
          id: {
            in: roles,
          },
        },
      };
    }

    // Get total count for pagination
    const total = await this.db.user.count({ where });

    // Build sort condition
    let orderBy: any = { createdAt: sortOrder };
    switch (sortBy) {
      case 'firstName':
        orderBy = { firstName: sortOrder };
        break;
      case 'email':
        orderBy = { email: sortOrder };
        break;
      case 'active':
        orderBy = { active: sortOrder };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: sortOrder };
        break;
    }

    // Get paginated users
    const users = await this.db.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        roles: true,
      },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      active: user.active,
      roles: user.roles,
      image: user.image,
      systemOwner: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    const data = mappedUsers as any as TUserBasic[];
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getManyWithIds(filters: { ids: string[] }): Promise<TUserDetail[]> {
    const ids = filters.ids.filter((id) => z.string().safeParse(id).success);

    const users = await this.db.user.findMany({
      where: {
        id: { in: ids },
      },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      active: user.active,
      image: user.image,
      systemOwner: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    return mappedUsers as any as TUserDetail[];
  }

  async search(filters: TUserQueryFilter): Promise<TUserBasic[]> {
    const where: any = {};

    if (filters.deleted !== undefined) {
      if (filters.deleted) {
        where.deletedAt = { not: null };
      } else {
        where.deletedAt = null;
      }
    }

    if (filters.roles && filters.roles.length > 0) {
      where.roles = {
        some: {
          id: {
            in: filters.roles,
          },
        },
      };
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { middleName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const users = await this.db.user.findMany({
      where,
      include: {
        roles: true,
      },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      active: user.active,
      roles: user.roles || [],
      image: user.image,
      systemOwner: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
    return mappedUsers as any as TUserBasic[];
  }

  async getOne({
    detail,
    ...query
  }: TUserQueryUnique & { detail?: boolean }): Promise<
    TUserBasic | TUserDetail
  > {
    let foundUser;

    if (query.id) {
      foundUser = await this.db.user.findUnique({
        where: { id: query.id },
        include: {
          roles: true,
        },
      });
    } else if (query.email) {
      foundUser = await this.db.user.findUnique({
        where: { email: query.email },
        include: {
          roles: true,
        },
      });
    }

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const mappedUser = {
      id: foundUser.id,
      firstName: foundUser.firstName,
      middleName: foundUser.middleName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      phone: foundUser.phone,
      emailVerified: foundUser.emailVerified,
      active: foundUser.active,
      roles: foundUser.roles || [],
      image: foundUser.image,
      systemOwner: false,
      createdAt: foundUser.createdAt,
      updatedAt: foundUser.updatedAt,
    };

    return detail ? (mappedUser as any as TUserDetail) : (mappedUser as any as TUserBasic);
  }

  async update(
    filters: TUserQueryUnique,
    data: TUpdateUser | (TUpdateMe & { roles: undefined }),
  ): Promise<TUserBasic> {
    let userExist;

    if (filters.id) {
      userExist = await this.db.user.findUnique({
        where: { id: filters.id },
      });
    } else if (filters.email) {
      userExist = await this.db.user.findUnique({
        where: { email: filters.email },
      });
    }

    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    // Handle roles update if provided
    const { roles, ...updateData } = data as any;
    const updatePayload: any = { ...updateData, updatedAt: new Date() };

    if (roles && Array.isArray(roles)) {
      // Disconnect all existing roles and connect new ones
      updatePayload.roles = {
        set: [],
        connect: roles.map((roleId: string) => ({ id: roleId })),
      };
    }

    const updatedUser = await this.db.user.update({
      where: { id: userExist.id },
      data: updatePayload,
      include: {
        roles: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    const mappedUser = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      middleName: updatedUser.middleName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      emailVerified: updatedUser.emailVerified,
      active: updatedUser.active,
      roles: updatedUser.roles,
      image: updatedUser.image,
      systemOwner: false,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return mappedUser as any as TUserBasic;
  }

  async delete(filters: TUserQueryUnique): Promise<boolean> {
    await this.db.user.update({
      where: { id: filters.id },
      data: {
        deletedAt: new Date(),
      },
    });
    return true;
  }
}
