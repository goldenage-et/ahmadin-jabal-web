import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import {
    TAuthUser,
    TCreatePlan,
    TPlanBasic,
    TUpdatePlan,
    ZCreatePlan,
    ZPlanQueryFilter,
    ZPlanQueryUnique,
    ZUpdatePlan,
    TPaginationResponse,
    TPlanQueryFilter,
} from '@repo/common';
import { RolesService } from '../roles/roles.service';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
    private readonly logger = new Logger(PlansController.name);

    constructor(
        private readonly plansService: PlansService,
        private readonly rolesService: RolesService,
    ) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreatePlan))
    async createPlan(
        @Body() data: TCreatePlan,
        @CurrentUser() user: TAuthUser,
    ): Promise<TPlanBasic> {
        this.logger.log(`Creating plan: ${data.name}`);
        const canCreate = this.rolesService.can(user, 'plan', 'create');
        if (!canCreate) {
            throw new ForbiddenException(
                'You do not have permission to create plans.',
            );
        }
        return this.plansService.create(data);
    }

    @Get()
    @UsePipes(QueryPipe(ZPlanQueryFilter))
    async getPlans(
        @Query() query: TPlanQueryFilter,
    ): Promise<TPaginationResponse<TPlanBasic[]>> {
        this.logger.log('Getting all plans');
        return this.plansService.getMany(query);
    }

    @Get(':id')
    @UsePipes(QueryPipe(ZPlanQueryUnique))
    async getPlan(
        @Param('id') id: string,
        @CurrentUser() user?: TAuthUser,
    ): Promise<TPlanBasic> {
        this.logger.log(`Getting plan: ${id}`);
        // Allow public access to view plans, but require auth for admin operations
        return this.plansService.getOne({ id });
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdatePlan))
    async updatePlan(
        @Param('id') id: string,
        @Body() data: TUpdatePlan,
        @CurrentUser() user: TAuthUser,
    ): Promise<TPlanBasic> {
        this.logger.log(`Updating plan: ${id}`);
        const canUpdate = this.rolesService.can(user, 'plan', 'update');
        if (!canUpdate) {
            throw new ForbiddenException(
                'You do not have permission to update plans.',
            );
        }
        return this.plansService.update({ id }, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    async deletePlan(
        @Param('id') id: string,
        @CurrentUser() user: TAuthUser,
    ): Promise<{ message: string }> {
        this.logger.log(`Deleting plan: ${id}`);
        const canDelete = this.rolesService.can(user, 'plan', 'delete');
        if (!canDelete) {
            throw new ForbiddenException(
                'You do not have permission to delete plans.',
            );
        }
        await this.plansService.delete({ id });
        return { message: 'Plan deleted successfully' };
    }
}

