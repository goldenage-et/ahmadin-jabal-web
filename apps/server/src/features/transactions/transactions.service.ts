import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PRISMA_CLIENT } from '@/database/module/prisma.module';
import { Inject } from '@nestjs/common';
import { PrismaClient } from '@repo/prisma';
import {
    TCreateTransaction,
    TUpdateTransaction,
    TTransactionQueryFilter,
    ETransactionStatus,
    ETransactionType,
    TTransaction,
} from '@repo/common';

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        @Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient,
    ) { }

    async create(data: TCreateTransaction): Promise<TTransaction> {
        this.logger.log(`Creating transaction for user: ${data.userId}`);

        const transaction = await this.prisma.transaction.create({
            data: {
                ...data,
                status: data.status || ETransactionStatus.pending,
            },
        });

        this.logger.log(`Transaction created: ${transaction.id}`);
        return transaction as TTransaction;
    }

    async getOne(id: string, userId?: string): Promise<TTransaction> {
        this.logger.log(`Fetching transaction: ${id}`);

        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        // Optional: Check if user has access to this transaction
        if (userId && transaction.userId !== userId) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction as TTransaction;
    }

    async getByPayment(paymentId: string, userId?: string): Promise<TTransaction[]> {
        this.logger.log(`Fetching transactions for payment: ${paymentId}`);

        const where: any = { paymentId };
        if (userId) {
            where.userId = userId;
        }

        const transactions = await this.prisma.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return transactions as TTransaction[];
    }

    async getByOrder(orderId: string, userId?: string): Promise<TTransaction[]> {
        this.logger.log(`Fetching transactions for order: ${orderId}`);

        const where: any = { orderId };
        if (userId) {
            where.userId = userId;
        }

        const transactions = await this.prisma.transaction.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return transactions as TTransaction[];
    }

    async getMany(query: TTransactionQueryFilter): Promise<{ transactions: TTransaction[]; total: number }> {
        this.logger.log('Fetching transactions with filters');

        const {
            page = 1,
            limit = 10,
            paymentId,
            orderId,
            userId,
            type,
            status,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            startDate,
            endDate,
        } = query;

        const skip = (page - 1) * limit;

        const where: any = {};

        if (paymentId) where.paymentId = paymentId;
        if (orderId) where.orderId = orderId;
        if (userId) where.userId = userId;
        if (type) where.type = type;
        if (status) where.status = status;

        if (search) {
            where.OR = [
                { referenceNumber: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            transactions: transactions as TTransaction[],
            total,
        };
    }

    async update(id: string, data: TUpdateTransaction, userId?: string): Promise<TTransaction> {
        this.logger.log(`Updating transaction: ${id}`);

        // Check if transaction exists
        const existingTransaction = await this.prisma.transaction.findUnique({
            where: { id },
        });

        if (!existingTransaction) {
            throw new NotFoundException('Transaction not found');
        }

        // Optional: Check if user has access
        if (userId && existingTransaction.userId !== userId) {
            throw new NotFoundException('Transaction not found');
        }

        const transaction = await this.prisma.transaction.update({
            where: { id },
            data,
        });

        this.logger.log(`Transaction updated: ${transaction.id}`);
        return transaction as TTransaction;
    }

    async updateStatus(
        id: string,
        status: ETransactionStatus,
        metadata?: any,
    ): Promise<TTransaction> {
        this.logger.log(`Updating transaction status: ${id} to ${status}`);

        const updateData: any = {
            status,
        };

        if (status === ETransactionStatus.completed || status === ETransactionStatus.failed) {
            updateData.processedAt = new Date();
        }

        if (metadata) {
            updateData.metadata = metadata;
        }

        const transaction = await this.prisma.transaction.update({
            where: { id },
            data: updateData,
        });

        this.logger.log(`Transaction status updated: ${transaction.id}`);
        return transaction as TTransaction;
    }

    async delete(id: string, userId?: string): Promise<{ message: string }> {
        this.logger.log(`Deleting transaction: ${id}`);

        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (userId && transaction.userId !== userId) {
            throw new NotFoundException('Transaction not found');
        }

        // Only allow deletion of pending or failed transactions
        if (transaction.status === ETransactionStatus.completed) {
            throw new BadRequestException('Cannot delete completed transactions');
        }

        await this.prisma.transaction.delete({
            where: { id },
        });

        this.logger.log(`Transaction deleted: ${id}`);
        return { message: 'Transaction deleted successfully' };
    }
}


