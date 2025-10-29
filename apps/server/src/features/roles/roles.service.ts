import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEngine, TRole, ZRole } from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class RolesService extends RoleEngine {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) {
    super();
  }
  // Root Roles CRUD
  async createRole(data: {
    name: string;
    active?: boolean;
    permission: TRole['permission'];
  }): Promise<TRole> {
    const existing = await this.db.role.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('Root role with this name already exists');
    }

    const role = await this.db.role.create({
      data: {
        name: data.name,
        active: data.active ?? true,
        permission: data.permission as any,
      },
    });

    return ZRole.parse({
      ...role,
      permission: role.permission as any,
    });
  }

  async getRoles(): Promise<TRole[]> {
    const roles = await this.db.role.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return roles.map((role) =>
      ZRole.parse({
        ...role,
        permission: role.permission as any,
      }),
    );
  }

  async getRoleById(id: string): Promise<TRole> {
    const role = await this.db.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Root role with id ${id} not found`);
    }

    return ZRole.parse({
      ...role,
      permission: role.permission as any,
    });
  }

  async updateRole(
    id: string,
    data: Partial<{
      name: string;
      active: boolean;
      permission: TRole['permission'];
    }>,
  ): Promise<TRole> {
    const existing = await this.db.role.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Root role with id ${id} not found`);
    }

    if (existing.name === 'owner') {
      throw new ForbiddenException('Cannot update owner root role');
    }

    if (data.name && data.name !== existing.name) {
      const nameExists = await this.db.role.findFirst({
        where: { name: data.name },
      });

      if (nameExists) {
        throw new ConflictException('Root role with this name already exists');
      }
    }

    const updated = await this.db.role.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.permission && { permission: data.permission as any }),
      },
    });

    return ZRole.parse({
      ...updated,
      permission: updated.permission as any,
    });
  }

  async deleteRole(id: string): Promise<void> {
    const existing = await this.db.role.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!existing) {
      throw new NotFoundException(`Root role with id ${id} not found`);
    }

    if (existing.users.length > 0) {
      throw new ConflictException(
        'Cannot delete root role that is assigned to users',
      );
    }

    await this.db.role.delete({
      where: { id },
    });
  }
}
