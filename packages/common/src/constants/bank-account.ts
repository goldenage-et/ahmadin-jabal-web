import { TBankOption } from "@/schemas/payments/payment.schema";
import z from "zod";


export enum EBankCode {
    CBE = 'CBETETAA',
    DASHEN = 'DASHETAA',
    AWASH = 'AWINETAA',
    ABYSINIA = 'ABYSINIA',
}

export const BANK_ACCOUNT: TBankOption[] = [
    {
        name: 'Commercial Bank of Ethiopia',
        code: EBankCode.CBE,
        validate: (accountNumber) => z.string().min(13).max(13).startsWith('1000').safeParse(accountNumber)
    },
    {
        name: 'Dashen Bank S.C',
        code: EBankCode.DASHEN,
        validate: (accountNumber) => z.string().safeParse(accountNumber)
    },
    {
        name: 'Awash Bank S.C',
        code: EBankCode.AWASH,
        validate: (accountNumber) => z.string().safeParse(accountNumber)
    },
    {
        name: 'Bank of Abyssinia',
        code: EBankCode.ABYSINIA,
        validate: (accountNumber) => z.string().safeParse(accountNumber)
    }
];