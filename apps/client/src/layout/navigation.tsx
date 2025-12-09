'use client';

import React from 'react';
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
  FileText,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SearchSuggestions } from './components/search-suggestions';
import { NavUser } from './nav-user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');

  // Process backend categories for navigation
  const mainCategories = processCategoriesForNavigation(categories);

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (query: string) => {
    router.push(`/books?search=${encodeURIComponent(query)}`);
  };

  // Check if a route is active
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={cn(
      'bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'shadow-lg shadow-primary/5' : 'shadow-sm'
    )}>
      {/* Top Row - Header */}
      <div className='bg-transparent border-b border-border/50'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-14 md:h-12'>
            {/* Left Section - Mobile Menu Button + Logo */}
            <div className='flex items-center gap-3 md:gap-4'>
              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden h-9 w-9 hover:bg-primary/10 transition-all duration-200'
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label='Open menu'
              >
                <Menu className='h-5 w-5 transition-transform duration-200' />
              </Button>

              {/* Logo */}
              <Link 
                href='/' 
                className='flex items-center space-x-2 flex-shrink-0 group transition-transform duration-200 hover:scale-105'
              >
                <div className='relative w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-200'>
                  <span className='text-background font-bold text-lg relative z-10'>U</span>
                  <div className='absolute inset-0 bg-primary/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200'></div>
                </div>
                <span className='text-lg md:text-xl font-bold text-foreground hidden sm:block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>
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
                    <Button 
                      variant='outline' 
                      size='sm' 
                      asChild 
                      className='hidden sm:flex hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
                    >
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
                  <Button 
                    variant='outline' 
                    size='sm' 
                    asChild 
                    className='hidden sm:inline-flex hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
                  >
                    <Link href='/auth/signin'>Sign in</Link>
                  </Button>
                  <Button 
                    size='sm' 
                    asChild 
                    className='text-xs sm:text-sm px-2 sm:px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-200'
                  >
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
            <div className='flex items-center space-x-1 lg:space-x-2 min-w-max'>
              <NavLink href='/' label={t('home')} pathname={pathname} />
              <NavLink href='/about' label={t('about')} pathname={pathname} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    'text-sm font-medium whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 relative group',
                    isActiveRoute('/publications') || isActiveRoute('/blogs')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}>
                    Publications
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isCategoryDropdownOpen && 'rotate-180'
                    )} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align='start' 
                  className='w-48 rounded-xl shadow-lg border border-border/50 bg-background/95 backdrop-blur-sm'
                  onOpenChange={setIsCategoryDropdownOpen}
                >
                  <DropdownMenuItem asChild>
                    <Link 
                      href='/publications' 
                      className={cn(
                        'flex items-center gap-2 cursor-pointer transition-colors',
                        isActiveRoute('/publications') && 'bg-primary/10 text-primary'
                      )}
                    >
                      <BookOpen className='h-4 w-4' />
                      Publications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href='/blogs' 
                      className={cn(
                        'flex items-center gap-2 cursor-pointer transition-colors',
                        isActiveRoute('/blogs') && 'bg-primary/10 text-primary'
                      )}
                    >
                      <FileText className='h-4 w-4' />
                      Blogs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavLink href='/media' label={t('media')} pathname={pathname} />
              <NavLink href='/contact' label={t('contact')} pathname={pathname} />
              <NavLink href='/subscriptions' label={t('pricing')} pathname={pathname} />
              <NavLink href='/books' label={t('book')} pathname={pathname} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side='left'
          className='w-[85vw] sm:w-80 bg-background/95 backdrop-blur-xl border-r border-border overflow-y-auto p-0'
        >
          <SheetHeader className='pb-4 border-b border-border px-6 pt-6'>
            <div className='flex items-center justify-between'>
              <SheetTitle className='flex items-center space-x-2 text-left'>
                <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md'>
                  <span className='text-background font-bold text-base'>U</span>
                </div>
                <span className='text-base font-semibold text-foreground'>
                  Ustaz Ahmedin Jebel
                </span>
              </SheetTitle>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </SheetHeader>

          <div className='mt-6 space-y-6 pb-6 px-6'>
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
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3'>
                Navigation
              </h3>
              <nav className='space-y-1'>
                <MobileNavLink
                  href='/'
                  label={t('home')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={0}
                />
                <MobileNavLink
                  href='/about'
                  label={t('about')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={1}
                />
                <div className='px-3 space-y-1'>
                  <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
                    Publications
                  </div>
                  <MobileNavLink
                    href='/publications'
                    label='Publications'
                    pathname={pathname}
                    onClick={() => setIsMobileMenuOpen(false)}
                    icon={<BookOpen className='h-4 w-4 mr-2' />}
                    index={2}
                  />
                  <MobileNavLink
                    href='/blogs'
                    label='Blogs'
                    pathname={pathname}
                    onClick={() => setIsMobileMenuOpen(false)}
                    icon={<FileText className='h-4 w-4 mr-2' />}
                    index={3}
                  />
                </div>
                <MobileNavLink
                  href='/media'
                  label={t('media')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={4}
                />
                <MobileNavLink
                  href='/contact'
                  label={t('contact')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={5}
                />
                <MobileNavLink
                  href='/subscriptions'
                  label={t('subscriptions')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={6}
                />
                <MobileNavLink
                  href='/books'
                  label={t('book')}
                  pathname={pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={7}
                />
              </nav>
            </div>

            {/* Mobile Actions */}
            <div className='space-y-1 pt-4 border-t border-border'>
              <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3'>
                Quick Actions
              </h3>
              <div className='space-y-1'>
                <MobileActionLink
                  href='/books/wishlist'
                  label='Wishlist'
                  icon={<Heart className='h-4 w-4 mr-3' />}
                  badge={<Badge variant='secondary' className='text-xs'>0</Badge>}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={8}
                />
                <MobileActionLink
                  href='/books/cart'
                  label='Cart'
                  icon={<ShoppingCart className='h-4 w-4 mr-3' />}
                  badge={<Badge className='text-xs bg-orange-500'>0</Badge>}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={9}
                />
                <MobileActionLink
                  href='/profile'
                  label='Profile'
                  icon={<UserIcon className='h-4 w-4 mr-3' />}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={10}
                />
                {user?.roles?.length && user.roles.length > 0 && (
                  <MobileActionLink
                    href='/admin'
                    label='Admin Panel'
                    icon={<Wrench className='h-4 w-4 mr-3' />}
                    onClick={() => setIsMobileMenuOpen(false)}
                    index={11}
                  />
                )}
                <MobileActionLink
                  href='/vendor/dashboard'
                  label='Vendor Dashboard'
                  icon={<Store className='h-4 w-4 mr-3' />}
                  onClick={() => setIsMobileMenuOpen(false)}
                  index={12}
                />
              </div>
            </div>

            {/* Mobile Utilities */}
            <div className='pt-4 border-t border-border'>
              <div className='flex items-center justify-between px-3 mb-3'>
                <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                  Settings
                </span>
              </div>
              <div className='space-y-2 px-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Language</span>
                  <LanguageSwitcher />
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Theme</span>
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

// Navigation Link Component with Active State
function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium whitespace-nowrap px-3 py-1.5 rounded-md transition-all duration-200 relative group',
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
      )}
    >
      <span className='relative z-10'>{label}</span>
      {isActive && (
        <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full'></span>
      )}
    </Link>
  );
}

// Mobile Navigation Link Component with Animation
function MobileNavLink({
  href,
  label,
  pathname,
  onClick,
  icon,
  index = 0,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick: () => void;
  icon?: React.ReactNode;
  index?: number;
}) {
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
  
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
        'hover:bg-primary/10 hover:text-primary',
        isActive && 'bg-primary/10 text-primary border-l-2 border-primary',
        'opacity-0 translate-x-[-10px]'
      )}
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards`,
      }}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

// Mobile Action Link Component with Animation
function MobileActionLink({
  href,
  label,
  icon,
  badge,
  onClick,
  index = 0,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  onClick: () => void;
  index?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg',
        'text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200',
        'opacity-0 translate-x-[-10px]'
      )}
      style={{
        animation: `fadeInUp 0.4s ease-out ${index * 50}ms forwards`,
      }}
      onClick={onClick}
    >
      <div className='flex items-center'>
        {icon}
        {label}
      </div>
      {badge}
    </Link>
  );
}
