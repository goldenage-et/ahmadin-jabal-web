import { BodyPipe } from '@/pipes/body.pipe';
import { Body, Controller, Get, Logger, Post, UsePipes } from '@nestjs/common';
import {
    TBankInfo,
    TValidateReference,
    ZValidateReference
} from '@repo/common';
import { BankTransferService } from './bank-transfer.service';

@Controller('bank-transfer')
export class BankTransferController {
    private readonly logger = new Logger(BankTransferController.name);

    constructor(private readonly bankTransferService: BankTransferService) { }

    @Get('banks')
    async getBanks(): Promise<TBankInfo[]> {
        this.logger.log('Getting all available banks');
        return this.bankTransferService.getBankClients();
    }

    @Post('validate')
    @UsePipes(BodyPipe(ZValidateReference))
    async validateReference(
        @Body() data: TValidateReference,
    ) {
        this.logger.log(`Validating reference: ${data.reference}`);

        // TODO: Get receiver data from database based on order/store
        // For now using hardcoded values
        const receiver = {
            bank: "Commercial Bank Of Ethiopia",
            name: "Harun Jeylan",
            accountNumber: "1000224377405",
        }

        const result = await this.bankTransferService.validateReference(data, receiver);
        this.logger.log(`Validation result: ${result.success ? 'Success' : 'Failed'}`);

        return result;
    }
}

