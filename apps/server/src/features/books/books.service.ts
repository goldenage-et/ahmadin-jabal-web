import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import generatePassword from '@/utils/passwordGenerator';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EBookStatus,
  ESearchAnalyticsSource,
  TBulkBook,
  TCreateBook,
  TCreateBookSpecification,
  TBookAnalytics,
  TBookBasic,
  TBookDetail,
  TBookDetailAnalytics,
  TBookListResponse,
  TBookQueryFilter,
  TBookQueryUnique,
  TBookSpecification,
  TBookSpecificationQueryFilter,
  TSearchSuggestion,
  TUpdateBook,
  TUpdateBookSpecification,
  ZBookBasic,
  ZBookDetail,
  ZBookListResponse,
  ZBookSpecification,
  ZSearchAnalyticsEvent,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';
@Injectable()
export class BooksService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async create(data: TCreateBook): Promise<TBookBasic> {
    const book = await this.db.book.create({
      data: {
        price: data.price,
        purchasePrice: data.purchasePrice,
        images: data.images,
        publisher: data.publisher,
        isbn: data.isbn,
        author: data.author,
        inventoryQuantity: data.inventoryQuantity,
        inventoryLowStockThreshold: data.inventoryLowStockThreshold,
        tags: data.tags,
        specifications: data.specifications,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        title: data.title,
        description: data.description,
      },
    });

