'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorType, ZLogin } from '@repo/common';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const signinSchema = ZLogin.extend({
  rememberMe: z.boolean().optional(),
});

type SigninFormData = z.infer<typeof signinSchema>;

export default function SigninForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { isLoading: isLoadingSignin, mutate: mutateSignin } = useApiMutation();
  const { isLoading: isLoadingGoogle, mutate: mutateGoogle } = useApiMutation();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    setError(null);
    mutateSignin(async () => api.post(`/auth/login`, data), {
      onSuccess: () => {
        router.push('/');
      },
      onError: (error) => {
        setError(error?.message || 'Failed to sign in');
        if (error?.errorType === ErrorType.EMAIL_NOT_VERIFIED) {
          setTimeout(() => {
            router.push(
              `/auth/verify-email?callbackUrl=${window.location.pathname}&email=${data.email}`,
            );
          }, 1000);
        }
      },
      successMessage: 'Signed in successfully',
      errorMessage: 'Failed to sign in',
    });
  };

  const handleGoogleSignin = async () => {
    setError(null);
    mutateGoogle(async () => api.get<{ url: string }>(`/auth/url/google`), {
      onSuccess: ({ url }) => {
        router.push(url);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to sign in');
      },
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4'>
          <p className='text-sm'>{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      type='email'
                      placeholder='Enter your email address'
                      className='pl-10 h-12'
                      {...field}
                      disabled={isLoadingSignin}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      {...field}
                      disabled={isLoadingSignin}
                      className='h-12 pl-10'
                    />
                    <button
                      type='button'
                      tabIndex={-1}
                      className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between'>
            <FormField
              control={form.control}
              name='rememberMe'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoadingSignin}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel className='text-sm'>Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Link
              href='/auth/forgot-password'
              className='text-sm text-blue-600 hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <Button type='submit' className='w-full' disabled={isLoadingSignin}>
            {isLoadingSignin ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background dark:bg-background px-2 text-gray-500 dark:text-gray-400'>Or continue with</span>
        </div>
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={handleGoogleSignin}
        disabled={isLoadingGoogle}
        className='w-full'
      >
        <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        Google
      </Button>
    </div>
  );
}
