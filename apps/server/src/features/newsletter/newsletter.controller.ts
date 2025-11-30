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
import {
    TCreateNewsletter,
    TUpdateNewsletter,
    TNewsletterBasic,
    TNewsletterQueryFilter,
    TNewsletterListResponse,
    TNewsletterDetail,
    ZCreateNewsletter,
    ZUpdateNewsletter,
    ZNewsletterQueryFilter,
    ZNewsletterQueryUnique,
    TCreateNewsletterSubscription,
    TUpdateNewsletterSubscription,
    TNewsletterSubscription,
    TNewsletterSubscriptionQueryFilter,
    TNewsletterSubscriptionListResponse,
    TNewsletterSubscriptionDetail,
    ZCreateNewsletterSubscription,
    ZUpdateNewsletterSubscription,
    ZNewsletterSubscriptionQueryFilter,
    ZNewsletterSubscriptionQueryUnique,
    TAuthUser,
    TSessionBasic,
} from '@repo/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletters')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    // ==================== NEWSLETTER ENDPOINTS ====================

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateNewsletter))
    async createNewsletter(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateNewsletter,
    ): Promise<TNewsletterBasic> {
        return this.newsletterService.createNewsletter(data, user.id);
    }

    @Get()
    @UsePipes(QueryPipe(ZNewsletterQueryFilter as any))
    async getManyNewsletters(
        @Query() query: TNewsletterQueryFilter,
    ): Promise<TNewsletterListResponse> {
        return this.newsletterService.getManyNewsletters(query);
    }

    @Get(':id')
    @UsePipes(QueryPipe(ZNewsletterQueryUnique as any))
    async getOneNewsletter(@Param('id') id: string): Promise<TNewsletterDetail> {
        return this.newsletterService.getOneNewsletter({ id });
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateNewsletter))
    async updateNewsletter(
        @Param('id') id: string,
        @Body() data: TUpdateNewsletter,
    ): Promise<TNewsletterBasic> {
        return this.newsletterService.updateNewsletter({ id }, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZNewsletterQueryUnique as any))
    async deleteNewsletter(
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.newsletterService.deleteNewsletter({ id });
    }

    // ==================== NEWSLETTER SUBSCRIPTION ENDPOINTS ====================

    @Post('subscriptions')
    @HttpCode(201)
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateNewsletterSubscription))
    async createNewsletterSubscription(
        @CurrentSession() session: TSessionBasic | null,
        @Body() data: TCreateNewsletterSubscription,
    ): Promise<TNewsletterSubscription> {
        return this.newsletterService.createNewsletterSubscription(
            data,
            session?.userId,
        );
    }

    @Get('subscriptions')
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryFilter as any))
    async getManyNewsletterSubscriptions(
        @Query() query: TNewsletterSubscriptionQueryFilter,
    ): Promise<TNewsletterSubscriptionListResponse> {
        return this.newsletterService.getManyNewsletterSubscriptions(query);
    }

    @Get('subscriptions/email/:email')
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryUnique as any))
    async getOneNewsletterSubscriptionByEmail(
        @Param('email') email: string,
    ): Promise<TNewsletterSubscriptionDetail> {
        return this.newsletterService.getOneNewsletterSubscription({ email });
    }

    @Get('subscriptions/:id')
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryUnique as any))
    async getOneNewsletterSubscription(
        @Param('id') id: string,
    ): Promise<TNewsletterSubscriptionDetail> {
        return this.newsletterService.getOneNewsletterSubscription({ id });
    }

    @Put('subscriptions/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateNewsletterSubscription))
    async updateNewsletterSubscription(
        @Param('id') id: string,
        @Body() data: TUpdateNewsletterSubscription,
    ): Promise<TNewsletterSubscription> {
        return this.newsletterService.updateNewsletterSubscription({ id }, data);
    }

    @Post('subscriptions/:id/unsubscribe')
    @HttpCode(200)
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryUnique as any))
    async unsubscribeNewsletterSubscription(
        @Param('id') id: string,
    ): Promise<TNewsletterSubscription> {
        return this.newsletterService.unsubscribeNewsletterSubscription({ id });
    }

    @Post('subscriptions/email/:email/unsubscribe')
    @HttpCode(200)
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryUnique as any))
    async unsubscribeNewsletterSubscriptionByEmail(
        @Param('email') email: string,
    ): Promise<TNewsletterSubscription> {
        return this.newsletterService.unsubscribeNewsletterSubscription({ email });
    }

    @Delete('subscriptions/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZNewsletterSubscriptionQueryUnique as any))
    async deleteNewsletterSubscription(
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.newsletterService.deleteNewsletterSubscription({ id });
    }
}

