import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Search, Lock } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='flex justify-center items-center py-12 px-4'>
        <div className='w-full max-w-xl space-y-8'>
          <div className='flex justify-center items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-lg md:text-2xl'>
                  A
                </span>
              </div>
              <span className='text-xl md:text-2xl font-bold text-foreground'>
                ahmadin
              </span>
            </Link>
          </div>
          <div className='flex flex-col items-center gap-2 md:gap-4'>
            <div className='text-6xl md:text-8xl font-bold text-primary'>
              404
            </div>
            <h1 className='text-2xl md:text-3xl lg:text-4xl text-center font-medium text-foreground'>
              Page Not Found
            </h1>
            <p className='w-full md:w-3/4 text-sm md:text-base text-center text-muted-foreground'>
              Sorry, the page you are looking for doesn't exist or has been
              moved.
            </p>
          </div>
          <div className='flex flex-col gap-4 md:gap-6'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button asChild className='flex-1'>
                <Link
                  href='/'
                  className='flex items-center justify-center gap-2'
                >
                  <Home className='h-4 w-4' />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant='secondary' className='flex-1'>
                <Link
                  href='/shop'
                  className='flex items-center justify-center gap-2'
                >
                  <Search className='h-4 w-4' />
                  Browse Books
                </Link>
              </Button>
            </div>
            <div className='text-center text-sm text-muted-foreground'>
              Need help?{' '}
              <a
                href='/contact'
                className='text-primary hover:underline font-semibold'
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
