import { CategoriesSection } from '@/features/portfolio/categories-section';
import { getParentCategories } from '../lib/categories';

// Force dynamic rendering since we use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getParentCategories();

  return (
    <div className='min-h-screen bg-white'>
      {/* Categories Section */}
      <div id='categories'>
        <CategoriesSection categories={categories} />
      </div>
    </div>
  );
}
