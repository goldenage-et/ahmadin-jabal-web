import { TFetcherResponse } from '@repo/common';

export type TAuthActions = {
  getCookieHeader?: () => Promise<string>;
};
export interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export class Fetcher {
  constructor(
    private readonly baseUrl: string,
    private readonly actions: TAuthActions,
  ) { }

  private async request<T>(
    method: string,
    url: string,
    options: FetchOptions = {},
  ): Promise<TFetcherResponse<T>> {
    const headers = new Headers(options.headers);

    // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
    const isFormData = options.body instanceof FormData;

    if (!isFormData) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.actions.getCookieHeader) {
      const cookieHeader = await this.actions.getCookieHeader();
      headers.set('Cookie', cookieHeader);
    }

    const params = options.params || {};
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString
      ? `${this.baseUrl}${url}?${queryString}`
      : `${this.baseUrl}${url}`;
    const requestOptions: FetchOptions = {
      ...options,
      method,
      headers,
      // Only stringify if it's not FormData
      body: options.body
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
      credentials: 'include', // Ensure cookies are sent
    };

    try {
      const response = await fetch(fullUrl, requestOptions);
      const data = await response.json().catch(() => null);

      if (response.ok) {
        return data;
      }

      // If the response is not ok, prefer the error object if present
      if (data && typeof data === 'object' && data.error === true) {
        throw data;
      }

      // If no error object, throw a generic error
      throw {
        error: true,
        message: data?.message || response.statusText || 'Something went wrong',
        details: data?.details,
        statusCode: data?.statusCode || response.status,
        errorType: data?.errorType || 'internalServerError',
        timestamp: new Date().toISOString(),
        path: data?.path || fullUrl,
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.log({ error });
      }

      return {
        error: error?.error ?? true,
        message: error?.message || 'Something went wrong',
        details: error?.details,
        statusCode: error?.statusCode || 500,
        errorType: error?.errorType || 'internalServerError',
        timestamp: error?.timestamp || new Date().toISOString(),
        path: error?.path || fullUrl,
      };
    }
  }

  get<T>(url: string, options?: FetchOptions) {
    return this.request<T>('GET', url, options);
  }

  post<T>(url: string, body: any, options?: FetchOptions) {
    return this.request<T>('POST', url, { ...options, body });
  }

  put<T>(url: string, body: any, options?: FetchOptions) {
    return this.request<T>('PUT', url, { ...options, body });
  }

  delete<T>(url: string, options?: FetchOptions) {
    return this.request<T>('DELETE', url, options);
  }

  patch<T>(url: string, body: any, options?: FetchOptions) {
    return this.request<T>('PATCH', url, { ...options, body });
  }
}
