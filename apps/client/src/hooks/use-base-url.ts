'use client';

import { useParams } from 'next/navigation';

export default function useBaseUrl() {
  const params = useParams();
  const { organizationSlug, programSlug } = params as { [key: string]: string };
  return { organizationSlug, programSlug };
}
