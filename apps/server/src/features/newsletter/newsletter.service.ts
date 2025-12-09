import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    Inject,
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import {
    TCreateNewsletter,
    TUpdateNewsletter,
    TNewsletterBasic,
    TNewsletterQueryFilter,
    TNewsletterQueryUnique,
    TNewsletterListResponse,
    TNewsletterDetail,
    ZNewsletterBasic,
    ZNewsletterListResponse,
    ZNewsletterDetail,
    TAuthUser,
    TCreateNewsletterSubscription,
    TUpdateNewsletterSubscription,
    TNewsletterSubscription,
    TNewsletterSubscriptionQueryFilter,
    TNewsletterSubscriptionQueryUnique,
    TNewsletterSubscriptionListResponse,
    TNewsletterSubscriptionDetail,
    ZNewsletterSubscription,
    ZNewsletterSubscriptionListResponse,
    ZNewsletterSubscriptionDetail,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';
import { getContentAccessLevel, isPremiumUser } from '@/helpers/premium-access.helper';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class NewsletterService {
    constructor(
        @Inject(PRISMA_CLIENT) private readonly db: PrismaClient,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    // ==================== NEWSLETTER CRUD ====================

    async createNewsletter(
        data: TCreateNewsletter,
        createdBy: string,
    ): Promise<TNewsletterBasic> {
        const newsletter = await this.db.newsletter.create({
            data: {
                ...data,
                createdBy,
            } as any,
        });

        return ZNewsletterBasic.parse(newsletter);
    }

    async getManyNewsletters(
        query: TNewsletterQueryFilter & { user?: TAuthUser | null },
    ): Promise<TNewsletterListResponse> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.createdBy) {
            where.createdBy = query.createdBy;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { subject: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'title':
                orderBy = { title: query.sortOrder || 'desc' };
                break;
            case 'scheduledAt':
                orderBy = { scheduledAt: query.sortOrder || 'desc' };
                break;
            case 'sentAt':
                orderBy = { sentAt: query.sortOrder || 'desc' };
                break;
            case 'recipientCount':
                orderBy = { recipientCount: query.sortOrder || 'desc' };
                break;
            case 'openedCount':
                orderBy = { openedCount: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.newsletter.count({ where });

        const newsletters = await this.db.newsletter.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        // Apply premium access control - hide full content for non-premium users
        const hasActiveSubscription = query.user
            ? await this.subscriptionsService.hasActiveSubscription(query.user.id)
            : false;
        const newslettersWithAccessControl = newsletters.map(newsletter => {
            const accessLevel = getContentAccessLevel(query.user || null, newsletter.isPremium, hasActiveSubscription);
            if (accessLevel === 'preview' && newsletter.isPremium) {
                // For preview, hide full content but keep title and subject
                return {
                    ...newsletter,
                    content: null,
                    contentAm: null,
                    contentOr: null,
                };
            }
            return newsletter;
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZNewsletterListResponse.parse({
            data: newslettersWithAccessControl,
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

    async getOneNewsletter(
        query: TNewsletterQueryUnique,
        user?: TAuthUser | null,
    ): Promise<TNewsletterDetail> {
        const newsletter = await this.db.newsletter.findUnique({
            where: { id: query.id },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!newsletter) {
            throw new NotFoundException('Newsletter not found');
        }

        // Check premium access (check subscription)
        const hasActiveSubscription = user
            ? await this.subscriptionsService.hasActiveSubscription(user.id)
            : false;
        const accessLevel = getContentAccessLevel(user || null, newsletter.isPremium, hasActiveSubscription);
        if (accessLevel === 'preview' && newsletter.isPremium) {
            // Return preview version (title, subject, but no full content)
            const newsletterPreview = {
                ...newsletter,
                content: null,
                contentAm: null,
                contentOr: null,
            };
            return ZNewsletterDetail.parse(newsletterPreview);
        }

        return ZNewsletterDetail.parse(newsletter);
    }

    async updateNewsletter(
        query: TNewsletterQueryUnique,
        data: TUpdateNewsletter,
    ): Promise<TNewsletterBasic> {
        const updatedNewsletter = await this.db.newsletter.update({
            where: { id: query.id },
            data: data as any,
        });

        if (!updatedNewsletter) {
            throw new NotFoundException('Newsletter not found');
        }

        return ZNewsletterBasic.parse(updatedNewsletter);
    }

    async deleteNewsletter(
        query: TNewsletterQueryUnique,
    ): Promise<{ message: string }> {
        const deletedNewsletter = await this.db.newsletter.delete({
            where: { id: query.id },
        });

        if (!deletedNewsletter) {
            throw new NotFoundException('Newsletter not found');
        }

        return { message: 'Newsletter deleted successfully' };
    }

    // ==================== NEWSLETTER SUBSCRIPTION CRUD ====================

    async createNewsletterSubscription(
        data: TCreateNewsletterSubscription,
        userId?: string,
    ): Promise<TNewsletterSubscription> {
        // Check if subscription already exists
        const existingSubscription = await this.db.newsletterSubscription.findUnique({
            where: { email: data.email },
        });

        if (existingSubscription) {
            // If already exists and unsubscribed, reactivate it
            if (existingSubscription.status === 'unsubscribed') {
                const updated = await this.db.newsletterSubscription.update({
                    where: { email: data.email },
                    data: {
                        status: 'subscribed',
                        unsubscribedAt: null,
                        name: data.name,
                        source: data.source,
                        metadata: data.metadata,
                        userId: userId || existingSubscription.userId,
                    } as any,
                });
                return ZNewsletterSubscription.parse(updated);
            }
            throw new ConflictException('Email is already subscribed');
        }

        const subscription = await this.db.newsletterSubscription.create({
            data: {
                ...data,
                userId: userId || null,
            } as any,
        });

        return ZNewsletterSubscription.parse(subscription);
    }

    async getManyNewsletterSubscriptions(
        query: TNewsletterSubscriptionQueryFilter,
    ): Promise<TNewsletterSubscriptionListResponse> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.source) {
            where.source = { contains: query.source, mode: 'insensitive' };
        }

        if (query.userId) {
            where.userId = query.userId;
        }

        if (query.search) {
            where.OR = [
                { email: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { subscribedAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'email':
                orderBy = { email: query.sortOrder || 'desc' };
                break;
            case 'name':
                orderBy = { name: query.sortOrder || 'desc' };
                break;
            case 'subscribedAt':
            default:
                orderBy = { subscribedAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.newsletterSubscription.count({ where });

        const subscriptions = await this.db.newsletterSubscription.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZNewsletterSubscriptionListResponse.parse({
            data: subscriptions,
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

    async getOneNewsletterSubscription(
        query: TNewsletterSubscriptionQueryUnique,
    ): Promise<TNewsletterSubscriptionDetail> {
        const where = query.id ? { id: query.id } : { email: query.email };
        const subscription = await this.db.newsletterSubscription.findUnique({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!subscription) {
            throw new NotFoundException('Newsletter subscription not found');
        }

        return ZNewsletterSubscriptionDetail.parse(subscription);
    }

    async updateNewsletterSubscription(
        query: TNewsletterSubscriptionQueryUnique,
        data: TUpdateNewsletterSubscription,
    ): Promise<TNewsletterSubscription> {
        const where = query.id ? { id: query.id } : { email: query.email };
        const updatedSubscription = await this.db.newsletterSubscription.update({
            where,
            data: data as any,
        });

        if (!updatedSubscription) {
            throw new NotFoundException('Newsletter subscription not found');
        }

        return ZNewsletterSubscription.parse(updatedSubscription);
    }

    async deleteNewsletterSubscription(
        query: TNewsletterSubscriptionQueryUnique,
    ): Promise<{ message: string }> {
        const where = query.id ? { id: query.id } : { email: query.email };
        const deletedSubscription = await this.db.newsletterSubscription.delete({
            where,
        });

        if (!deletedSubscription) {
            throw new NotFoundException('Newsletter subscription not found');
        }

        return { message: 'Newsletter subscription deleted successfully' };
    }

    async unsubscribeNewsletterSubscription(
        query: TNewsletterSubscriptionQueryUnique,
    ): Promise<TNewsletterSubscription> {
        const where = query.id ? { id: query.id } : { email: query.email };
        const updatedSubscription = await this.db.newsletterSubscription.update({
            where,
            data: {
                status: 'unsubscribed',
                unsubscribedAt: new Date(),
            } as any,
        });

        if (!updatedSubscription) {
            throw new NotFoundException('Newsletter subscription not found');
        }

        return ZNewsletterSubscription.parse(updatedSubscription);
    }
}

