import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
} from '@nestjs/common';

import {
    TCreateBankAccount,
    TUpdateBankAccount,
    ZCreateBankAccount,
    ZUpdateBankAccount,
} from '@repo/common';
import { BankAccountsService } from './bank-accounts.service';
import { BodyPipe } from '@/pipes/body.pipe';
import { UserAuthGuard } from '@/guards/auth.guard';

@Controller('bank-accounts')
@UseGuards(UserAuthGuard)
export class BankAccountsController {
    constructor(private bankAccountsService: BankAccountsService) { }

    @Post()
    @UsePipes(BodyPipe(ZCreateBankAccount))
    async create(@Body() data: TCreateBankAccount) {
        return this.bankAccountsService.create(data);
    }

    @Get()
    async getMany() {
        return this.bankAccountsService.getMany();
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.bankAccountsService.getOne(id);
    }

    @Put(':id')
    @UsePipes(BodyPipe(ZUpdateBankAccount))
    async update(
        @Param('id') id: string,
        @Body() data: TUpdateBankAccount,
    ) {
        return this.bankAccountsService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.bankAccountsService.delete(id);
    }
}