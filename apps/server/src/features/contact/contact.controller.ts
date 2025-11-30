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
    TCreateContactSubmission,
    TContactSubmissionBasic,
    TContactSubmissionQueryFilter,
    TContactSubmissionListResponse,
    TContactSubmissionDetail,
    ZCreateContactSubmission,
    ZContactSubmissionQueryFilter,
    ZContactSubmissionQueryUnique,
    TAuthUser,
    TSessionBasic,
} from '@repo/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post('submissions')
    @HttpCode(201)
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateContactSubmission))
    async createContactSubmission(
        @CurrentSession() session: TSessionBasic | null,
        @Body() data: TCreateContactSubmission,
    ): Promise<TContactSubmissionBasic> {
        return this.contactService.createContactSubmission(
            data,
            session?.userId,
        );
    }

    @Get('submissions')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZContactSubmissionQueryFilter as any))
    async getManyContactSubmissions(
        @Query() query: TContactSubmissionQueryFilter,
    ): Promise<TContactSubmissionListResponse> {
        return this.contactService.getManyContactSubmissions(query);
    }

    @Get('submissions/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZContactSubmissionQueryUnique as any))
    async getOneContactSubmission(
        @Param('id') id: string,
    ): Promise<TContactSubmissionDetail> {
        return this.contactService.getOneContactSubmission({ id });
    }

    @Post('submissions/:id/reply')
    @HttpCode(200)
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZContactSubmissionQueryUnique as any))
    async replyToContactSubmission(
        @CurrentUser() user: TAuthUser,
        @Param('id') id: string,
        @Body() body: { replyMessage: string },
    ): Promise<TContactSubmissionBasic> {
        return this.contactService.replyToContactSubmission(
            { id },
            body.replyMessage,
            user.id,
        );
    }

    @Delete('submissions/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZContactSubmissionQueryUnique as any))
    async deleteContactSubmission(
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        return this.contactService.deleteContactSubmission({ id });
    }
}

