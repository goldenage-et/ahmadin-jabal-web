import { CurrentSession } from '@/decorators/current-session.decorator';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard, UserAuthOptions } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
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
import type {
    TArticleBasic,
    TArticleDetail,
    TArticleQueryFilter,
    TArticleQueryUnique,
    TAuthUser,
    TCreateArticle,
    TSessionBasic,
    TUpdateArticle,
} from '@repo/common';
import {
    ZArticleQueryFilter,
    ZArticleQueryUnique,
    ZCreateArticle,
    ZUpdateArticle,
} from '@repo/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateArticle))
    async create(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateArticle,
    ): Promise<TArticleBasic> {
        return this.articlesService.create(user.id, data);
    }

    @Get()
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZArticleQueryFilter))
    async getMany(
        @CurrentSession() session: TSessionBasic | null,
        @Query() query: TArticleQueryFilter,
    ): Promise<{ data: TArticleBasic[]; meta: any }> {
        return this.articlesService.getMany({
            ...query,
            userId: session?.userId,
        });
    }

    @Get('my')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZArticleQueryFilter))
    async getMyMany(
        @CurrentUser() user: TAuthUser,
        @Query() query: TArticleQueryFilter,
    ): Promise<{ data: TArticleBasic[]; meta: any }> {
        return this.articlesService.getMany({
            ...query,
            authorId: user.id,
            userId: user.id,
        });
    }

    @Get(':id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZArticleQueryUnique))
    async getOne(
        @CurrentSession() session: TSessionBasic | null,
        @Param('id') id: string,
    ): Promise<TArticleDetail> {
        return this.articlesService.getOne({ id }, session?.userId);
    }

    @Get('slug/:slug')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    async getOneBySlug(
        @CurrentSession() session: TSessionBasic | null,
        @Param('slug') slug: string,
    ): Promise<TArticleDetail> {
        return this.articlesService.getOne({ slug }, session?.userId);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateArticle))
    async update(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() data: TUpdateArticle,
    ): Promise<TArticleBasic> {
        return this.articlesService.update({ id }, user.id, data);
    }

    @Put('slug/:slug')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateArticle))
    async updateBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
        @Body() data: TUpdateArticle,
    ): Promise<TArticleBasic> {
        return this.articlesService.update({ slug }, user.id, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZArticleQueryUnique))
    async delete(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.articlesService.delete({ id }, user.id);
    }

    @Delete('slug/:slug')
    @UseGuards(UserAuthGuard)
    async deleteBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
    ): Promise<{ message: string }> {
        return this.articlesService.delete({ slug }, user.id);
    }

    @Post(':id/like')
    @UseGuards(UserAuthGuard)
    async likeArticle(@Param('id') id: string): Promise<{ likeCount: number }> {
        return this.articlesService.incrementLikeCount(id);
    }
}

