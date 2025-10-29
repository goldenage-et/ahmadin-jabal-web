import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
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
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import {
    TAuthUser,
    TCreateRole,
    TRole,
    TUpdateRole,
    ZCreateRole,
    ZUpdateRole,
} from '@repo/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    private readonly logger = new Logger(RolesController.name);

    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateRole))
    async createRole(
        @Body() data: TCreateRole,
        @CurrentUser() user: TAuthUser,
    ): Promise<TRole> {
        this.logger.log(`Creating root role: ${data.name}`);
        const canCreate = this.rolesService.can(user, 'role', 'create');
        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create root roles.');
        }
        // TODO: Add permission check - user must have Role.create permission
        return this.rolesService.createRole(data);
    }

    @Get()
    @UseGuards(UserAuthGuard)
    async getRoles(@CurrentUser() user: TAuthUser): Promise<TRole[]> {
        this.logger.log('Getting all root roles');
        const canViewMany = this.rolesService.can(user, 'role', 'viewMany');
        if (!canViewMany) {
            throw new ForbiddenException('You do not have permission to view root roles.');
        }
        // TODO: Add permission check - user must have Role.viewMany permission
        return this.rolesService.getRoles();
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    async getRole(
        @Param('id') id: string,
        @CurrentUser() user: TAuthUser,
    ): Promise<TRole> {
        this.logger.log(`Getting root role: ${id}`);
        const canViewOne = this.rolesService.can(user, 'role', 'viewOne');
        if (!canViewOne) {
            throw new ForbiddenException('You do not have permission to view root roles.');
        }
        // TODO: Add permission check - user must have Role.viewOne permission
        return this.rolesService.getRoleById(id);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateRole))
    async updateRole(
        @Param('id') id: string,
        @Body() data: TUpdateRole,
        @CurrentUser() user: TAuthUser,
    ): Promise<TRole> {
        this.logger.log(`Updating root role: ${id}`);
        const canUpdate = this.rolesService.can(user, 'role', 'update');
        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update root roles.');
        }
        // TODO: Add permission check - user must have Role.update permission
        return this.rolesService.updateRole(id, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    async deleteRole(
        @Param('id') id: string,
        @CurrentUser() user: TAuthUser,
    ): Promise<{ message: string }> {
        this.logger.log(`Deleting root role: ${id}`);
        const canDelete = this.rolesService.can(user, 'role', 'delete');
        if (!canDelete) {
            throw new ForbiddenException('You do not have permission to delete root roles.');
        }
        // TODO: Add permission check - user must have Role.delete permission
        await this.rolesService.deleteRole(id);
        return { message: 'Root role deleted successfully' };
    }

}

