import { api } from '@/lib/api';
import {
    TBankAccount,
    TCreateBankAccount,
    TFetcherResponse,
    TUpdateBankAccount,
} from '@repo/common';

export async function getBankAccounts(): Promise<TBankAccount[]> {
    const data = await api.get<TBankAccount[]>('/bank-accounts');
    if (data.error) {
        throw new Error('Failed to fetch bank accounts');
    }
    return data as TBankAccount[];
}

export async function getBankAccount(id: string): Promise<TBankAccount> {
    const data = await api.get<TBankAccount>(`/bank-accounts/${id}`);
    if (data.error) {
        throw new Error('Failed to fetch bank account');
    }
    return data as TBankAccount;
}

export async function createBankAccount(
    data: TCreateBankAccount,
): Promise<TFetcherResponse<TBankAccount>> {
    return await api.post<TBankAccount>('/bank-accounts', data);
}

export async function updateBankAccount(
    id: string,
    data: TUpdateBankAccount,
): Promise<TFetcherResponse<TBankAccount>> {
    return await api.put<TBankAccount>(`/bank-accounts/${id}`, data);
}

export async function deleteBankAccount(id: string): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/bank-accounts/${id}`);
}

