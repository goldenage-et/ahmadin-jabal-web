import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@repo/prisma';
import {
    EInvitationStatus,
    TCreateInvitation,
    TInvitation,
    TInvitationQueryFilter,
    TInvitationQueryUnique,
    TUpdateInvitationStatus,
    ZInvitation
} from '@repo/common';
import { PRISMA_CLIENT } from '@/database/module/prisma.module';

@Injectable()
export class InvitationsService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) {
    }

    async create(data: TCreateInvitation): Promise<TInvitation> {
        // Check if invitation already exists for this email and target
        const existingInvitation = await this.db.invitation.findFirst({
            where: {
                email: data.email.toLowerCase(),
                targetId: data.targetId,
                status: { in: [EInvitationStatus.pending, EInvitationStatus.accepted] },
            },
        });

        if (existingInvitation) {
            throw new ConflictException('Invitation already exists for this email and target');
        }

        // Generate invitation token
        // Set expiration date (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await this.db.invitation.create({
            data: {
                targetId: data.targetId,
                roles: data.roles || [],
                message: data.message,
                email: data.email.toLowerCase(),
                status: EInvitationStatus.pending,
                expiresAt,
                invitedBy: data.invitedBy,
            },
        });
        return ZInvitation.parse(invitation);
    }

    async getMany(filters: TInvitationQueryFilter = {}): Promise<TInvitation[]> {
        const where: any = {};

        if (filters.id) {
            where.id = filters.id;
        }
        if (filters.email) {
            where.email = filters.email.toLowerCase();
        }
        if (filters.invitedBy) {
            where.invitedBy = filters.invitedBy;
        }
        if (filters.targetId) {
            where.targetId = filters.targetId;
        }
        if (filters.status) {
            where.status = filters.status;
        }

        const invitations = await this.db.invitation.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return invitations.map(inv => ZInvitation.parse(inv));
    }

    async getOne(filters: TInvitationQueryUnique): Promise<TInvitation | null> {
        const where: any = {};

        if (filters.id) {
            where.id = filters.id;
        }
        if (filters.email) {
            where.email = filters.email.toLowerCase();
        }
        if (filters.invitedBy) {
            where.invitedBy = filters.invitedBy;
        }
        if (filters.targetId) {
            where.targetId = filters.targetId;
        }

        const invitation = await this.db.invitation.findFirst({ where });

        if (!invitation) {
            return null;
        }

        return ZInvitation.parse(invitation);
    }

    async updateStatus(
        invitationId: string,
        data: TUpdateInvitationStatus,
        userId: string
    ): Promise<TInvitation> {
        const invitation = await this.db.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        // Check if invitation is expired
        if (invitation.expiresAt && new Date() > invitation.expiresAt) {
            throw new BadRequestException('Invitation has expired');
        }

        // Check if invitation is already processed
        if (invitation.status !== EInvitationStatus.pending) {
            throw new BadRequestException('Invitation has already been processed');
        }

        const updateData: any = {
            status: data.status,
        };

        if (data.status === EInvitationStatus.accepted) {
            updateData.acceptedAt = new Date();
        } else if (data.status === EInvitationStatus.rejected) {
            updateData.declinedAt = new Date();
        }

        const updatedInvitation = await this.db.invitation.update({
            where: { id: invitationId },
            data: updateData
        });

        return ZInvitation.parse(updatedInvitation);
    }

    async resend(invitationId: string, userId: string): Promise<TInvitation> {
        const invitation = await this.db.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        // Check if user has permission to resend (inviter or admin)
        if (invitation.invitedBy !== userId) {
            // TODO: Add admin check here
            throw new UnauthorizedException('You are not authorized to resend this invitation');
        }

        // Check if invitation is still pending
        if (invitation.status !== EInvitationStatus.pending) {
            throw new BadRequestException('Can only resend pending invitations');
        }

        // Generate new token and extend expiration
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);

        const updatedInvitation = await this.db.invitation.update({
            where: { id: invitationId },
            data: {
                expiresAt: newExpiresAt,
            }
        });

        return ZInvitation.parse(updatedInvitation);
    }

    async cancel(invitationId: string, userId: string): Promise<boolean> {
        const invitation = await this.db.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        // Check if user has permission to cancel (inviter or admin)
        if (invitation.invitedBy !== userId) {
            // TODO: Add admin check here
            throw new UnauthorizedException('You are not authorized to cancel this invitation');
        }

        // Check if invitation is still pending
        if (invitation.status !== EInvitationStatus.pending) {
            throw new BadRequestException('Can only cancel pending invitations');
        }

        await this.db.invitation.update({
            where: { id: invitationId },
            data: {
                status: EInvitationStatus.rejected,
                declinedAt: new Date(),
            }
        });

        return true;
    }

    async delete(invitationId: string, userId: string): Promise<boolean> {
        const invitation = await this.db.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        // Check if user has permission to delete (inviter or admin)
        if (invitation.invitedBy !== userId) {
            // TODO: Add admin check here
            throw new UnauthorizedException('You are not authorized to delete this invitation');
        }

        await this.db.invitation.delete({
            where: { id: invitationId }
        });
        return true;
    }

    async inviteUsers(
        invitedBy: string,
        data: { emails: string[]; roles?: string[]; targetId: string, message?: string },
    ): Promise<TInvitation[]> {
        const invitationResults = await Promise.all(
            data.emails.map(async (email) => {
                try {
                    const invitationData: TCreateInvitation = {
                        email: email.toLowerCase(),
                        invitedBy,
                        targetId: data.targetId,
                        roles: data.roles,
                        message: data.message,
                    };

                    const invitation = await this.create(invitationData);
                    return invitation;
                } catch (error) {
                    // Log error but continue with other invitations
                    console.error(`Failed to create invitation for ${email}:`, error);
                    return null;
                }
            })
        );

        return invitationResults.filter((inv): inv is TInvitation => !!inv);
    }

    async getManyInvitations(filters: TInvitationQueryFilter = {}): Promise<TInvitation[]> {
        return this.getMany(filters);
    }

    async acceptInvitation(id: string, userId: string, data?: { attributes: any }): Promise<TInvitation> {
        const invitation = await this.getOne({ id });

        if (!invitation) {
            throw new NotFoundException('Invalid or expired invitation');
        }

        const user = await this.db.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
            throw new BadRequestException('Email does not match invitation');
        }

        await this.db.user.update({
            where: { id: userId },
            data: {
                roles: invitation.roles as any,
            }
        });

        return await this.updateStatus(invitation.id, { status: EInvitationStatus.accepted }, userId);
    }

    async declineInvitation(id: string): Promise<TInvitation> {
        const invitation = await this.getOne({ id });

        if (!invitation) {
            throw new NotFoundException('Invalid or expired invitation');
        }

        return await this.updateStatus(invitation.id, { status: EInvitationStatus.rejected }, invitation.invitedBy);
    }

    async cleanupExpiredInvitations(): Promise<number> {
        const result = await this.db.invitation.updateMany({
            where: {
                status: EInvitationStatus.pending,
                expiresAt: { lt: new Date() },
            },
            data: {
                status: EInvitationStatus.expired,
            }
        });

        return result.count;
    }
}
