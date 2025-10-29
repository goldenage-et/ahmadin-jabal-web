'use server';

import { api } from '@/lib/api';
import {
    TBankInfo,
    TValidateReference,
    TBankClientReceiptData,
    TFetcherResponse,
} from '@repo/common';

export async function getBanks(): Promise<TBankInfo[]> {
    const data = await api.get<TBankInfo[]>('/bank-transfer/banks');
    if (data.error) {
        throw new Error('Failed to fetch banks');
    }
    return data as TBankInfo[];
}

export async function validateReference(
    data: TValidateReference,
): Promise<TFetcherResponse<TBankClientReceiptData>> {
    return await api.post<TBankClientReceiptData>('/bank-transfer/validate', data);
}


