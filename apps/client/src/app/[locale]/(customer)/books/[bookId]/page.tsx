import { getAuth } from '@/actions/auth.action';
import { getBook } from '@/actions/book.action';
import BookDetails from '@/features/portfolio/book-details';
import {
  getBookReviewAnalytics,
  getBookReviews,
} from '@/features/reviews/actions/review.action';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function BookPage({ params }: PageProps) {
  const { bookId } = await params;
  const bookResponse = await getBook(bookId);
  const bookReviewsResponse = await getBookReviews({ bookId });
  const bookReviewAnalyticsResponse =
    await getBookReviewAnalytics(bookId);
  const { user } = await getAuth();

  if (!bookResponse || bookResponse.error) {
    throw new Error('Book not found');
  }


  const analytics = bookReviewAnalyticsResponse.error
    ? null
    : bookReviewAnalyticsResponse;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <BookDetails
          book={bookResponse}
          user={user}
          reviews={bookReviewsResponse.data}
          analytics={analytics}
        />
      </div>
    </div>
  );
}
