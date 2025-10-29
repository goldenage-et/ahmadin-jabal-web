'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function useSearchState<T>(
  name: string,
  defaultValue?: T,
  parseFun?: (value: string) => T,
): [T, (value?: T | null) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(name) || defaultValue || '';

  const setValue = (newValue?: T | null) => {
    if (newValue && Boolean(newValue)) {
      const params = new URLSearchParams(searchParams);
      params.set(name, newValue.toString());
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete(name);

      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const parsedValue = parseFun ? parseFun(value.toString()) : (value as T);

  return [parsedValue, setValue];
}
