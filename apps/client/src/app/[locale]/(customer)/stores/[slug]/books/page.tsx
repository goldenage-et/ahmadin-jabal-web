import { getOneStoreWithSlugPublic } from '../../../../_actions/store.action';
import { getBooks } from '../../../../../../features/book/actions/book.action';
import { notFound } from 'next/navigation';
import { StoreBooksClient } from './store-books-client';
import { StoreErrorBoundary } from '../components/error-boundary';
import { TStoreDetail } from '@repo/common';
import { getAuth } from '../../../../../../actions/auth.action';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StoreBooksPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch store details
  const storeResponse = await getOneStoreWithSlugPublic(slug, { detail: true });

  if ('error' in storeResponse) {
    notFound();
  }

  const store = storeResponse as TStoreDetail;

  // Fetch store books
  const booksResponse = await getBooks({
    storeId: store.id,
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const books = booksResponse.data || [];

  // Get user authentication info
  const { user } = await getAuth();

  return (
    <StoreErrorBoundary>
      <StoreBooksClient store={store} books={books} user={user} />
    </StoreErrorBoundary>
  );
}
