import { getAuth } from '@/actions/auth.action';
import { getBook } from '@/actions/book.action';
import BookDetails from '@/features/portfolio/book-details';
import {
  getBookReviewAnalytics,
  getBookReviews,
} from '@/features/reviews/actions/review.action';
import {
  TBookDetail,
  TReviewAnalytics,
  isErrorResponse,
} from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { bookId } = await params;

  // Fetch data in parallel
  const [bookResponse, bookReviewsResponse, bookReviewAnalyticsResponse, authResult] =
    await Promise.all([
      getBook(bookId),
      getBookReviews({ bookId }),
      getBookReviewAnalytics(bookId),
      getAuth(),
    ]);

  const { user } = authResult;

  // Handle book response errors
  if (isErrorResponse(bookResponse)) {
    return (
      <ErrorState
        title='Book Not Found'
        message={bookResponse.message || 'The book you are looking for does not exist.'}
      />
    );
  }

  // Extract book data
  const book = bookResponse as TBookDetail;

  // Extract reviews data (getBookReviews returns TBookReviewListResponse directly)
  const reviews = bookReviewsResponse?.data || [];

  // Extract analytics data
  const analytics: TReviewAnalytics | null = isErrorResponse(bookReviewAnalyticsResponse)
    ? null
    : (bookReviewAnalyticsResponse as TReviewAnalytics);

  return (
    <div className='min-h-screen bg-background dark:bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <BookDetails
          book={book}
          user={user}
          reviews={reviews}
          analytics={analytics}
        />
      </div>
    </div>
  );
}
