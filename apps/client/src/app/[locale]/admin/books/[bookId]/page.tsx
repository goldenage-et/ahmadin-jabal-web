import { getAuth } from '@/actions/auth.action';
import { getCategories } from '@/actions/category.action';
import {
  getBook,
  getBookDetailAnalytics,
} from '@/actions/book.action';
import AdminBookDetail from '@/features/book/admin-book-details';
import {
  getBookReviewAnalytics,
  getBookReviews,
} from '@/features/reviews/actions/review.action';
import {
  TBookDetail,
  TCategoryBasic,
  TReviewAnalytics,
  isErrorResponse,
} from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { bookId } = await params;

  // Fetch data in parallel
  const [
    bookResponse,
    reviewsResponse,
    reviewAnalyticsResponse,
    bookAnalyticsResponse,
    categoriesResponse,
    authResult,
  ] = await Promise.all([
    getBook(bookId),
    getBookReviews({ bookId }),
    getBookReviewAnalytics(bookId),
    getBookDetailAnalytics(bookId),
    getCategories(),
    getAuth(),
  ]);

  // Handle book response errors
  if (isErrorResponse(bookResponse)) {
    return (
      <ErrorState
        title='Book Not Found'
        message={bookResponse.message || 'The book you are looking for does not exist.'}
      />
    );
  }

  // Handle review analytics errors
  if (isErrorResponse(reviewAnalyticsResponse)) {
    return (
      <ErrorState
        title='Review Analytics Error'
        message={reviewAnalyticsResponse.message || 'Failed to load review analytics.'}
      />
    );
  }

  // Handle book analytics errors
  if (isErrorResponse(bookAnalyticsResponse)) {
    return (
      <ErrorState
        title='Book Analytics Error'
        message={bookAnalyticsResponse.message || 'Failed to load book analytics.'}
      />
    );
  }

  // Handle categories response errors
  if (isErrorResponse(categoriesResponse)) {
    return (
      <ErrorState
        title='Categories Error'
        message={categoriesResponse.message || 'Failed to load categories.'}
      />
    );
  }

  // Extract data from responses
  const book = bookResponse as TBookDetail;
  const reviews = reviewsResponse?.data || [];
  const reviewAnalytics = reviewAnalyticsResponse as TReviewAnalytics;
  const bookAnalytics = bookAnalyticsResponse;
  const categories = categoriesResponse as TCategoryBasic[];

  // Find category
  const category = categories.find((c) => c.id === book.categoryId);

  return (
    <div className='min-h-screen bg-background dark:bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <AdminBookDetail
          reviews={reviews}
          bookAnalytics={bookAnalytics}
          reviewAnalytics={reviewAnalytics}
          book={book}
          categories={categories}
          category={category}
        />
      </div>
    </div>
  );
}
