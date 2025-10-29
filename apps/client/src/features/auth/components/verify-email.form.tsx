'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { ZVerifyEmail, ZEmailVerification } from '@repo/common';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getEmailVerification, verifyEmail } from '../actions/auth.action';

export default function VerifyEmailForm({
  email: initialEmail,
}: {
  email?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { isLoading, mutate } = useApiMutation();

  const verifyForm = useForm<{ email: string; otp: string }>({
    resolver: zodResolver(ZVerifyEmail),
    defaultValues: {
      email: initialEmail || '',
      otp: '',
    },
  });

  const resendForm = useForm<{ email: string }>({
    resolver: zodResolver(ZEmailVerification),
    defaultValues: {
      email: initialEmail || '',
    },
  });

  const onVerifySubmit = async (data: { email: string; otp: string }) => {
    setError(null);
    mutate(async () => verifyEmail(data), {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to verify email');
      },
    });
  };

  const onResendSubmit = async (data: { email: string }) => {
    setError(null);
    mutate(async () => getEmailVerification(data), {
      onSuccess: () => {
        setSuccess(false);
        setIsEmailSent(true);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to resend verification');
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

      {success ? (
        <div className='bg-green-50 border border-green-200 text-green-800 rounded-lg p-4'>
          <p className='text-sm'>
            Email verified successfully! Redirecting you to sign in...
          </p>
        </div>
      ) : isEmailSent ? (
        <div className='bg-green-50 border border-green-200 text-green-800 rounded-lg p-4'>
          <p className='text-sm'>
            Verification email sent! Please check your inbox for the OTP code to
            complete your registration.
          </p>
        </div>
      ) : null}

      {!success && (
        <div className='space-y-6'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold mb-2'>Verify Your Email</h2>
            <p className='text-gray-600 mb-6'>
              Enter the OTP code sent to your email to verify your inbox.
            </p>
          </div>
          <Form {...verifyForm}>
            <form
              onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
              className='space-y-4'
            >
              <FormField
                control={verifyForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Enter your email address'
                        {...field}
                        disabled={!!initialEmail || isLoading}
                        className='h-12'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={verifyForm.control}
                name='otp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP Code</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Enter the OTP code'
                        maxLength={6}
                        {...field}
                        disabled={isLoading}
                        className='h-12'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading} className='w-full'>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>
          <Form {...resendForm}>
            <form onSubmit={resendForm.handleSubmit(onResendSubmit)}>
              <Button
                type='submit'
                disabled={isLoading}
                variant='secondary'
                className='w-full'
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </form>
          </Form>
          <Button
            type='button'
            onClick={() => router.push('/auth/signin')}
            variant='outline'
            className='w-full'
          >
            Back to sign in
          </Button>
        </div>
      )}
    </div>
  );
}
