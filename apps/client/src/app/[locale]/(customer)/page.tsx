import { getManyBooks } from '@/actions/book.action';
import { getParentCategories } from './lib/categories';
import { PortfolioHero } from '@/features/portfolio/portfolio-hero';
import { FocusAreas } from '@/features/portfolio/focus-areas';
import { BiographyPreview } from '@/features/portfolio/biography-preview';
import { FeaturedContent } from '@/features/portfolio/featured-content';
import { CompactBooksGrid } from '@/features/portfolio/compact-books-grid';
import { CTASection } from '@/features/portfolio/cta-section';

// Force dynamic rendering since we use server actions
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [activeBooks, categories] =
    await Promise.all([
      getManyBooks(),
      getParentCategories(),
    ]);

  const featuredBooks = activeBooks.data.filter(book => book.featured)

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 w-full'>
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
