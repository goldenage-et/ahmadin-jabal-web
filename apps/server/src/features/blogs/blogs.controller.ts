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
    TBlogBasic,
    TBlogDetail,
    TBlogQueryFilter,
    TBlogQueryUnique,
    TAuthUser,
    TCreateBlog,
    TSessionBasic,
    TUpdateBlog,
} from '@repo/common';
import {
    ZBlogQueryFilter,
    ZBlogQueryUnique,
    ZCreateBlog,
    ZUpdateBlog,
} from '@repo/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateBlog))
    async create(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateBlog,
    ): Promise<TBlogBasic> {
        return this.blogsService.create(user.id, data);
    }

    @Get()
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZBlogQueryFilter))
    async getMany(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Query() query: TBlogQueryFilter,
    ): Promise<{ data: TBlogBasic[]; meta: any }> {
        return this.blogsService.getMany({
            ...query,
            userId: session?.userId,
            user: user,
        });
    }

    @Get('my')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZBlogQueryFilter))
    async getMyMany(
        @CurrentUser() user: TAuthUser,
        @Query() query: TBlogQueryFilter,
    ): Promise<{ data: TBlogBasic[]; meta: any }> {
        return this.blogsService.getMany({
            ...query,
            authorId: user.id,
            userId: user.id,
            user: user,
        });
    }

    @Get(':id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZBlogQueryUnique))
    async getOne(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Param('id') id: string,
    ): Promise<TBlogDetail> {
        return this.blogsService.getOne({ id }, session?.userId, user);
    }

    @Get('slug/:slug')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    async getOneBySlug(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Param('slug') slug: string,
    ): Promise<TBlogDetail> {
        return this.blogsService.getOne({ slug }, session?.userId, user);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateBlog))
    async update(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() data: TUpdateBlog,
    ): Promise<TBlogBasic> {
        return this.blogsService.update({ id }, user.id, data);
    }

    @Put('slug/:slug')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateBlog))
    async updateBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
        @Body() data: TUpdateBlog,
    ): Promise<TBlogBasic> {
        return this.blogsService.update({ slug }, user.id, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZBlogQueryUnique))
    async delete(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.blogsService.delete({ id }, user.id);
    }

    @Delete('slug/:slug')
    @UseGuards(UserAuthGuard)
    async deleteBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
    ): Promise<{ message: string }> {
        return this.blogsService.delete({ slug }, user.id);
    }

    @Post(':id/like')
    @UseGuards(UserAuthGuard)
    async likeBlog(@Param('id') id: string): Promise<{ likeCount: number }> {
        return this.blogsService.incrementLikeCount(id);
    }
}

