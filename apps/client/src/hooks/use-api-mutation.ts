'use client';

import { TErrorResponse, TFetcherResponse } from '@repo/common';
import { useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

export interface UseApiMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: TErrorResponse | null) => void;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseApiMutationRef<T = any> {
  isLoading?: boolean;
  error: TErrorResponse | null;
  data: T | null;
}

export const useApiMutation = () => {
  const [isPending, setPending] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isTransitionStarted, startTransition] = useTransition();
  const [error, setError] = useState<TErrorResponse | null>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    setLoading(isPending || isTransitionStarted);
  }, [isPending, isTransitionStarted]);

  const mutate = useCallback(
    async <T>(
      mutationFn: () => Promise<TFetcherResponse<T>>,
      customOptions?: Partial<UseApiMutationOptions<T>>,
      ref?: React.RefObject<UseApiMutationRef<T> | null>,
    ): Promise<T | null> => {
      const opts = { ...customOptions };

      setPending(true);
      setError(error);
      if (ref) {
        ref.current = {
          isLoading: true,
          error: null,
          data: null,
        };
      }

      try {
        const result = await mutationFn();
        console.log(result);
        setPending(false);
        if (result && !result.error) {
          if (opts.onSuccess) {
            opts.onSuccess(result as T);
          }
          if (ref) {
            ref.current = {
              isLoading: false,
              error: error,
              data: result as T,
            };
          }
          if (opts.successMessage) {
            toast.success(opts.successMessage);
          }
        } else {
          if (opts.onError) {
            opts.onError(result as TErrorResponse);
          }
          if (ref) {
            ref.current = {
              isLoading: false,
              error: result as TErrorResponse,
              data: null,
            };
          }
          if (opts.errorMessage) {
            toast.error(result?.message || opts.errorMessage);
          }
        }
        startTransition(router.refresh);
        return result as T;
      } catch (err) {
        setPending(false);
        startTransition(router.refresh);
        setError(err as TErrorResponse);
        if (opts.onError) {
          opts.onError(err as TErrorResponse);
        }
        if (ref) {
          ref.current = {
            isLoading: false,
            error: err as TErrorResponse,
            data: null,
          };
        }
        if (opts.errorMessage) {
          toast.error(opts.errorMessage);
        }
        return null as T;
      }
    },
    [router, startTransition],
  );

  return {
    mutate,
    isLoading,
    error,
  };
};
