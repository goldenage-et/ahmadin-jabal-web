import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  EReviewStatus,
  TBookReview,
  TBookReviewDetail,
  TBookReviewListResponse,
  TBookReviewQueryFilter,
  TCreateBookReview,
  TCreateReviewHelpful,
  TCreateReviewReport,
  TReviewAnalytics,
  TUpdateBookReview,
  ZBookReviewListResponse,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class BookReviewsService {
  constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

  async createReview(
    userId: string,
    data: TCreateBookReview,
  ): Promise<TBookReview> {
    // Check if book exists
    const book = await this.db.book.findUnique({
      where: { id: data.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Check if user already reviewed this book
    const existingReview = await this.db.bookReview.findFirst({
      where: {
        bookId: data.bookId,
        userId: userId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this book');
    }

    // Create the review
    const review = await this.db.bookReview.create({
      data: {
        ...data,
        userId,
        verified: !!data.orderId, // Mark as verified if orderId is provided
      },
    });

    // Update book rating and review count
    await this.updateBookRating(data.bookId);

    return review as TBookReview;
  }

  async getReviews(
    filters: TBookReviewQueryFilter,
  ): Promise<TBookReviewListResponse> {
    const { page, limit, sortBy, sortOrder, ...whereConditions } = filters;
    const offset = (page - 1) * limit;

    // Build where conditions
    const where: any = {};
    if (whereConditions.bookId) {
      where.bookId = whereConditions.bookId;
    }
    if (whereConditions.userId) {
      where.userId = whereConditions.userId;
    }
    if (whereConditions.rating) {
      where.rating = whereConditions.rating;
    }
    if (whereConditions.status) {
      where.status = whereConditions.status;
    }
    if (whereConditions.verified !== undefined) {
      where.verified = whereConditions.verified;
    }
    if (whereConditions.minRating) {
      where.rating = { ...where.rating, gte: whereConditions.minRating };
    }
    if (whereConditions.maxRating) {
      where.rating = { ...where.rating, lte: whereConditions.maxRating };
    }
    if (whereConditions.search) {
      where.OR = [
        { title: { contains: whereConditions.search, mode: 'insensitive' } },
        { comment: { contains: whereConditions.search, mode: 'insensitive' } },
      ];
    }

    // Build order by clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      case 'helpful':
        orderBy = { helpful: sortOrder };
        break;
      case 'updatedAt':
        orderBy = { updatedAt: sortOrder };
        break;
      default:
        orderBy = { createdAt: sortOrder };
    }

    // Get reviews with user information
    const reviews = await this.db.bookReview.findMany({
      where,
      include: {
        user: true,
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await this.db.bookReview.count({ where });

    const totalPages = Math.ceil(total / limit);

    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return ZBookReviewListResponse.parse({
      data: reviews,
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

  async getReviewById(id: string): Promise<TBookReviewDetail> {
    const review = await this.db.bookReview.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review as any;
  }

  async updateReview(
    userId: string,
    id: string,
    data: TUpdateBookReview,
  ): Promise<TBookReview> {
    // Check if review exists and belongs to user
    const existingReview = await this.getReviewById(id);
    if (existingReview.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    // Update the review
    const updatedReview = await this.db.bookReview.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Update book rating
    await this.updateBookRating(existingReview.bookId);

    return updatedReview as TBookReview;
  }

  async deleteReview(userId: string, id: string): Promise<void> {
    // Check if review exists and belongs to user
    const existingReview = await this.getReviewById(id);
    if (existingReview.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    // Delete the review
    await this.db.bookReview.delete({
      where: { id },
    });

    // Update book rating
    await this.updateBookRating(existingReview.bookId);
  }

  async markHelpful(userId: string, data: TCreateReviewHelpful): Promise<void> {
    // Check if user already marked this review as helpful/not helpful
    const existingHelpful = await this.db.reviewHelpful.findFirst({
      where: {
        reviewId: data.reviewId,
        userId: userId,
      },
    });

    if (existingHelpful) {
      // Update existing helpful vote
      await this.db.reviewHelpful.update({
        where: { id: existingHelpful.id },
        data: { helpful: data.helpful },
      });
    } else {
      // Create new helpful vote
      await this.db.reviewHelpful.create({
        data: {
          ...data,
          userId,
        },
      });
    }

    // Update helpful count on review
    await this.updateReviewHelpfulCount(data.reviewId);
  }

  async reportReview(userId: string, data: TCreateReviewReport): Promise<void> {
    // Check if user already reported this review
    const existingReport = await this.db.reviewReport.findFirst({
      where: {
        reviewId: data.reviewId,
        userId: userId,
      },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this review');
    }

    // Create the report
    await this.db.reviewReport.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getReviewAnalytics(bookId: string): Promise<TReviewAnalytics> {
    const reviews = await this.db.bookReview.findMany({
      where: { bookId },
      select: {
        rating: true,
        verified: true,
        status: true,
        createdAt: true,
      },
    });

    const approvedReviews = reviews.filter(
      (r) => r.status === EReviewStatus.approved,
    );
    const totalReviews = approvedReviews.length;
    const averageRating =
      totalReviews > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
      oneStar: approvedReviews.filter((r) => r.rating === 1).length,
      twoStar: approvedReviews.filter((r) => r.rating === 2).length,
      threeStar: approvedReviews.filter((r) => r.rating === 3).length,
      fourStar: approvedReviews.filter((r) => r.rating === 4).length,
      fiveStar: approvedReviews.filter((r) => r.rating === 5).length,
    };

    const verifiedReviews = approvedReviews.filter((r) => r.verified).length;
    const pendingReviews = reviews.filter(
      (r) => r.status === EReviewStatus.pending,
    ).length;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = reviews.filter(
      (r) => r.createdAt && new Date(r.createdAt) > thirtyDaysAgo,
    ).length;

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingDistribution,
      verifiedReviews,
      pendingReviews,
      recentReviews,
    };
  }

  private async updateBookRating(bookId: string): Promise<void> {
    // Get all approved reviews for the book
    const reviews = await this.db.bookReview.findMany({
      where: {
        bookId: bookId,
        status: EReviewStatus.approved,
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Update book with new rating and review count
    await this.db.book.update({
      where: { id: bookId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: totalReviews,
        updatedAt: new Date(),
      },
    });
  }

  private async updateReviewHelpfulCount(reviewId: string): Promise<void> {
    // Count helpful votes
    const helpfulCount = await this.db.reviewHelpful.count({
      where: {
        reviewId: reviewId,
        helpful: true,
      },
    });

    // Update review helpful count
    await this.db.bookReview.update({
      where: { id: reviewId },
      data: { helpful: helpfulCount },
    });
  }

  // Admin methods for review moderation
  async moderateReview(
    reviewId: string,
    status: EReviewStatus,
  ): Promise<TBookReview> {
    const updatedReview = await this.db.bookReview.update({
      where: { id: reviewId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    if (!updatedReview) {
      throw new NotFoundException('Review not found');
    }

    // Update book rating if review is approved/rejected
    if (
      status === EReviewStatus.approved ||
      status === EReviewStatus.rejected
    ) {
      await this.updateBookRating(updatedReview.bookId);
    }

    return updatedReview as TBookReview;
  }

  async bulkModerateReviews(
    reviewIds: string[],
    status: EReviewStatus,
  ): Promise<{ updated: number }> {
    // First get the bookIds before updating
    const reviews = await this.db.bookReview.findMany({
      where: { id: { in: reviewIds } },
      select: { bookId: true },
    });

    const result = await this.db.bookReview.updateMany({
      where: { id: { in: reviewIds } },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Update book ratings for affected books
    const bookIds = [...new Set(reviews.map((r) => r.bookId))];
    for (const bookId of bookIds) {
      await this.updateBookRating(bookId);
    }

    return { updated: result.count };
  }

  async getReviewReports(reviewId: string): Promise<any[]> {
    return await this.db.reviewReport.findMany({
      where: { reviewId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingReviews(
    bookId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<TBookReviewListResponse> {
    const offset = (page - 1) * limit;

    const reviews = await this.db.bookReview.findMany({
      where: {
        status: EReviewStatus.pending,
        bookId: bookId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await this.db.bookReview.count({
      where: {
        status: EReviewStatus.pending,
        bookId: bookId,
      },
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    return ZBookReviewListResponse.parse({
      data: reviews,
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
}
