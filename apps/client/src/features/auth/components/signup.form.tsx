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
import { PhoneInput } from '@/components/ui/phone-input';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZRegister } from '@repo/common';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signupWithEmail } from '../actions/auth.action';
import { api } from '@/lib/api';

const signupSchema = ZRegister.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.terms === true, {
    message: 'You must accept the terms and conditions',
    path: ['terms'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<('password' | 'confirm')[]>(
    [],
  );
  const [showConfirmPassword, setShowConfirmPassword] = useState<
    ('password' | 'confirm')[]
  >([]);
  const router = useRouter();
  const { isLoading: isLoadingSignup, mutate: mutateSignup } = useApiMutation();
  const { isLoading: isLoadingGoogle, mutate: mutateGoogle } = useApiMutation();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    mutateSignup(async () => signupWithEmail(data), {
      onSuccess: () => {
        router.push(`/auth/verify-email?email=${data.email}`);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to create account');
      },
      successMessage: 'Account created successfully',
      errorMessage: 'Failed to create account',
    });
  };

  const handleGoogleSignup = async () => {
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
          <div className='grid grid-cols-2 gap-4 items-start'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your first name'
                      {...field}
                      disabled={isLoadingSignup}
                      className='h-12'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='middleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your middle name'
                      {...field}
                      disabled={isLoadingSignup}
                      className='h-12'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your last name'
                      {...field}
                      disabled={isLoadingSignup}
                      className='h-12'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder='Enter your phone number (+2519xxxxxxx)'
                      type='text'
                      {...field}
                      className='h-12'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      {...field}
                      disabled={isLoadingSignup}
                      className='h-12'
                    />
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
                      <Input
                        type={
                          showPassword.includes('password')
                            ? 'text'
                            : 'password'
                        }
                        placeholder='Create a password'
                        {...field}
                        disabled={isLoadingSignup}
                        className='h-12'
                      />
                      <button
                        type='button'
                        tabIndex={-1}
                        className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                        onClick={() =>
                          setShowPassword((prev) => {
                            if (prev.includes('password')) {
                              return prev.filter((p) => p !== 'password');
                            }
                            return [...prev, 'password'];
                          })
                        }
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword.includes('password') ? (
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={
                          showConfirmPassword.includes('confirm')
                            ? 'text'
                            : 'password'
                        }
                        placeholder='Confirm your password'
                        {...field}
                        disabled={isLoadingSignup}
                        className='h-12'
                      />
                      <button
                        type='button'
                        tabIndex={-1}
                        className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                        onClick={() =>
                          setShowConfirmPassword((prev) => {
                            if (prev.includes('confirm')) {
                              return prev.filter((p) => p !== 'confirm');
                            }
                            return [...prev, 'confirm'];
                          })
                        }
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showConfirmPassword.includes('confirm') ? (
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
          </div>
          <FormField
            control={form.control}
            name='terms'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoadingSignup}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel className='text-sm'>
                    I agree to the{' '}
                    <a href='#' className='text-blue-600 hover:underline'>
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-blue-600 hover:underline'>
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isLoadingSignup} className='w-full'>
            {isLoadingSignup ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-500'>Or continue with</span>
        </div>
      </div>

      <Button
        type='button'
        variant='outline'
        onClick={handleGoogleSignup}
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
