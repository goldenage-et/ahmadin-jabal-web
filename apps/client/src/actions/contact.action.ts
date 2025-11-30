'use server';

import { api } from '@/lib/api';
import {
    TContactSubmissionBasic,
    TContactSubmissionDetail,
    TContactSubmissionQueryFilter,
    TContactSubmissionListResponse,
    TCreateContactSubmission,
    TFetcherResponse,
} from '@repo/common';

// Clean up undefined values from query parameters
function cleanQuery(query?: Partial<TContactSubmissionQueryFilter>) {
    return query
        ? Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined),
        )
        : undefined;
}

// Create a contact submission
export async function createContactSubmission(
    data: TCreateContactSubmission,
): Promise<TFetcherResponse<TContactSubmissionBasic>> {
    return await api.post<TContactSubmissionBasic>(
        '/contact/submissions',
        data,
    );
}

// Get many contact submissions
export async function getManyContactSubmissions(
    query?: Partial<TContactSubmissionQueryFilter>,
): Promise<TFetcherResponse<TContactSubmissionListResponse>> {
    return await api.get<TContactSubmissionListResponse>(
        '/contact/submissions',
        {
            params: cleanQuery(query),
        },
    );
}

// Get one contact submission
export async function getContactSubmission(
    id: string,
): Promise<TFetcherResponse<TContactSubmissionDetail>> {
    return await api.get<TContactSubmissionDetail>(
        `/contact/submissions/${id}`,
    );
}

// Reply to a contact submission
export async function replyToContactSubmission(
    id: string,
    replyMessage: string,
): Promise<TFetcherResponse<TContactSubmissionBasic>> {
    return await api.post<TContactSubmissionBasic>(
        `/contact/submissions/${id}/reply`,
        { replyMessage },
    );
}

// Delete a contact submission
export async function deleteContactSubmission(
    id: string,
): Promise<TFetcherResponse<{ message: string }>> {
    return await api.delete<{ message: string }>(`/contact/submissions/${id}`);
}

