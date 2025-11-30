import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    TCreateContactSubmission,
    TContactSubmissionBasic,
    TContactSubmissionQueryFilter,
    TContactSubmissionQueryUnique,
    TContactSubmissionListResponse,
    TContactSubmissionDetail,
    ZContactSubmissionBasic,
    ZContactSubmissionListResponse,
    ZContactSubmissionDetail,
    EContactSubmissionStatus,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class ContactService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    // ==================== CONTACT SUBMISSION CRUD ====================

    async createContactSubmission(
        data: TCreateContactSubmission,
        userId?: string,
    ): Promise<TContactSubmissionBasic> {
        const submission = await this.db.contactSubmission.create({
            data: {
                ...data,
                userId: userId || null,
            } as any,
        });

        return ZContactSubmissionBasic.parse(submission);
    }

    async getManyContactSubmissions(
        query: TContactSubmissionQueryFilter,
    ): Promise<TContactSubmissionListResponse> {
        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.inquiryType) {
            where.inquiryType = { contains: query.inquiryType, mode: 'insensitive' };
        }

        if (query.email) {
            where.email = { contains: query.email, mode: 'insensitive' };
        }

        if (query.userId) {
            where.userId = query.userId;
        }

        if (query.repliedBy) {
            where.repliedBy = query.repliedBy;
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { subject: { contains: query.search, mode: 'insensitive' } },
                { message: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        let orderBy: any = { createdAt: query.sortOrder || 'desc' };
        switch (query.sortBy) {
            case 'updatedAt':
                orderBy = { updatedAt: query.sortOrder || 'desc' };
                break;
            case 'repliedAt':
                orderBy = { repliedAt: query.sortOrder || 'desc' };
                break;
            case 'subject':
                orderBy = { subject: query.sortOrder || 'desc' };
                break;
            case 'name':
                orderBy = { name: query.sortOrder || 'desc' };
                break;
            case 'email':
                orderBy = { email: query.sortOrder || 'desc' };
                break;
            case 'createdAt':
            default:
                orderBy = { createdAt: query.sortOrder || 'desc' };
                break;
        }

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const total = await this.db.contactSubmission.count({ where });

        const submissions = await this.db.contactSubmission.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return ZContactSubmissionListResponse.parse({
            data: submissions,
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

    async getOneContactSubmission(
        query: TContactSubmissionQueryUnique,
    ): Promise<TContactSubmissionDetail> {
        const submission = await this.db.contactSubmission.findUnique({
            where: { id: query.id },
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
                replier: {
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

        if (!submission) {
            throw new NotFoundException('Contact submission not found');
        }

        return ZContactSubmissionDetail.parse(submission);
    }


    async replyToContactSubmission(
        query: TContactSubmissionQueryUnique,
        replyMessage: string,
        repliedBy: string,
    ): Promise<TContactSubmissionBasic> {
        const updatedSubmission = await this.db.contactSubmission.update({
            where: { id: query.id },
            data: {
                status: EContactSubmissionStatus.replied,
                replyMessage,
                repliedBy,
                repliedAt: new Date(),
            } as any,
        });

        if (!updatedSubmission) {
            throw new NotFoundException('Contact submission not found');
        }

        return ZContactSubmissionBasic.parse(updatedSubmission);
    }

    async deleteContactSubmission(
        query: TContactSubmissionQueryUnique,
    ): Promise<{ message: string }> {
        const deletedSubmission = await this.db.contactSubmission.delete({
            where: { id: query.id },
        });

        if (!deletedSubmission) {
            throw new NotFoundException('Contact submission not found');
        }

        return { message: 'Contact submission deleted successfully' };
    }
}

