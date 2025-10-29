'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { TCategoryBasic } from '@repo/common';

export function useCategories() {
  const [categories, setCategories] = useState<TCategoryBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<TCategoryBasic[]>('/categories');

      if (response.error) {
        throw new Error(response.message || 'Failed to fetch categories');
      }

      setCategories(response as TCategoryBasic[]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch categories',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch,
  };
}
