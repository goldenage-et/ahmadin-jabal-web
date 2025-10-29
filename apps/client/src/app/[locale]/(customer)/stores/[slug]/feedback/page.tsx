import {
  getOneStoreWithSlugPublic,
  getStoreReviews,
} from '../../../../_actions/store.action';
import { notFound } from 'next/navigation';
import { StoreFeedbackClient } from './store-feedback-client';
import { StoreErrorBoundary } from '../components/error-boundary';
import { TStoreDetail } from '@repo/common';
import { getAuth } from '../../../../../../actions/auth.action';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StoreFeedbackPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch store details
  const storeResponse = await getOneStoreWithSlugPublic(slug, { detail: true });

  if ('error' in storeResponse) {
    notFound();
  }

  const store = storeResponse as TStoreDetail;

  // Fetch store reviews
  const reviewsResponse = await getStoreReviews(store.id, {
    page: 1,
    limit: 20,
  });
  const reviews =
    'error' in reviewsResponse
      ? { reviews: [], total: 0, page: 1, limit: 20 }
      : reviewsResponse;

  // Get user authentication info
  const { user } = await getAuth();

  return (
    <StoreErrorBoundary>
      <StoreFeedbackClient store={store} user={user} reviews={reviews} />
    </StoreErrorBoundary>
  );
}
