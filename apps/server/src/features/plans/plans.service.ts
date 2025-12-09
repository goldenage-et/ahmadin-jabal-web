import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import {
    TCreatePlan,
    TUpdatePlan,
    TPlanBasic,
    ZPlan,
    TPlanQueryUnique,
    TPlanQueryFilter,
    TPaginationResponse,
    ZPaginationResponse,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class PlansService {
    private readonly logger = new Logger(PlansService.name);

    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    async create(data: TCreatePlan): Promise<TPlanBasic> {
        // Check if plan with same name already exists
        const planExists = await this.db.plan.findFirst({
            where: { name: data.name },
        });

        if (planExists) {
            throw new ConflictException('Plan with this name already exists');
        }

        const newPlan = await this.db.plan.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                currency: data.currency,
                durationDays: data.isLifetime ? null : data.durationDays,
                isLifetime: data.isLifetime,
                features: data.features as any,
                active: data.active ?? true,
            },
        });

        return ZPlan.parse(newPlan);
    }

    async getMany(query?: TPlanQueryFilter): Promise<TPaginationResponse<TPlanBasic[]>> {
        const where: any = {};
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const skip = (page - 1) * limit;

        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        if (typeof query?.active === 'boolean') {
            where.active = query.active;
        }

        if (typeof query?.isLifetime === 'boolean') {
            where.isLifetime = query.isLifetime;
        }

        const [plans, total] = await Promise.all([
            this.db.plan.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [query?.sortBy || 'createdAt']: query?.sortOrder || 'desc',
                },
            }),
            this.db.plan.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return ZPaginationResponse(ZPlan.array()).parse({
            data: plans.map((plan) => ZPlan.parse(plan)),
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    }

    async getOne(query: TPlanQueryUnique): Promise<TPlanBasic> {
        const plan = await this.db.plan.findUnique({
            where: { id: query.id },
        });

        if (!plan) {
            throw new NotFoundException(`Plan with id ${query.id} not found`);
        }

        return ZPlan.parse(plan);
    }

    async update(
        query: TPlanQueryUnique,
        data: TUpdatePlan,
    ): Promise<TPlanBasic> {
        const existing = await this.db.plan.findUnique({
            where: { id: query.id },
        });

        if (!existing) {
            throw new NotFoundException(`Plan with id ${query.id} not found`);
        }

        // Check if name is being changed and if it conflicts
        if (data.name && data.name !== existing.name) {
            const nameExists = await this.db.plan.findFirst({
                where: { name: data.name },
            });

            if (nameExists) {
                throw new ConflictException('Plan with this name already exists');
            }
        }

        // Handle isLifetime and durationDays logic
        let durationDays = data.durationDays;
        if (data.isLifetime !== undefined) {
            if (data.isLifetime) {
                durationDays = null;
            } else if (data.durationDays === null || data.durationDays === undefined) {
                // If switching from lifetime to time-based, need durationDays
                if (existing.isLifetime) {
                    throw new ConflictException('durationDays is required for time-based plans');
                }
                durationDays = existing.durationDays;
            }
        }

        const updated = await this.db.plan.update({
            where: { id: query.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.price !== undefined && { price: data.price }),
                ...(data.currency && { currency: data.currency }),
                ...(durationDays !== undefined && { durationDays }),
                ...(data.isLifetime !== undefined && { isLifetime: data.isLifetime }),
                ...(data.features !== undefined && { features: data.features as any }),
                ...(data.active !== undefined && { active: data.active }),
            },
        });

        return ZPlan.parse(updated);
    }

    async delete(query: TPlanQueryUnique): Promise<void> {
        const existing = await this.db.plan.findUnique({
            where: { id: query.id },
            include: { subscriptions: true },
        });

        if (!existing) {
            throw new NotFoundException(`Plan with id ${query.id} not found`);
        }

        if (existing.subscriptions.length > 0) {
            throw new ConflictException(
                'Cannot delete plan that has active subscriptions',
            );
        }

        await this.db.plan.delete({
            where: { id: query.id },
        });
    }
}

