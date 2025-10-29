import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger';
import {
    TInvitation,
    TInvitationQueryFilter,
    TUpdateInvitationStatus,
} from '@repo/common';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { InvitationsService } from './invitations.service';

@ApiTags('Invitations')
@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Get()
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Get invitations with filters' })
    @ApiQuery({
        name: 'email',
        description: 'Filter by email',
        required: false,
        type: 'string',
    })
    @ApiQuery({
        name: 'status',
        description: 'Filter by invitation status',
        required: false,
        enum: ['pending', 'accepted', 'rejected', 'expired'],
    })
    @ApiQuery({
        name: 'targetId',
        description: 'Filter by target ID',
        required: false,
        type: 'string',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitations retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMany(
        @Query() filters: TInvitationQueryFilter,
    ): Promise<TInvitation[]> {
        return await this.invitationsService.getMany(filters);
    }

    @Get('my')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Get my invitations' })
    @ApiResponse({
        status: 200,
        description: 'My invitations retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMyInvitations(
        @CurrentUser('email') email: string,
        @Query() filters: TInvitationQueryFilter,
    ): Promise<TInvitation[]> {
        return await this.invitationsService.getManyInvitations({
            ...filters,
            email,
        });
    }

    @Get(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Get invitation by ID' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation retrieved successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    async getOne(
        @Param('id') id: string,
    ): Promise<TInvitation | null> {
        return await this.invitationsService.getOne({ id });
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Delete invitation' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation deleted successfully',
        schema: { type: 'boolean' },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 403, description: 'Not authorized to delete' })
    async delete(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ): Promise<boolean> {
        return await this.invitationsService.delete(id, userId);
    }

    @Post(':id/accept')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Accept invitation by token' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation accepted successfully',
    })
    @ApiBody({
        description: 'Accept invitation with optional attributes',
        required: false,
        schema: {
            type: 'object',
            properties: {
                attributes: {
                    type: 'object',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 400, description: 'Invalid invitation' })
    async acceptInvitation(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() data?: { attributes: any },
    ): Promise<TInvitation> {
        return await this.invitationsService.acceptInvitation(id, userId, data);
    }

    @Post(':id/decline')
    @ApiOperation({ summary: 'Decline invitation by token' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation declined successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 400, description: 'Invalid invitation' })
    async declineInvitation(
        @Param('id') id: string,
    ): Promise<TInvitation> {
        return await this.invitationsService.declineInvitation(id);
    }

    @Post(':id/resend')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Resend invitation' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation resent successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 403, description: 'Not authorized to resend' })
    async resendInvitation(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ): Promise<TInvitation> {
        return await this.invitationsService.resend(id, userId);
    }

    @Post(':id/cancel')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Cancel invitation' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation cancelled successfully',
        schema: { type: 'boolean' },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 403, description: 'Not authorized to cancel' })
    async cancelInvitation(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
    ): Promise<boolean> {
        return await this.invitationsService.cancel(id, userId);
    }

    @Put(':id/status')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Update invitation status' })
    @ApiParam({
        name: 'id',
        description: 'Invitation ID',
    })
    @ApiBody({
        description: 'Update invitation status',
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['pending', 'accepted', 'rejected', 'expired'],
                },
            },
            required: ['status'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Invitation status updated successfully',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invitation not found' })
    @ApiResponse({ status: 400, description: 'Invalid status update' })
    async updateStatus(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @Body() data: TUpdateInvitationStatus,
    ): Promise<TInvitation> {
        return await this.invitationsService.updateStatus(id, data, userId);
    }

    @Post('cleanup')
    @UseGuards(UserAuthGuard)
    @ApiOperation({ summary: 'Cleanup expired invitations' })
    @ApiResponse({
        status: 200,
        description: 'Expired invitations cleaned up',
        schema: { type: 'object', properties: { count: { type: 'number' } } },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async cleanupExpired(): Promise<{ count: number }> {
        const count = await this.invitationsService.cleanupExpiredInvitations();
        return { count };
    }
}
