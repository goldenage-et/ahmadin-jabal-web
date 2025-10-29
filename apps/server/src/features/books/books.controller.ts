import { CurrentSession } from '@/decorators/current-session.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard, UserAuthOptions } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  EBookStatus,
  TAuthUser,
  TBookAnalytics,
  TBookBasic,
  TBookDetailAnalytics,
  TBookListResponse,
  TBookQueryFilter,
  TBookSpecification,
  TBookSpecificationQueryFilter,
  TBulkBook,
  TCreateBook,
  TCreateBookSpecification,
  TSearchSuggestion,
  TSessionBasic,
  TUpdateBook,
  TUpdateBookSpecification,
  ZBookQueryFilter,
  ZBookQueryUnique,
  ZBookSpecificationQueryFilter,
  ZBookSpecificationQueryUnique,
  ZBulkBook,
  ZCreateBook,
  ZCreateBookSpecification,
  ZUpdateBook,
  ZUpdateBookSpecification,
} from '@repo/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateBook))
  async create(
    @CurrentSession() session: TSessionBasic,
    @Body() data: TCreateBook,
  ): Promise<TBookBasic> {
    return this.booksService.create(data);
  }

  @Get()
  @UserAuthOptions({ safeAuth: true })
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookQueryFilter))
  getMany(
    @CurrentSession() session: TSessionBasic,
    @Query() query: TBookQueryFilter,
  ): Promise<TBookListResponse> {
    if (session) {
      return this.booksService.getMany({
        ...query,
        status: EBookStatus.active,
        userId: session.userId,
      });
    }
    return this.booksService.getMany({
      ...query,
      status: EBookStatus.active,
    });
  }

  @Get('my')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookQueryFilter))
  getMyMany(
    @CurrentUser() user: TAuthUser,
    @Query() query: TBookQueryFilter,
  ): Promise<TBookListResponse> {
    return this.booksService.getMany({ ...query, userId: user.id });
  }

  @Get('analytics')
  @UseGuards(UserAuthGuard)
  getBookAnalytics(
    @CurrentUser() user: TAuthUser,
  ): Promise<TBookAnalytics> {
    return this.booksService.getBookAnalytics();
  }

  @Get('search-suggestion')
  @UserAuthOptions({ safeAuth: true })
  @UseGuards(UserAuthGuard)
  getSearchSuggestion(
    @CurrentSession() session: TSessionBasic | null,
  ): Promise<TSearchSuggestion> {
    return this.booksService.getSearchSuggestion({
      userId: session?.userId,
    });
  }

  @Put()
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZBulkBook))
  bulkOperation(@Body() data: TBulkBook): Promise<{ message: string }> {
    return this.booksService.bulkOperation(data);
  }

  @Get(':id')
  @UserAuthOptions({ safeAuth: true })
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookQueryUnique))
  getOne(
    @Param('id') id: string,
  ): Promise<TBookBasic> {
    console.log({ id });
    return this.booksService.getOne({ id });
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateBook))
  update(
    @Param('id') id: string,
    @Body() data: TUpdateBook,
    @CurrentUser() user: TAuthUser,
  ): Promise<TBookBasic> {
    return this.booksService.update({ id }, { ...data });
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookQueryUnique))
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.booksService.delete({ id });
  }

  @Get(':id/analytics')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookQueryUnique))
  getBookDetailAnalytics(
    @Param('id') id: string,
  ): Promise<TBookDetailAnalytics> {
    return this.booksService.getBookDetailAnalytics({ id });
  }

  // Book Specifications Endpoints
  @Get(':bookId/specifications')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookSpecificationQueryFilter))
  getSpecifications(
    @Param('bookId') bookId: string,
    @Query() query: TBookSpecificationQueryFilter,
  ): Promise<TBookSpecification[]> {
    return this.booksService.getSpecifications(bookId, { ...query });
  }

  @Post(':bookId/specifications')
  @HttpCode(201)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateBookSpecification))
  createSpecification(
    @Param('bookId') bookId: string,
    @Body() data: TCreateBookSpecification,
  ): Promise<TBookSpecification> {
    return this.booksService.createSpecification(bookId, { ...data });
  }

  @Get(':bookId/specifications/:id')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookSpecificationQueryUnique))
  getSpecification(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
  ): Promise<TBookSpecification> {
    return this.booksService.getSpecification(bookId, id);
  }

  @Put(':bookId/specifications/:id')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateBookSpecification))
  updateSpecification(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @Body() data: TUpdateBookSpecification,
  ): Promise<TBookSpecification> {
    return this.booksService.updateSpecification(bookId, id, data);
  }

  @Delete(':bookId/specifications/:id')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZBookSpecificationQueryUnique))
  deleteSpecification(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.booksService.deleteSpecification(bookId, id);
  }
}
