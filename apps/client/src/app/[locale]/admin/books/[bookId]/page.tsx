import { getAuth } from '@/actions/auth.action';
import { getCategories } from '@/actions/categories.action';
import {
  getBook,
  getBookAnalytics,
  getBookDetailAnalytics,
} from '@/features/book/actions/book.action';
import AdminBookDetail from '@/features/book/admin-book-details';
import {
  getBookReviewAnalytics,
  getBookReviews,
} from '@/features/reviews/actions/review.action';
import { Button } from '@/components/ui/button';
import { TCategoryBasic } from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    bookId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { bookId } = await params;
  const bookResponse = await getBook(bookId);
  const { user } = await getAuth();
  const reviews = await getBookReviews({ bookId });
  const reviewAnalytics = await getBookReviewAnalytics(bookId);
  const bookAnalytics = await getBookDetailAnalytics(bookId);

  if (reviewAnalytics.error) {
    throw new Error('Review analytics not found');
  }
  if (bookAnalytics.error) {
    throw new Error('Book analytics not found');
  }

  if (!bookResponse || bookResponse.error) {
    throw new Error('Book not found');
  }

  const categories = await getCategories();

  let category: TCategoryBasic | undefined = undefined;
  if (categories.length > 0) {
    category = categories.find(
      (category) => category.id === bookResponse.categoryId,
    );
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/books'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Books
          </Link>
        </Button>
      </div>
      <AdminBookDetail
        reviews={reviews.data}
        bookAnalytics={bookAnalytics}
        reviewAnalytics={reviewAnalytics}
        book={bookResponse}
        categories={categories}
        category={category}
      />
    </div>
  );
}