    return ZBookBasic.parse(book);
  }

  async getMany(
    query: TBookQueryFilter & { userId?: string },
  ): Promise<TBookListResponse> {
    const where: any = {};

    if (query.categoryName) {
      const decodedCategoryName = decodeURIComponent(query.categoryName);
      where.category = {
        name: decodedCategoryName,
      }
    }

    if (query.subcategoryName) {
      const decodedSubcategoryName = decodeURIComponent(query.subcategoryName);
      where.subcategory = {
        name: decodedSubcategoryName,
      }
    }

    if (query.status) {
      where.status = query.status;
    }

    if (typeof query.featured === 'boolean') {
      where.featured = query.featured;
    }

    if (typeof query.minPrice === 'number') {
      where.price = { ...where.price, gte: query.minPrice };
    }

    if (typeof query.maxPrice === 'number') {
      where.price = { ...where.price, lte: query.maxPrice };
    }

    if (typeof query.minRating === 'number') {
      where.rating = { ...where.rating, gte: query.minRating };
    }

    if (typeof query.maxRating === 'number') {
      where.rating = { ...where.rating, lte: query.maxRating };
    }

    if (typeof query.inStock === 'boolean') {
      if (query.inStock) {
        where.inventoryQuantity = { gt: 0 };
      } else {
        where.inventoryQuantity = 0;
      }
    }

    if (typeof query.lowStock === 'boolean') {
      if (query.lowStock) {
        where.AND = [
          { inventoryQuantity: { gt: 0 } },
          {
            OR: [
              {
                inventoryQuantity: {
                  lte: { inventoryLowStockThreshold: true },
                },
              },
              {
                AND: [
                  { inventoryLowStockThreshold: null },
                  { inventoryQuantity: { lte: 5 } },
                ],
              },
            ],
          },
        ];
      }
    }

    if (query.createdAfter) {
      where.createdAt = { ...where.createdAt, gte: query.createdAfter };
    }

    if (query.createdBefore) {
      where.createdAt = { ...where.createdAt, lte: query.createdBefore };
    }

    if (query.updatedAfter) {
      where.updatedAt = { ...where.updatedAt, gte: query.updatedAfter };
    }

    if (query.updatedBefore) {
      where.updatedAt = { ...where.updatedAt, lte: query.updatedBefore };
    }

    if (query.tags && Array.isArray(query.tags) && query.tags.length > 0) {
      where.tags = {
        hasSome: query.tags,
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: query.sortOrder || 'desc' };
    switch (query.sortBy) {
      case 'title':
        orderBy = { title: query.sortOrder || 'desc' };
        break;
      case 'price':
        orderBy = { price: query.sortOrder || 'desc' };
        break;
      case 'updatedAt':
        orderBy = { updatedAt: query.sortOrder || 'desc' };
        break;
      case 'featured':
        orderBy = { featured: query.sortOrder || 'desc' };
        break;
      case 'rating':
        orderBy = { rating: query.sortOrder || 'desc' };
        break;
      case 'reviewCount':
        orderBy = { reviewCount: query.sortOrder || 'desc' };
        break;
      case 'createdAt':
      default:
        orderBy = { createdAt: query.sortOrder || 'desc' };
        break;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const total = await this.db.book.count({ where });

    const books = await this.db.book.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    if (query.search) {
      const existingEvent = await this.db.searchAnalyticsEvent.findMany({
        where: {
          query: { contains: query.search },
        },
      });

      if (existingEvent.length === 0) {
        await this.db.searchAnalyticsEvent.create({
          data: {
            query: query.search,
            userId: query.userId,
            filters: query,
            resultCount: total,
            source: ESearchAnalyticsSource.shopPage,
            searchCount: 1,
          },
        });
      } else {
        const filteredEvent = existingEvent.filter(
          (event) =>
            event.userId !== query.userId && event.resultCount !== total,
        );
        await Promise.all(
          filteredEvent.map(async (event) => {
            await this.db.searchAnalyticsEvent.update({
              where: { id: event.id },
              data: { resultCount: total, searchCount: event.searchCount + 1 },
            });
          }),
        );
      }
    }

    return ZBookListResponse.parse({
      data: books,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  }

  async getOne(query: TBookQueryUnique): Promise<TBookDetail> {
    const book = await this.db.book.findUnique({
      where: { id: query.id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return ZBookDetail.parse(book);
  }

  async update(
    query: TBookQueryUnique,
    data: TUpdateBook,
  ): Promise<TBookBasic> {
    // Check if book exists
    const existingBook = await this.db.book.findUnique({
      where: { id: query.id },
    });

    if (!existingBook) {
      throw new NotFoundException('Book not found');
    }

    const updatedBook = await this.db.book.update({
      where: { id: query.id },
      data: data,
    });

    return ZBookBasic.parse(updatedBook);
  }

  async bulkOperation(data: TBulkBook): Promise<{ message: string }> {
    if (data.delete.length > 0) {
      await this.db.book.deleteMany({
        where: { id: { in: data.delete.map((p) => p.id) } },
      });
    }

    if (data.update.length > 0) {
      await Promise.all(
        data.update.map(async (input) => {
          const updateData: Record<string, any> = {};
          if (input.status !== undefined) {
            updateData.status = input.status;
          }
          if (input.featured !== undefined) {
            updateData.featured = input.featured;
          }
          if (Object.keys(updateData).length > 0) {
            await this.db.book.update({
              where: { id: input.id },
              data: updateData,
            });
          }
        }),
      );
    }

    return { message: 'Books updated successfully' };
  }

  async getBookAnalytics(): Promise<TBookAnalytics> {
    // Total books in store
    const totalBooks = await this.db.book.count({
    });

    // Active books
    const activeBooks = await this.db.book.count({
      where: {
        status: EBookStatus.active,
      },
    });

    // Draft books
    const draftBooks = await this.db.book.count({
      where: {
        status: EBookStatus.draft,
      },
    });

    // Archived books
    const archivedBooks = await this.db.book.count({
      where: {
        status: EBookStatus.archived,
      },
    });

    // Featured books
    const featuredBooks = await this.db.book.count({
      where: {
        featured: true,
      },
    });

    // Out of stock books
    const outOfStockBooks = await this.db.book.count({
      where: {
        inventoryQuantity: 0,
      },
    });

    // Low stock books (arbitrary threshold, e.g., < 5)
    const lowStockBooks = await this.db.book.count({
      where: {
        AND: [
          { inventoryQuantity: { gt: 0 } },
          { inventoryQuantity: { lt: 5 } },
        ],
      },
    });

    return {
      totalBooks,
      activeBooks,
      draftBooks,
      archivedBooks,
      featuredBooks,
      outOfStockBooks,
      lowStockBooks,
    };
  }

  async getBookDetailAnalytics(
    query: TBookQueryUnique,
  ): Promise<TBookDetailAnalytics> {
    // Get the book
    const book = await this.db.book.findUnique({
      where: { id: query.id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // For the specific book, we'll use the book's own data
    const avgRating = book.rating || 0;
    const totalReviews = book.reviewCount || 0;
    const totalSales = book.saleCount || 0;
    const totalRevenue = book.saleAmount || 0;
    const inventoryValue =
      (book.inventoryQuantity || 0) * (book.price || 0);
    const lowStockItems = (book.inventoryQuantity || 0) < 5 ? 1 : 0;

    // Sales data (last 7 days, daily)
    const salesData: Array<{
      date: string;
      sales: number;
      revenue: number;
    }> = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);

      // You may want to join with an orders table for real sales data
      // Here, we use book's sales/revenue/views as placeholders
      salesData.push({
        date: dayStr,
        sales: totalSales,
        revenue: totalRevenue,
      });
    }

    // Top variants (by sales)
    // Category breakdown (for this book, just one category)
    const categoryBreakdown = [
      {
        category: book.categoryId || 'Uncategorized',
        sales: totalSales,
        percentage: 100,
      },
    ];

    // Monthly trends (last 6 months)
    const monthlyTrends: Array<{
      month: string;
      sales: number;
      revenue: number;
    }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = month.toISOString().slice(0, 7);

      // Use book's sales/revenue/views as placeholders
      monthlyTrends.push({
        month: monthStr,
        sales: totalSales,
        revenue: totalRevenue,
      });
    }

    const averageRating = Math.round((avgRating ?? 0) * 10) / 10;

    return {
      overview: {
        averageRating,
        totalReviews,
        totalSales,
        totalRevenue,
        inventoryValue,
        lowStockItems,
      },
      salesData,
      monthlyTrends,
      categoryBreakdown,
    };
  }

  async getSearchSuggestion(query: {
    userId?: string;
  }): Promise<TSearchSuggestion> {

    const popularEvents = await this.db.searchAnalyticsEvent.findMany({
      orderBy: [{ searchCount: 'desc' }, { createdAt: 'desc' }],
      take: 10,
    });

    const trendingEvents = await this.db.searchAnalyticsEvent.findMany({
      orderBy: [{ createdAt: 'desc' }, { searchCount: 'desc' }],
      take: 10,
    });

    const recentEvents = query.userId ? await this.db.searchAnalyticsEvent.findMany({
      where: { userId: query.userId },
      orderBy: [{ createdAt: 'desc' }, { searchCount: 'desc' }],
      take: 10,
    }) : [];


    return {
      popularEvents: ZSearchAnalyticsEvent.array().parse(popularEvents),
      trendingEvents: ZSearchAnalyticsEvent.array().parse(trendingEvents),
      recentEvents: ZSearchAnalyticsEvent.array().parse(recentEvents),
    };
  }

  async delete(query: TBookQueryUnique): Promise<{ message: string }> {
    const book = await this.db.book.findUnique({
      where: { id: query.id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.db.book.delete({
      where: { id: query.id },
    });

    return { message: 'Book deleted successfully' };
  }

  // Book Specifications Methods
  async createSpecification(
    bookId: string,
    data: TCreateBookSpecification,
  ): Promise<TBookSpecification> {
    // Get the book to access its current specifications
    const book = await this.db.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Get current specifications array
    const currentSpecifications = Array.isArray(book.specifications)
      ? book.specifications
      : [];

    // Create new specification object
    const newSpecification = {
      id: generatePassword(10),
      name: data.name,
      value: data.value,
    };

    // Add new specification to the array
    const updatedSpecifications = [...currentSpecifications, newSpecification];

    // Update the book with the new specifications
    await this.db.book.update({
      where: { id: bookId },
      data: { specifications: updatedSpecifications },
    });

    return ZBookSpecification.parse(newSpecification);
  }

  async getSpecifications(
    bookId: string,
    query: TBookSpecificationQueryFilter,
  ): Promise<TBookSpecification[]> {
    // Get the specific book first
    const book = await this.db.book.findUnique({
      where: { id: bookId },
      select: { specifications: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Get specifications from the specific book
    const specifications = Array.isArray(book.specifications)
      ? book.specifications
      : [];

    // Filter by name if provided
    let filteredSpecifications = specifications;
    if (query.name) {
      filteredSpecifications = specifications.filter((spec: any) =>
        spec.name?.toLowerCase().includes(query.name!.toLowerCase()),
      );
    }

    // Sort by createdAt
    filteredSpecifications.sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return ZBookSpecification.array().parse(filteredSpecifications);
  }

  async getSpecification(
    bookId: string,
    id: string,
  ): Promise<TBookSpecification> {
    // Get the specific book first
    const book = await this.db.book.findUnique({
      where: { id: bookId },
      select: { specifications: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Find the specification in the book's specifications array
    const specifications = Array.isArray(book.specifications)
      ? book.specifications
      : [];
    const foundSpecification = specifications.find((s: any) => s.id === id);

    if (!foundSpecification) {
      throw new NotFoundException('Book specification not found');
    }

    return ZBookSpecification.parse(foundSpecification);
  }

  async updateSpecification(
    bookId: string,
    specificationId: string,
    data: TUpdateBookSpecification,
  ): Promise<TBookSpecification> {
    // Get the specific book first
    const book = await this.db.book.findUnique({
      where: { id: bookId },
      select: { specifications: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Find the specification in the book's specifications array
    const specifications = Array.isArray(book.specifications)
      ? book.specifications
      : [];
    const specIndex = specifications.findIndex(
      (s: any) => s.id === specificationId,
    );

    if (specIndex === -1) {
      throw new NotFoundException('Book specification not found');
    }

    // Update the specification
    const updatedSpecifications = [...specifications];
    updatedSpecifications[specIndex] = {
      ...(specifications[specIndex] as any),
      ...data,
    };

    // Update the book with the modified specifications
    await this.db.book.update({
      where: { id: bookId },
      data: { specifications: updatedSpecifications },
    });

    return ZBookSpecification.parse(updatedSpecifications[specIndex]);
  }

  async deleteSpecification(
    bookId: string,
    specificationId: string,
  ): Promise<{ message: string }> {
    // Get the specific book first
    const book = await this.db.book.findUnique({
      where: { id: bookId },
      select: { specifications: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Find the specification in the book's specifications array
    const specifications = Array.isArray(book.specifications)
      ? book.specifications
      : [];
    const specIndex = specifications.findIndex(
      (s: any) => s.id === specificationId,
    );

    if (specIndex === -1) {
      throw new NotFoundException('Book specification not found');
    }

    // Remove the specification from the array
    const updatedSpecifications = specifications.filter(
      (s: any) => s.id !== specificationId,
    );

    // Update the book with the modified specifications
    await this.db.book.update({
      where: { id: bookId },
      data: { specifications: updatedSpecifications },
    });

    return { message: 'Book specification deleted successfully' };
  }
}
