import { STORAGE_PROVIDER } from '@/constants/constants';
import { BankProvider } from '@/providers/bank/bank.provider';
import { IStorageProvider } from '@/providers/storage/storage-provider.interface';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { TBankClientReceiptData, TBankInfo, TValidateReference } from '@repo/common';
import { Order } from '@repo/prisma';

@Injectable()
export class BankTransferService {
    private readonly logger = new Logger(BankTransferService.name);

    constructor(
        private readonly bankProvider: BankProvider,
        @Inject(STORAGE_PROVIDER) private storageProvider: IStorageProvider,
    ) { }

    getBankClients(): TBankInfo[] {
        this.logger.log('Getting all available bank clients');
        return this.bankProvider.getBankClients();
    }

    async validateReference(
        data: TValidateReference,
        receiver: { bank: string; name: string; accountNumber: string }
    ): Promise<{
        success: boolean;
        value?: string;
        error?: string;
        receiptData?: TBankClientReceiptData;
        receiptPath?: string;
    }> {
        this.logger.log(`Validating reference for bank: ${data.bankCode}`);

        // Step 1: Validate reference format
        this.logger.log(`Validating reference format: ${data.reference}`);
        const validationResult = this.bankProvider.validateReference(data);
        this.logger.log(`Reference validation: ${validationResult.success ? 'Valid' : 'Invalid'}`);

        // Step 2: Get receipt URL
        const receiptUrl = this.bankProvider.getReceiptUrl(data, receiver);
        this.logger.log(`Receipt URL: ${receiptUrl}`);

        // Step 3: Download receipt file
        this.logger.log(`Downloading receipt file from URL...`);
        const fileBuffer = await this.bankProvider.downloadReceiptFile(receiptUrl);
        this.logger.log(`File buffer downloaded successfully (${fileBuffer.length} bytes)`);

        // Step 4: Upload receipt file to storage
        this.logger.log(`Uploading receipt file to storage...`);
        const privateName = `${data.bankCode}/${data.reference}.pdf`;
        // this.storageProvider.upload does not accept a buffer.
        // Create a minimal fake Express.Multer.File object for the upload
        const fakeMulterFile: Express.Multer.File = {
            fieldname: 'file',
            originalname: `${data.reference}.pdf`,
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: fileBuffer,
            size: fileBuffer.length,
            destination: '',
            filename: privateName,
            path: '',
            stream: undefined as any,
        };

        const uploadResult = await this.storageProvider.upload(
            fakeMulterFile,
            privateName,
            'application/pdf',
        );
        const receiptPath = `/files/${uploadResult.filename}`;
        this.logger.log(`Receipt file uploaded successfully (${uploadResult.filename})`);

        // Step 4: Parse receipt and extract data
        this.logger.log(`Parsing receipt file...`);
        const parseResult = await this.bankProvider.getReceiptData(
            data.bankCode,
            fileBuffer,
            validationResult.value || data.reference
        );
        this.logger.log(`Receipt parsed successfully`);

        return {
            success: parseResult.success,
            value: parseResult.value,
            error: parseResult.error,
            receiptData: parseResult.receiptData,
            receiptPath: receiptPath,
        };
    }

    async validateReceiverAccountNumber(
        bank: {
            bankCode: string;
            accountNumber: string;
        },
        receiptData: TBankClientReceiptData
    ): Promise<{
        success: boolean;
        error?: string;
    }> {
        const client = this.bankProvider.getBankClientByCode(bank.bankCode);
        if (!client) {
            throw new BadRequestException('Invalid bank code');
        }
        return client.validateReceiverAccountNumber(bank.accountNumber, receiptData);
    }

    async validatePayment(
        bank: {
            bankCode: string;
            accountNumber: string;
        },
        order: Order,
        receiptData: TBankClientReceiptData
    ): Promise<{
        success: boolean;
        error?: string;
    }> {

        const client = this.bankProvider.getBankClientByCode(bank.bankCode);
        const validationResult = client.validateReceiverAccountNumber(bank.accountNumber, receiptData)

        if (!validationResult.success) {
            return {
                success: false,
                error: validationResult.error || 'Failed to validate receiver account number',
            };
        }


        // if (order && order.createdAt && receiptData.paymentDateTime) {
        //     const parseDate = (d: string | Date) => {
        //         if (d instanceof Date) return d;
        //         const m = d.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
        //         if (m) {
        //             return new Date(`${m[1]}-${m[2]}-${m[3]}`);
        //         }
        //         return new Date(d);
        //     };

        //     const orderDate = parseDate((order as any).createdAt);
        //     const receiptDate = parseDate(receiptData.paymentDateTime);

        //     if (isNaN(orderDate.getTime()) || isNaN(receiptDate.getTime())) {
        //         return {
        //             success: false,
        //             error: 'Invalid order or receipt payment date',
        //         };
        //     }

        //     const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
        //     const receiptDay = new Date(receiptDate.getFullYear(), receiptDate.getMonth(), receiptDate.getDate());

        //     if (receiptDay < orderDay) {
        //         return {
        //             success: false,
        //             error: 'Receipt payment date is before order creation date',
        //         };
        //     }
        // }

        // Verify the amount matches
        const transferredAmount = parseFloat(
            receiptData.transferredAmount.replace(/,/g, '')
        );

        // Allow a very small margin for floating point arithmetic errors
        const EPSILON = 0.05;
        if (Math.abs(transferredAmount - order.total) > EPSILON) {
            const diff = transferredAmount - order.total;
            let errorMessage = `Transfer amount (${transferredAmount}) does not match order total (${order.total})`;
            if (transferredAmount < order.total) {
                errorMessage += `. The transferred amount is less than the required order total by ${Math.abs(diff).toFixed(2)}.`;
            } else if (transferredAmount > order.total) {
                errorMessage += `. The transferred amount is more than the required order total by ${diff.toFixed(2)}`;
            }
            return {
                success: false,
                error: errorMessage,
            };
        }

        return { success: true, error: undefined };
    }
}

