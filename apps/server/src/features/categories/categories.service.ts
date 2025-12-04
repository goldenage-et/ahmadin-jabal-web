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
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async create(data: TCreateCategory): Promise<TCategoryBasic> {
    // Check if category with same name already exists
    const categoryExists = await this.db.category.findFirst({
      where: { name: data.name },
    });

    if (categoryExists) {
      throw new ConflictException('Category with this name already exists');
    }

    // Check if slug already exists (if provided)
    if (data.slug) {
      const slugExists = await this.db.category.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Convert image object to JSON for Prisma
    const imageJson = data.image ? (data.image as unknown as any) : null;

    const newCategory = await this.db.category.create({
      data: {
        name: data.name,
        nameAm: data.nameAm,
        nameOr: data.nameOr,
        slug: data.slug,
        description: data.description,
        descriptionAm: data.descriptionAm,
        descriptionOr: data.descriptionOr,
        image: imageJson,
        iconName: data.iconName,
        backgroundColor: data.backgroundColor,
        parentId: data.parentId,
        active: data.active ?? true,
      },
    });

    // Convert image JSON back to object for schema validation
    const categoryWithImage = {
      ...newCategory,
      image: newCategory.image ? newCategory.image : null,
    };

    return ZCategory.parse(categoryWithImage);
  }

  async getMany(query?: TCategoryQueryFilter): Promise<TCategoryBasic[]> {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nameAm: { contains: query.search, mode: 'insensitive' } },
        { nameOr: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { descriptionAm: { contains: query.search, mode: 'insensitive' } },
        { descriptionOr: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.parentId) {
      where.parentId = query.parentId;
    }

    if (typeof query?.active === 'boolean') {
      where.active = query.active;
    }

    if (query?.slug) {
      where.slug = query.slug;
    }

    const categories = await this.db.category.findMany({
      where,
      take: query?.limit,
      skip: query?.offset,
    });

    // Convert image JSON back to object for schema validation
    const categoriesWithImages = categories.map(category => ({
      ...category,
      image: category.image ? category.image : null,
    }));

    return ZCategory.array().parse(categoriesWithImages);
  }

  async getOne(query: TCategoryQueryUnique): Promise<TCategoryBasic> {
    const category = await this.db.category.findUnique({
      where: { id: query.id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Convert image JSON back to object for schema validation
    const categoryWithImage = {
      ...category,
      image: category.image ? category.image : null,
    };

    return ZCategory.parse(categoryWithImage);
  }

  async update(
    query: TCategoryQueryUnique,
    data: TUpdateCategory,
  ): Promise<TCategoryBasic> {
    // Check if category exists
    const existingCategory = await this.db.category.findUnique({
      where: { id: query.id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    // Check if slug is being updated and if it conflicts
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await this.db.category.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.nameAm !== undefined) updateData.nameAm = data.nameAm;
    if (data.nameOr !== undefined) updateData.nameOr = data.nameOr;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.descriptionAm !== undefined) updateData.descriptionAm = data.descriptionAm;
    if (data.descriptionOr !== undefined) updateData.descriptionOr = data.descriptionOr;
    if (data.iconName !== undefined) updateData.iconName = data.iconName;
    if (data.backgroundColor !== undefined) updateData.backgroundColor = data.backgroundColor;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.active !== undefined) updateData.active = data.active;

    // Convert image object to JSON for Prisma
    if (data.image !== undefined) {
      updateData.image = data.image ? (data.image as unknown as any) : null;
    }

    const updatedCategory = await this.db.category.update({
      where: { id: query.id },
      data: updateData,
    });

    // Convert image JSON back to object for schema validation
    const categoryWithImage = {
      ...updatedCategory,
      image: updatedCategory.image ? updatedCategory.image : null,
    };

    return ZCategory.parse(categoryWithImage);
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
