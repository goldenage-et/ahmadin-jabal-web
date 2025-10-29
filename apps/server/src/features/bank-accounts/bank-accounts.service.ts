import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    TBankAccount,
    TCreateBankAccount,
    TUpdateBankAccount,
} from '@repo/common';
import { PrismaClient } from '@repo/prisma';

@Injectable()
export class BankAccountsService {
    constructor(@Inject(PRISMA_CLIENT) private readonly db: PrismaClient) { }

    async create(data: TCreateBankAccount): Promise<TBankAccount> {
        const existingBankAccount = await this.db.bankAccount.findUnique({
            where: {
                bankName_accountNumber: {
                    accountNumber: data.accountNumber,
                    bankName: data.bankName,
                },
            },
        });
        if (existingBankAccount) {
            throw new BadRequestException('Bank account already exists');
        }

        const newBankAccount = await this.db.bankAccount.create({
            data: {
                accountName: data.accountName,
                accountNumber: data.accountNumber,
                bankName: data.bankName,
                bankCode: data.bankCode,
            },
        });

        return {
            id: newBankAccount.id,
            accountName: newBankAccount.accountName,
            accountNumber: newBankAccount.accountNumber,
            bankName: newBankAccount.bankName,
            bankCode: newBankAccount.bankCode,
        } as TBankAccount;
    }

    async getMany(): Promise<TBankAccount[]> {
        const bankAccounts = await this.db.bankAccount.findMany({
            where: {
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return bankAccounts.map((account) => ({
            id: account.id,
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bankName: account.bankName,
            bankCode: account.bankCode,
        })) as TBankAccount[];
    }

    async getOne(id: string): Promise<TBankAccount> {
        const bankAccount = await this.db.bankAccount.findUnique({
            where: { id },
        });

        if (!bankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        // Check if the bank account belongs to the store

        return {
            id: bankAccount.id,
            accountName: bankAccount.accountName,
            accountNumber: bankAccount.accountNumber,
            bankName: bankAccount.bankName,
            bankCode: bankAccount.bankCode,
        } as TBankAccount;
    }

    async update(
        id: string,
        data: TUpdateBankAccount,
    ): Promise<TBankAccount> {
        // First check if the bank account exists and belongs to the store
        const existingBankAccount = await this.db.bankAccount.findUnique({
            where: { id },
        });

        if (!existingBankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        const updatedBankAccount = await this.db.bankAccount.update({
            where: { id },
            data: { ...data },
        });

        console.log({
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            bankName: data.bankName,
            bankCode: data.bankCode,

        });


        return updatedBankAccount
    }

    async delete(id: string): Promise<{ message: string }> {
        // First check if the bank account exists and belongs to the store
        const existingBankAccount = await this.db.bankAccount.findUnique({
            where: { id },
        });

        if (!existingBankAccount) {
            throw new NotFoundException('Bank account not found');
        }

        await this.db.bankAccount.delete({
            where: { id },
        });

        return { message: 'Bank account deleted successfully' };
    }
}

