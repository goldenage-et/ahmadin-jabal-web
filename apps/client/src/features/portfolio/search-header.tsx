'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, QrCode, Bell, User, ChevronDown, Menu } from 'lucide-react';
import { CartIcon } from '@/features/cart/components/cart-icon';
import Link from 'next/link';

export function SearchHeader() {
  return (
    <header className='bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Top Row */}
        <div className='flex items-center justify-between py-4'>
          {/* Logo with unique styling */}
          <div className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-linear-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>A</span>
            </div>
            <Link
              href='/'
              className='text-2xl font-bold bg-linear-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent'
            >
              ahmadin
            </Link>
          </div>

          {/* Enhanced Search Bar */}
          <div className='flex-1 max-w-2xl mx-8'>
            <div className='relative group'>
              <Input
                type='text'
                placeholder='Discover amazing books from trusted vendors...'
                className='w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:border-teal-500 focus:ring-0 transition-all duration-200 group-hover:border-teal-400'
              />
              <Button
                size='sm'
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 rounded-full'
              >
                <Search className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Enhanced Right Side Icons */}
          <div className='flex items-center space-x-3'>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-teal-50 rounded-full'
            >
              <QrCode className='h-5 w-5 text-gray-600' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='relative hover:bg-teal-50 rounded-full'
            >
              <Bell className='h-5 w-5 text-gray-600' />
              <Badge className='absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500'>
                3
              </Badge>
            </Button>
            <CartIcon />
            <Button
              variant='ghost'
              size='sm'
              className='flex items-center space-x-2 hover:bg-teal-50 rounded-full px-4'
            >
              <User className='h-5 w-5 text-gray-600' />
              <span className='hidden sm:block text-sm font-medium'>
                Welcome
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced Navigation Menu */}
        <div className='flex items-center justify-between py-3 border-t border-gray-100'>
          <div className='flex items-center space-x-8'>
            <div className='flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg cursor-pointer transition-colors'>
              <Menu className='h-5 w-5 text-gray-600' />
              <span className='font-medium text-gray-700'>
                Explore Categories
              </span>
              <ChevronDown className='h-4 w-4 text-gray-500' />
            </div>

            <nav className='hidden lg:flex items-center space-x-6'>
              <Link
                href='/trending'
                className='text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors'
              >
                Trending Now
              </Link>
              <Link
                href='/deals'
                className='text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors'
              >
                Flash Deals
              </Link>
              <Link
                href='/vendors'
                className='text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors'
              >
                Top Vendors
              </Link>
              <Link
                href='/new'
                className='text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors'
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          <div className='hidden md:flex items-center space-x-4 text-sm text-gray-600'>
            <span>Free shipping on orders over $50</span>
            <span>•</span>
            <span>24/7 customer support</span>
          </div>
        </div>
      </div>
    </header>
  );
}
