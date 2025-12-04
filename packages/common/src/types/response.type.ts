export type TErrorResponse = {
  error: true;
  message: string;
  details: Record<string, any> | undefined;
  statusCode: number;
  errorType: string;
  timestamp: string;
  path: string;
};

// export type TSuccessResponse<T> = {
//   data: T;
//   message: string;
//   statusCode: number;
//   timestamp: string;
//   path: string;
// };

/**
 * Response type that can be either the success data (T) or an error response.
 * Use `isErrorResponse()` type guard to check for errors.
 */
export type TFetcherResponse<T> = T | TErrorResponse;

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse<T>(
  response: TFetcherResponse<T>,
): response is TErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    response.error === true
  );
}
