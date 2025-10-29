import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  EReviewStatus,
  TBookReviewQueryFilter,
  TCreateBookReview,
  TCreateReviewHelpful,
  TCreateReviewReport,
  TUpdateBookReview,
  ZBookReviewQueryFilter,
  ZCreateBookReview,
  ZCreateReviewHelpful,
  ZCreateReviewReport,
  ZUpdateBookReview,
} from '@repo/common';
import { z } from 'zod';
import { BookReviewsService } from './book-reviews.service';

@Controller('book-reviews')
export class BookReviewsController {
  constructor(private readonly bookReviewsService: BookReviewsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateBookReview))
  async createReview(
    @CurrentUser() user: { id: string },
    @Body() data: TCreateBookReview,
  ) {
    return this.bookReviewsService.createReview(user.id, data);
  }

  @Get()
  @UsePipes(QueryPipe(ZBookReviewQueryFilter))
  async getReviews(@Query() filters: TBookReviewQueryFilter) {
    return this.bookReviewsService.getReviews(filters);
  }

  @Put('bulk-moderate')
  @UseGuards(UserAuthGuard)
  @UsePipes(
    BodyPipe(
      z.object({
        reviewIds: z.array(z.string()),
        status: z.enum(EReviewStatus),
      }),
    ),
  )
  async bulkModerateReviews(
    @Body() data: { reviewIds: string[]; status: EReviewStatus },
  ) {
    console.log(data);
    return this.bookReviewsService.bulkModerateReviews(
      data.reviewIds,
      data.status,
    );
  }

  @Post('helpful')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateReviewHelpful))
  @HttpCode(HttpStatus.CREATED)
  async markHelpful(
    @CurrentUser() user: { id: string },
    @Body() data: TCreateReviewHelpful,
  ) {
    await this.bookReviewsService.markHelpful(user.id, data);
  }

  @Post('report')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateReviewReport))
  @HttpCode(HttpStatus.CREATED)
  async reportReview(
    @CurrentUser() user: { id: string },
    @Body() data: TCreateReviewReport,
  ) {
    await this.bookReviewsService.reportReview(user.id, data);
  }

  @Get('analytics/:bookId')
  @UseGuards(UserAuthGuard)
  async getReviewAnalytics(@Param('bookId') bookId: string) {
    return this.bookReviewsService.getReviewAnalytics(bookId);
  }

  @Get('pending/:storeId')
  @UseGuards(UserAuthGuard)
  async getPendingReviews(
    @Param('storeId') storeId: string,
    @Query() query: { page?: number; limit?: number },
  ) {
    return this.bookReviewsService.getPendingReviews(
      storeId,
      query.page || 1,
      query.limit || 10,
    );
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.bookReviewsService.getReviewById(id);
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateBookReview))
  async updateReview(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() data: TUpdateBookReview,
  ) {
    return this.bookReviewsService.updateReview(user.id, id, data);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    await this.bookReviewsService.deleteReview(user.id, id);
  }

  // Admin endpoints for review moderation
  @Put(':id/moderate')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(z.object({ status: z.enum(EReviewStatus) })))
  async moderateReview(
    @Param('id') id: string,
    @Body() data: { status: EReviewStatus },
  ) {
    return this.bookReviewsService.moderateReview(id, data.status);
  }

  @Get(':id/reports')
  @UseGuards(UserAuthGuard)
  async getReviewReports(@Param('id') id: string) {
    return this.bookReviewsService.getReviewReports(id);
  }
}
