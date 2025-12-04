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
  Wrench,
  ChevronDown,
  BookOpen,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchSuggestions } from './components/search-suggestions';
import { NavUser } from './nav-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          <div className='flex items-center justify-between h-14 md:h-12'>
            {/* Left Section - Mobile Menu Button + Logo */}
            <div className='flex items-center gap-3 md:gap-4'>
              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden h-9 w-9'
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label='Open menu'
              >
                <Menu className='h-5 w-5' />
              </Button>

              {/* Logo */}
              <Link href='/' className='flex items-center space-x-2 flex-shrink-0'>
                <div className='w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0'>
                  <span className='text-white font-bold text-lg'>U</span>
                </div>
                <span className='text-lg md:text-xl font-bold text-gray-900 dark:text-white hidden sm:block'>
                  Ustaz Ahmedin Jebel
                </span>
              </Link>
            </div>

            {/* Center Search - Hidden on mobile, shown in mobile menu */}
            <div className='hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8'>
              <SearchSuggestions
                onSearch={handleSearch}
                searchSuggestions={searchSuggestions}
              />
            </div>

            {/* Right Side Utilities */}
            <div className='flex items-center gap-2 sm:gap-3 lg:gap-4'>
              {/* Language Switcher - Hidden on very small screens */}
              <div className='hidden sm:block'>
                <LanguageSwitcher />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Account - Simplified on mobile */}
              {user ? (
                <div className='flex items-center gap-2 text-sm'>
                  {user?.roles?.length && user.roles.length > 0 && (
                    <Button variant='outline' size='sm' asChild className='hidden sm:flex'>
                      <Link href='/admin'>
                        <Wrench className='h-4 w-4 mr-1' />
                        <span className='hidden lg:inline'>Go to Panel</span>
                      </Link>
                    </Button>
                  )}
                  <NavUser noSidebar user={user} />
                </div>
              ) : (
                <div className='flex items-center gap-1.5 sm:gap-2 text-sm'>
                  <Button variant='outline' size='sm' asChild className='hidden sm:inline-flex'>
                    <Link href='/auth/signin'>Sign in</Link>
                  </Button>
                  <Button size='sm' asChild className='text-xs sm:text-sm px-2 sm:px-4'>
                    <Link href='/auth/signup'>
                      <span className='hidden sm:inline'>Sign up</span>
                      <span className='sm:hidden'>Sign up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Categories - Hidden on mobile */}
      <div className='bg-transparent hidden md:block'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div
            className='flex items-center h-12 overflow-x-auto [&::-webkit-scrollbar]:hidden'
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Main Navigation Links */}
            <div className='flex items-center space-x-4 lg:space-x-6 min-w-max'>
              <Link
                href='/'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              >
                {t('home')}
              </Link>
              <Link
                href='/about'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              >
                {t('about')}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1'>
                    Publications
                    <ChevronDown className='h-4 w-4' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-48'>
                  <DropdownMenuItem asChild>
                    <Link href='/publications' className='flex items-center gap-2'>
                      <BookOpen className='h-4 w-4' />
                      Publications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href='/blogs' className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      Blogs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href='/media'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              >
                {t('media')}
              </Link>
              <Link
                href='/contact'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              >
                {t('contact')}
              </Link>
              <Link
                href='/books'
                className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors whitespace-nowrap'
              >
                {t('book')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side='left'
          className='w-[85vw] sm:w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800 overflow-y-auto'
        >
          <SheetHeader className='pb-4 border-b dark:border-gray-800'>
            <SheetTitle className='flex items-center space-x-2 text-left'>
              <div className='w-8 h-8 bg-green-600 rounded flex items-center justify-center flex-shrink-0'>
                <span className='text-white font-bold text-base'>U</span>
              </div>
              <span className='text-base font-semibold text-gray-900 dark:text-white'>
                Ustaz Ahmedin Jebel
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className='mt-6 space-y-6 pb-6'>
            {/* Mobile Search */}
            <div className='px-1'>
              <SearchSuggestions
                onSearch={handleSearch}
                searchSuggestions={searchSuggestions}
                className='w-full'
              />
            </div>

            {/* Mobile Navigation Links */}
            <div className='space-y-1'>
              <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2'>
                Navigation
              </h3>
              <nav className='space-y-1'>
                <Link
                  href='/'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link
                  href='/about'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('about')}
                </Link>
                <div className='px-3'>
                  <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1'>
                    Publications
                  </div>
                  <Link
                    href='/publications'
                    className='flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className='h-4 w-4 mr-2' />
                    Publications
                  </Link>
                  <Link
                    href='/blogs'
                    className='flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    Blogs
                  </Link>
                </div>
                <Link
                  href='/media'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('media')}
                </Link>
                <Link
                  href='/contact'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
                <Link
                  href='/books'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-primary transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('book')}
                </Link>
              </nav>
            </div>

            {/* Mobile Actions */}
            <div className='space-y-1 pt-4 border-t dark:border-gray-800'>
              <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2'>
                Quick Actions
              </h3>
              <div className='space-y-1'>
                <Link
                  href='/books/wishlist'
                  className='flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex items-center'>
                    <Heart className='h-4 w-4 mr-3' />
                    Wishlist
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    0
                  </Badge>
                </Link>

                <Link
                  href='/books/cart'
                  className='flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex items-center'>
                    <ShoppingCart className='h-4 w-4 mr-3' />
                    Cart
                  </div>
                  <Badge className='text-xs bg-orange-500'>0</Badge>
                </Link>

                <Link
                  href='/profile'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className='h-4 w-4 mr-3' />
                  Profile
                </Link>

                {user?.roles?.length && user.roles.length > 0 && (
                  <Link
                    href='/admin'
                    className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Wrench className='h-4 w-4 mr-3' />
                    Admin Panel
                  </Link>
                )}

                <Link
                  href='/vendor/dashboard'
                  className='flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Store className='h-4 w-4 mr-3' />
                  Vendor Dashboard
                </Link>
              </div>
            </div>

            {/* Mobile Utilities */}
            <div className='pt-4 border-t dark:border-gray-800'>
              <div className='flex items-center justify-between px-3 mb-3'>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Settings
                </span>
              </div>
              <div className='space-y-2 px-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>Language</span>
                  <LanguageSwitcher />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>Theme</span>
                  <ThemeToggle />
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center space-x-2 text-sm w-full justify-start px-0'
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
