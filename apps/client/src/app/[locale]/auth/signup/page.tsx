import SignupForm from '@/features/auth/components/signup.form';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Signup() {
  return (
    <div className='min-h-screen bg-background dark:bg-background relative'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <div className='flex justify-center items-center py-12 px-4'>
        <div className='bg-card dark:bg-card w-full max-w-xl py-10 px-5 md:px-10 space-y-8 rounded-3xl shadow-lg border'>
          <div className='flex justify-center items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-12 h-12  bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-lg md:text-2xl'>
                  A
                </span>
              </div>
              <span className='text-xl md:text-2xl font-bold text-foreground dark:text-foreground'>
                ahmadin
              </span>
            </Link>
          </div>
          <div className='flex flex-col items-center gap-2 md:gap-4'>
            <h1 className='text-2xl md:text-3xl lg:text-4xl text-center font-medium'>
              Create account
            </h1>
            <p className='w-full md:w-3/4 text-sm md:text-base text-center text-muted-foreground dark:text-muted-foreground'>
              Join ahmadin today and start your journey
            </p>
          </div>
          <div className='flex flex-col gap-4 md:gap-8'>
            <SignupForm />
            <div className='text-center text-sm text-muted-foreground dark:text-muted-foreground'>
              Have an account?{' '}
              <a
                href='/auth/signin'
                className='text-primary hover:underline font-semibold'
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
