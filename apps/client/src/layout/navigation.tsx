'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { getDefaultBackgroundColor, getIconByName } from '@/utils/icon-mapper';
import {
  TAuthUser,
  TCategoryBasic,
  TSearchSuggestion
} from '@repo/common';
import {
  ChevronUp,
  Download,
  Heart,
  Menu,
  ShoppingCart,
  Store,
  UserIcon,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchSuggestions } from './components/search-suggestions';
import { NavUser } from './nav-user';

// Helper function to process backend categories into navigation format
const processCategoriesForNavigation = (categories: TCategoryBasic[]) => {
  // First, organize categories into parent-child structure
  const parentCategories = categories.filter((category) => !category.parentId);
  const subcategories = categories.filter((category) => category.parentId);

  return parentCategories.slice(0, 12).map((category, index) => {
    const IconComponent = getIconByName(category.iconName);
    const backgroundColor =
      category.backgroundColor || getDefaultBackgroundColor(index);

    // Find direct subcategories for this parent
    const directSubcategories = subcategories.filter(
      (sub) => sub.parentId === category.id,
    );

    // Process subcategories into the expected format
    const subcategoriesGrouped: Record<string, string[]> = {};

    if (directSubcategories.length > 0) {
      // Group subcategories more intelligently
      directSubcategories.forEach((sub) => {
        // Use the subcategory name as the group name
        const groupName = sub.name;
        if (!subcategoriesGrouped[groupName]) {
          subcategoriesGrouped[groupName] = [];
        }

        // Add the subcategory itself
        subcategoriesGrouped[groupName].push(sub.name);

        // Also check for sub-subcategories (nested categories)
        const subSubcategories = subcategories.filter(
          (subSub) => subSub.parentId === sub.id,
        );
        subSubcategories.forEach((subSub) => {
          subcategoriesGrouped[groupName].push(subSub.name);
        });
      });
    } else {
      // If no subcategories, create a default group
      subcategoriesGrouped['Popular Items'] = [
        'Featured Books',
        'Best Sellers',
        'New Arrivals',
      ];
    }

    return {
      name: category.name,
      href: `/books?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: IconComponent,
      backgroundColor,
      subcategories: subcategoriesGrouped,
    };
  });
};

export function Navigation({
  user,
  categories = [],
  searchSuggestions,
}: {
  user: TAuthUser | null;
  categories?: TCategoryBasic[];
  searchSuggestions: TSearchSuggestion;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const router = useRouter();
  const t = useTranslations('navigation');

  // Process backend categories for navigation
  const mainCategories = processCategoriesForNavigation(categories);

  const handleSearch = (query: string) => {
    router.push(`/books?search=${encodeURIComponent(query)}`);
  };

  return (
    <nav className='bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/20'>
      {/* Top Row - Header */}
      <div className='bg-transparent border-b border-gray-200/50 dark:border-gray-800/50'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-12'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link href='/' className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-green-600 rounded flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>U</span>
                </div>
                <span className='text-xl font-bold text-gray-900 dark:text-white hidden sm:block'>
                  Ustaz Ahmedin Jebel
                </span>
              </Link>
            </div>

            {/* Center Search - Hidden on mobile */}
            <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
              <SearchSuggestions
                onSearch={handleSearch}
                searchSuggestions={searchSuggestions}
              />
            </div>

            {/* Right Side Utilities */}
            <div className='flex items-center space-x-2 sm:space-x-4 lg:space-x-6'>
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Account - Simplified on mobile */}
              {user ? (
                <div className='flex items-center space-x-2 text-sm'>
                  {user?.roles?.length && user.roles.length > 0 && (
                    <Button variant='outline' size='sm' asChild>
                      <Link href='/admin'>
                        <Wrench className='h-4 w-4 mr-1' />
                        Go to Panel
                      </Link>
                    </Button>
                  )}
                  <NavUser noSidebar user={user} />
                </div>
              ) : (
                <div className='flex items-center space-x-2 text-sm'>
                  <Button variant='outline' size='sm' asChild>
                    <Link href='/auth/signin'>Sign in</Link>
                  </Button>
                  <Button size='sm' asChild>
                    <Link href='/auth/signup'>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Categories */}
      <div className='bg-transparent'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center h-12'>
            {/* All Categories Button 
            <div className='relative'>
              <Button
                variant='ghost'
                className='flex items-center space-x-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-md px-4 py-2 mr-6 border border-gray-200/50 dark:border-gray-700/50'
                onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                onMouseLeave={() => setIsCategoryDropdownOpen(false)}
              >
                <Menu className='h-4 w-4' />
                <span className='hidden md:flex'>All Categories</span>
                <ChevronUp className='h-4 w-4' />
              </Button>

              Multi-column Dropdown
              {isCategoryDropdownOpen && (
                <div
                  className='absolute top-full left-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-xl dark:shadow-gray-900/50 z-50 w-[800px]'
                  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                  <div className='flex'>
                    Left Column - Main Categories
                    <div className='w-48 lg:w-64 border-r border-gray-200/50 dark:border-gray-700/50'>
                      <div className='p-4'>
                        <div className='flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                          <Menu className='h-4 w-4' />
                          <span>All Categories</span>
                          <ChevronUp className='h-3 w-3' />
                        </div>
                        <div className='space-y-1'>
                          {mainCategories.map((category, index) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${activeCategory === index
                                ? 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              onMouseEnter={() => setActiveCategory(index)}
                            >
                              <div
                                className='w-6 h-6 rounded flex items-center justify-center'
                                style={{
                                  backgroundColor: category.backgroundColor,
                                }}
                              >
                                <category.icon className='h-3 w-3 text-white' />
                              </div>
                              <span className='text-sm'>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    Right Panel - Subcategories
                    <div className='flex-1 p-4 lg:p-6'>
                      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'>
                        {Object.entries(
                          mainCategories[activeCategory]?.subcategories || {},
                        ).map(([sectionName, items], sectionIndex) => (
                          <div key={sectionName} className='space-y-3'>
                            <h4 className='font-semibold text-sm text-gray-900 dark:text-white'>
                              {sectionName}
                            </h4>
                            <div className='space-y-2'>
                              {items.map((item: string, itemIndex: number) => (
                                <Link
                                  key={itemIndex}
                                  href={`/books?categoryName=${encodeURIComponent(item)}`}
                                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors'
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div> */}

            {/* Main Navigation Links */}
            <div className='flex items-center space-x-6'>
              <Link
                href='/'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('home')}
              </Link>
              <Link
                href='/about'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('about')}
              </Link>
              <Link
                href='/publications'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('publications')}
              </Link>
              <Link
                href='/media'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('media')}
              </Link>
              <Link
                href='/advocacy'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('advocacy')}
              </Link>
              <Link
                href='/contact'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('contact')}
              </Link>
              <Link
                href='/books'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors'
              >
                {t('book')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side='right' className='w-80 bg-white dark:bg-gray-900 border-l dark:border-gray-800'>
          <SheetHeader>
            <SheetTitle className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-green-600 rounded flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>U</span>
              </div>
              <span className='dark:text-white'>Ustaz Ahmedin Jebel</span>
            </SheetTitle>
          </SheetHeader>
          <div className='mt-6 space-y-6'>
            {/* Mobile Search */}
            <SearchSuggestions
              onSearch={handleSearch}
              searchSuggestions={searchSuggestions}
              className='w-full'
            />

            {/* Mobile Navigation Links */}
            <div>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-3'>
                Navigation
              </h3>
              <div className='space-y-2'>
                <Link
                  href='/'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link
                  href='/about'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('about')}
                </Link>
                <Link
                  href='/publications'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('publications')}
                </Link>
                <Link
                  href='/media'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('media')}
                </Link>
                <Link
                  href='/advocacy'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('advocacy')}
                </Link>
                <Link
                  href='/contact'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
                <Link
                  href='/books'
                  className='block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('shop')}
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Link
                  href='/books/wishlist'
                  className='flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className='h-5 w-5 mr-3' />
                  Wishlist
                </Link>
                <Badge variant='secondary' className='text-xs'>
                  0
                </Badge>
              </div>

              <div className='flex items-center justify-between'>
                <Link
                  href='/books/cart'
                  className='flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className='h-5 w-5 mr-3' />
                  Cart
                </Link>
                <Badge className='text-xs bg-orange-500'>0</Badge>
              </div>

              <Link
                href='/profile'
                className='flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon className='h-5 w-5 mr-3' />
                Profile
              </Link>

              <Link
                href='/vendor/dashboard'
                className='flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className='h-5 w-5 mr-3' />
                Vendor Dashboard
              </Link>

              <div className='pt-4 border-t dark:border-gray-800'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center space-x-2 text-sm w-full justify-start'
                >
                  <Download className='h-4 w-4' />
                  <span>Download App</span>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav >
  );
}
