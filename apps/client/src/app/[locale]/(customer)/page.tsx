import { getManyBooks } from '@/actions/book.action';
import { getParentCategories } from './lib/categories';
import { PortfolioHero } from '@/features/portfolio/portfolio-hero';
import { FocusAreas } from '@/features/portfolio/focus-areas';
import { BiographyPreview } from '@/features/portfolio/biography-preview';
import { FeaturedContent } from '@/features/portfolio/featured-content';
import { CompactBooksGrid } from '@/features/portfolio/compact-books-grid';
import { CTASection } from '@/features/portfolio/cta-section';
import { ErrorState } from '@/components/error-state';
import { TBookListResponse, TBookBasic, isErrorResponse } from '@repo/common';

// Force dynamic rendering since we use server actions
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [activeBooks, categories] =
    await Promise.all([
      getManyBooks(),
      getParentCategories(),
    ]);

  // Handle books response errors
  if (isErrorResponse(activeBooks)) {
    return (
      <ErrorState
        title='Error Loading Books'
        message={activeBooks.message}
      />
    );
  }

  // activeBooks is TBookListResponse when successful, which has { data: TBookBasic[], meta: {...} }
  const booksResponse = activeBooks as TBookListResponse;
  const books: TBookBasic[] = booksResponse?.data || [];
  const featuredBooks = books.filter((book: TBookBasic) => book.featured) || [];

  return (
    <div className='min-h-screen bg-background dark:bg-background w-full'>
      {/* Portfolio Hero Section */}
      <PortfolioHero />

      {/* Focus Areas Section */}
      <FocusAreas />

      {/* Biography Preview Section */}
      <BiographyPreview />

      {/* Featured Content Section */}
      <FeaturedContent />

      {/* Featured Books Section - Keep e-commerce integration */}
      <div className='py-20'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <CompactBooksGrid
            books={featuredBooks || []}
            title='Featured Books'
            subtitle='Handpicked books from Ustaz Ahmedin Jebel and other Islamic scholars'
            layout='mixed'
            maxBooks={8}
          />
        </div>
      </div>

      {/* Call-to-Action Section */}
      <CTASection />
    </div>
  );
}
