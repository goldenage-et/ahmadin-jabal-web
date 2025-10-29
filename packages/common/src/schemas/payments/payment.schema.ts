import { regex, z, ZodError } from 'zod';
import { EPaymentMethod, EPaymentStatus, ETransactionStatus, ETransactionType } from '../enums';

// Bank Transfer Receipt Validation Schema
export const ZBankTransferReceipt = z.object({
    bankCode: z.string().min(1, 'Bank code is required'),
    reference: z.string().min(1, 'Reference is required'),
    receiptData: z.string().min(1, 'Receipt data is required'),
});

export const ZValidateReference = z.object({
    bankCode: z.string().min(1, 'Bank code is required'),
    reference: z.string().min(1, 'Reference is required'),
});

export const ZGetReceiptUrl = z.object({
    bankCode: z.string().min(1, 'Bank code is required'),
    receiverAccountNumber: z.string().min(1, 'Receiver account number is required'),
    reference: z.string().min(1, 'Reference is required'),
});

// Bank Transfer Receipt Data
export const ZBankClientReceiptData = z.object({
    senderName: z.string(),
    senderBank: z.string(),
    senderAccountNumber: z.string(),
    receiverName: z.string(),
    receiverBank: z.string(),
    receiverAccountNumber: z.string(),
    narrative: z.string(),
    paymentDateTime: z.string(),
    referenceNo: z.string(),
    transferredAmount: z.string(),
    commission: z.string(),
    vat: z.string(),
    totalAmount: z.string(),
});

// Types
export type TBankTransferReceipt = z.infer<typeof ZBankTransferReceipt>;
export type TValidateReference = z.infer<typeof ZValidateReference>;
export type TGetReceiptUrl = z.infer<typeof ZGetReceiptUrl>;
export type TBankClientReceiptData = z.infer<typeof ZBankClientReceiptData>;

// Bank Info Type
export type TBankInfo = {
    name: string;
    code: string;
    description: string;
    logoUrl: string;
    referenceLabel: string;
    referencePlaceholder: string;
};


export const ZBankOption = z.object({
    name: z.string(),
    code: z.string(),
    validate: z,
});

export type TBankOption = {
    name: string;
    code: string;
    validate: (accountNumber: string) => {
        success: true;
        data: string;
        error: undefined;
    } | {
        success: false;
        data: undefined;
        error: ZodError<string>;
    }
}

export const ZBankAccount = z.object({
    id: z.string(),
    accountName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    bankCode: z.string(),
});


export type TBankAccount = z.infer<typeof ZBankAccount>;

export const ZCreateBankAccount = ZBankAccount.omit({ id: true })

export type TCreateBankAccount = z.infer<typeof ZCreateBankAccount>;

export const ZUpdateBankAccount = ZBankAccount.omit({ id: true }).partial()

export type TUpdateBankAccount = z.infer<typeof ZUpdateBankAccount>;

// ========================================
// Payment Schemas
// ========================================

export const ZPayment = z.object({
    id: z.string(),
    orderId: z.string(),
    userId: z.string(),
    amount: z.coerce.number(),
    currency: z.string(),
    paymentMethod: z.enum(EPaymentMethod),
    paymentStatus: z.enum(EPaymentStatus),
    // paymentCompleted: z.boolean().default(false),
    // paymentComfermiedBy: z.uuid().nullable().optional(),
    transactionId: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    bankCode: z.string().nullable().optional(),
    bankAccountId: z.string().nullable().optional(),
    receiptData: ZBankClientReceiptData.nullable().optional(), // JSON
    metadata: z.object({
        receiptPath: z.string().nullable().optional(),
    }).nullable().optional(), // JSON
    failureReason: z.string().nullable().optional(),
    paidAt: z.coerce.date().nullable().optional(),
    refundedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TPayment = z.infer<typeof ZPayment>;

export const ZCreatePayment = z.object({
    orderId: z.string(),
    userId: z.string(),
    amount: z.coerce.number().min(0),
    currency: z.string().default('ETB'),
    paymentMethod: z.enum(EPaymentMethod),
    paymentStatus: z.enum(EPaymentStatus).optional(),
    transactionId: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    bankCode: z.string().nullable().optional(),
    bankAccountId: z.string().nullable().optional(),
    receiptData: z.any().nullable().optional(),
    metadata: z.any().nullable().optional(),
});

export type TCreatePayment = z.infer<typeof ZCreatePayment>;

export const ZUpdatePayment = z.object({
    paymentStatus: z.enum(EPaymentStatus).optional(),
    transactionId: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    bankCode: z.string().nullable().optional(),
    bankAccountId: z.string().nullable().optional(),
    receiptData: z.any().nullable().optional(),
    metadata: z.any().nullable().optional(),
    failureReason: z.string().nullable().optional(),
    paidAt: z.coerce.date().nullable().optional(),
    refundedAt: z.coerce.date().nullable().optional(),
});

export type TUpdatePayment = z.infer<typeof ZUpdatePayment>;

export const ZPaymentQueryFilter = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    orderId: z.string().optional(),
    userId: z.string().optional(),
    paymentMethod: z.enum(EPaymentMethod).optional(),
    paymentStatus: z.enum(EPaymentStatus).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'amount', 'paidAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export type TPaymentQueryFilter = z.infer<typeof ZPaymentQueryFilter>;

// ========================================
// Transaction Schemas
// ========================================

export const ZTransaction = z.object({
    id: z.string(),
    paymentId: z.string().nullable().optional(),
    orderId: z.string().nullable().optional(),
    userId: z.string(),
    type: z.enum(ETransactionType),
    amount: z.coerce.number(),
    currency: z.string(),
    status: z.enum(ETransactionStatus),
    description: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    metadata: z.any().nullable().optional(), // JSON
    processedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type TTransaction = z.infer<typeof ZTransaction>;

export const ZCreateTransaction = z.object({
    paymentId: z.string().nullable().optional(),
    orderId: z.string().nullable().optional(),
    userId: z.string(),
    type: z.enum(ETransactionType),
    amount: z.coerce.number(),
    currency: z.string().default('ETB'),
    status: z.enum(ETransactionStatus).optional(),
    description: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    metadata: z.any().nullable().optional(),
});

export type TCreateTransaction = z.infer<typeof ZCreateTransaction>;

export const ZUpdateTransaction = z.object({
    status: z.enum(ETransactionStatus).optional(),
    description: z.string().nullable().optional(),
    referenceNumber: z.string().nullable().optional(),
    metadata: z.any().nullable().optional(),
    processedAt: z.coerce.date().nullable().optional(),
});

export type TUpdateTransaction = z.infer<typeof ZUpdateTransaction>;

export const ZTransactionQueryFilter = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    paymentId: z.string().optional(),
    orderId: z.string().optional(),
    userId: z.string().optional(),
    type: z.enum(ETransactionType).optional(),
    status: z.enum(ETransactionStatus).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'amount', 'processedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export type TTransactionQueryFilter = z.infer<typeof ZTransactionQueryFilter>;
