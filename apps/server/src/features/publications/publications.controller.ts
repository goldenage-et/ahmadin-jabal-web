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
    TCreatePublication,
    TCreatePublicationComment,
    TPublicationBasic,
    TPublicationComment,
    TPublicationDetail,
    TPublicationListResponse,
    TPublicationQueryFilter,
    TPublicationQueryUnique,
    TAuthUser,
    TSessionBasic,
    TUpdatePublication,
    TUpdatePublicationComment,
} from '@repo/common';
import {
    ZCreatePublication,
    ZCreatePublicationComment,
    ZPublicationQueryFilter,
    ZPublicationQueryUnique,
    ZUpdatePublication,
    ZUpdatePublicationComment,
} from '@repo/common';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
    constructor(
        private readonly publicationsService: PublicationsService,
    ) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreatePublication))
    async create(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreatePublication,
    ): Promise<TPublicationBasic> {
        return this.publicationsService.create(user.id, data);
    }

    @Get()
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPublicationQueryFilter))
    async getMany(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Query() query: TPublicationQueryFilter,
    ): Promise<TPublicationListResponse> {
        return this.publicationsService.getMany({
            ...query,
            userId: session?.userId,
            user: user,
        });
    }

    @Get('my')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPublicationQueryFilter))
    async getMyMany(
        @CurrentUser() user: TAuthUser,
        @Query() query: TPublicationQueryFilter,
    ): Promise<TPublicationListResponse> {
        return this.publicationsService.getMany({
            ...query,
            authorId: user.id,
            userId: user.id,
            user: user,
        });
    }

    @Get(':id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPublicationQueryUnique))
    async getOne(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Param('id') id: string,
    ): Promise<TPublicationDetail> {
        return this.publicationsService.getOne({ id }, session?.userId, user);
    }

    @Get('slug/:slug')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    async getOneBySlug(
        @CurrentUser() user: TAuthUser | null,
        @CurrentSession() session: TSessionBasic | null,
        @Param('slug') slug: string,
    ): Promise<TPublicationDetail> {
        return this.publicationsService.getOne({ slug }, session?.userId, user);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdatePublication))
    async update(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() data: TUpdatePublication,
    ): Promise<TPublicationBasic> {
        return this.publicationsService.update({ id }, user.id, data);
    }

    @Put('slug/:slug')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdatePublication))
    async updateBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
        @Body() data: TUpdatePublication,
    ): Promise<TPublicationBasic> {
        return this.publicationsService.update({ slug }, user.id, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPublicationQueryUnique))
    async delete(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.publicationsService.delete({ id }, user.id);
    }

    @Delete('slug/:slug')
    @UseGuards(UserAuthGuard)
    async deleteBySlug(
        @CurrentUser() user: TAuthUser,
        @Param('slug') slug: string,
    ): Promise<{ message: string }> {
        return this.publicationsService.delete({ slug }, user.id);
    }

    @Post(':id/like')
    @UseGuards(UserAuthGuard)
    async likePublication(
        @Param('id') id: string,
    ): Promise<{ likeCount: number }> {
        return this.publicationsService.incrementLikeCount(id);
    }

    @Post(':id/download')
    @UseGuards(UserAuthGuard)
    async downloadPublication(
        @Param('id') id: string,
    ): Promise<{ downloadCount: number }> {
        return this.publicationsService.incrementDownloadCount(id);
    }

    // Comment endpoints
    @Post(':id/comments')
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreatePublicationComment))
    async createComment(
        @CurrentUser() user: TAuthUser,
        @Param('id') publicationId: string,
        @Body() data: TCreatePublicationComment,
    ): Promise<TPublicationComment> {
        return this.publicationsService.createComment(
            publicationId,
            user.id,
            data,
        );
    }

    @Get(':id/comments')
    async getComments(
        @Param('id') publicationId: string,
    ): Promise<TPublicationComment[]> {
        return this.publicationsService.getComments(publicationId);
    }

    @Put('comments/:commentId')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdatePublicationComment))
    async updateComment(
        @CurrentUser() user: TAuthUser,
        @Param('commentId') commentId: string,
        @Body() data: TUpdatePublicationComment,
    ): Promise<TPublicationComment> {
        return this.publicationsService.updateComment(commentId, user.id, data);
    }

    @Delete('comments/:commentId')
    @UseGuards(UserAuthGuard)
    async deleteComment(
        @CurrentUser() user: TAuthUser,
        @Param('commentId') commentId: string,
    ): Promise<{ message: string }> {
        return this.publicationsService.deleteComment(commentId, user.id);
    }
}

