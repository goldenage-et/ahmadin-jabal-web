import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  TCreateCategory,
  TUpdateCategory,
  TCategoryBasic,
  ZCategory,
  TCategoryQueryUnique,
  TCategoryQueryFilter,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class CategoriesService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) {}

  async create(data: TCreateCategory): Promise<TCategoryBasic> {
    const categoryExists = await this.db.category.findFirst({
      where: { name: data.name },
    });

    if (categoryExists) {
      throw new ConflictException('Category with this name already exists');
    }

    const newCategory = await this.db.category.create({
      data: data,
    });

    return ZCategory.parse(newCategory);
  }

  async getMany(query?: TCategoryQueryFilter): Promise<TCategoryBasic[]> {
    const where: any = {};
    if (query?.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query?.parentId) {
      where.parentId = query.parentId;
    }
    const categories = await this.db.category.findMany({ where });
    return ZCategory.array().parse(categories);
  }

  async getOne(query: TCategoryQueryUnique): Promise<TCategoryBasic> {
    const category = await this.db.category.findUnique({
      where: { id: query.id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return ZCategory.parse(category);
  }

  async update(
    query: TCategoryQueryUnique,
    data: TUpdateCategory,
  ): Promise<TCategoryBasic> {
    const updatedCategory = await this.db.category.update({
      where: { id: query.id },
      data: data,
    });

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return ZCategory.parse(updatedCategory);
  }

  async delete(query: TCategoryQueryUnique): Promise<{ message: string }> {
    const deletedCategory = await this.db.category.delete({
      where: { id: query.id },
    });

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category deleted successfully' };
  }
}
