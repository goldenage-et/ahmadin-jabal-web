import { Metadata } from 'next';
import { getCategories } from '@/actions/categories.action';
import { LayoutGrid } from 'lucide-react';
import { CategoriesContainer } from '@/features/categories/categories-container';
import { TCategoryBasic } from '@repo/common';

export const metadata: Metadata = {
  title: 'Categories Management - Super Admin',
  description: 'Manage book categories with advanced data table features',
};

export default async function SuperAdminCategoriesPage() {
  try {
    const categoriesResponse = await getCategories();
    return (
      <div className='space-y-6'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Categories Management
          </h1>
          <p className='text-sm text-muted-foreground'>
            Manage book categories with advanced filtering, sorting, and bulk
            operations
          </p>
        </div>

        <CategoriesContainer categories={categoriesResponse as TCategoryBasic[]} />
      </div>
    );
  } catch (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <LayoutGrid className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>
            Failed to load categories
          </h3>
          <p className='text-muted-foreground mb-4'>
            There was an error loading the categories. Please try again.
          </p>
        </div>
      </div>
    );
  }
}
