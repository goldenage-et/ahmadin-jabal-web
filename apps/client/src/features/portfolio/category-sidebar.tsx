import { Card, CardContent } from '@/components/ui/card';
import {
  Headphones,
  Lightbulb,
  Gem,
  Car,
  Home,
  Scissors,
  ChevronRight,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { TCategoryBasic } from '@repo/common';

interface CategorySidebarProps {
  categories: TCategoryBasic[];
}

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronic') || name.includes('tech')) return Headphones;
  if (name.includes('home') || name.includes('garden')) return Home;
  if (name.includes('light') || name.includes('lamp')) return Lightbulb;
  if (name.includes('jewelry') || name.includes('watch')) return Gem;
  if (name.includes('automotive') || name.includes('car')) return Car;
  if (name.includes('beauty') || name.includes('hair')) return Scissors;
  return Package; // Default icon
};

export function CategorySidebar({ categories }: CategorySidebarProps) {
  return (
    <div className='w-64 bg-white border-r border-gray-200 p-4'>
      <h3 className='font-semibold text-gray-900 mb-4'>Categories</h3>

      <div className='space-y-2'>
        {categories.length > 0 ? (
          categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            return (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className='hover:shadow-md transition-shadow cursor-pointer'>
                  <CardContent className='p-3'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                        <IconComponent className='h-5 w-5 text-gray-600' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {category.name}
                        </p>
                      </div>

                      <ChevronRight className='h-4 w-4 text-gray-400 flex-shrink-0' />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <Package className='h-12 w-12 mx-auto mb-4 text-gray-300' />
            <p className='text-sm'>No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
}
