export type TErrorResponse = {
  error: true;
  message: string;
  details: Record<string, any> | undefined;
  statusCode: number;
  errorType: string;
  timestamp: string;
  path: string;
};

export type TFetcherResponse<T> = (T & { error: undefined }) | TErrorResponse;
