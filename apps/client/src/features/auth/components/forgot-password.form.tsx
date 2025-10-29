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
import { ZForgetPassword, ZSetPassword } from '@repo/common';
import { Mail, KeyRound, Lock, EyeOff, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { forgetPassword, setPassword } from '../actions/auth.action';

const setPasswordSchema = ZSetPassword.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

type EmailStepProps = {
  form: UseFormReturn<{ email: string }>;
  isLoading: boolean;
  onSubmit: (data: { email: string }) => void;
  error: string | null;
};

function EmailStep({ form, isLoading, onSubmit, error }: EmailStepProps) {
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
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    <Input
                      type='email'
                      placeholder='Enter your email address'
                      className='pl-10 h-12'
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

type OtpStepProps = {
  form: UseFormReturn<{ otp: string }>;
  isLoading: boolean;
  onSubmit: (data: { otp: string }) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  error: string | null;
  email: string;
};

function OtpStep({
  form,
  isLoading,
  onSubmit,
  onResend,
  onChangeEmail,
  error,
  email,
}: OtpStepProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4'>
        <p className='text-sm'>
          OTP sent! We've sent a 6-digit OTP code to <strong>{email}</strong>.
          Please check your inbox and enter the code below.
        </p>
      </div>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4'>
          <p className='text-sm'>{error}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='otp'
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <KeyRound className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    <Input
                      type='text'
                      placeholder='Enter 6-digit OTP code'
                      className='pl-10 h-12'
                      maxLength={6}
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
      </Form>
      <div className='flex flex-col gap-3'>
        <Button
          type='button'
          onClick={onResend}
          disabled={isLoading}
          variant='outline'
          className='w-full'
        >
          {isLoading ? 'Sending...' : 'Resend OTP'}
        </Button>
        <Button
          type='button'
          onClick={onChangeEmail}
          variant='ghost'
          className='w-full'
        >
          Change Email
        </Button>
      </div>
    </div>
  );
}

type PasswordStepProps = {
  form: UseFormReturn<SetPasswordFormData>;
  isLoading: boolean;
  onSubmit: (data: SetPasswordFormData) => void;
  onBack: () => void;
  error: string | null;
};

function PasswordStep({
  form,
  isLoading,
  onSubmit,
  onBack,
  error,
}: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState<('password' | 'confirm')[]>(
    [],
  );
  return (
    <div className='flex flex-col gap-6'>
      <div className='bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4'>
        <p className='text-sm'>
          OTP verified! Now enter your new password below.
        </p>
      </div>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4'>
          <p className='text-sm'>{error}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    <Input
                      type={
                        showPassword.includes('password') ? 'text' : 'password'
                      }
                      placeholder='Your new password'
                      className='pl-10 h-12'
                      {...field}
                      disabled={isLoading}
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    <Input
                      type={
                        showPassword.includes('confirm') ? 'text' : 'password'
                      }
                      placeholder='Confirm your new password'
                      className='pl-10 h-12'
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      tabIndex={-1}
                      className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                      onClick={() =>
                        setShowPassword((prev) => {
                          if (prev.includes('confirm')) {
                            return prev.filter((p) => p !== 'confirm');
                          }
                          return [...prev, 'confirm'];
                        })
                      }
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword.includes('confirm') ? (
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
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
      <Button type='button' onClick={onBack} variant='ghost' className='w-full'>
        Back to OTP
      </Button>
    </div>
  );
}

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { isLoading: isOtpLoading, mutate: mutateForgetPassword } =
    useApiMutation();
  const { isLoading: isPasswordLoading, mutate: mutatePassword } =
    useApiMutation();

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(ZForgetPassword),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(
      z.object({
        otp: z
          .string()
          .min(6, 'OTP must be 6 digits')
          .max(6, 'OTP must be 6 digits'),
      }),
    ),
    defaultValues: {
      otp: '',
    },
    mode: 'onChange',
  });

  const passwordForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      otp: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onEmailSubmit = async (data: { email: string }) => {
    setError(null);
    mutateForgetPassword(async () => forgetPassword(data), {
      onSuccess: () => {
        setOtpSent(true);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to send OTP');
      },
    });
  };

  const onOtpSubmit = async (data: { otp: string }) => {
    setError(null);
    setOtpVerified(true);
    passwordForm.setValue('otp', data.otp);
    passwordForm.setValue('email', emailForm.getValues('email'));
  };

  const onPasswordSubmit = async (data: SetPasswordFormData) => {
    setError(null);
    mutatePassword(async () => setPassword(data), {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      },
      onError: (error) => {
        setError(error?.message || 'Failed to reset password');
      },
    });
  };

  const handleResendOtp = async () => {
    setError(null);
    const email = emailForm.getValues('email');
    mutateForgetPassword(async () => forgetPassword({ email }), {
      onError: (error) => {
        setError(error?.message || 'Failed to resend OTP');
      },
    });
  };

  if (success) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='bg-green-50 border border-green-200 text-green-800 rounded-lg p-4'>
          <p className='text-sm'>
            Password reset successfully! Redirecting you to sign in...
          </p>
        </div>
        <Button onClick={() => router.push('/auth/signin')} className='w-full'>
          Go to sign in
        </Button>
      </div>
    );
  }

  if (otpVerified) {
    return (
      <PasswordStep
        form={passwordForm}
        isLoading={isPasswordLoading}
        onSubmit={onPasswordSubmit}
        onBack={() => {
          setOtpVerified(false);
          passwordForm.reset();
          setError(null);
        }}
        error={error}
      />
    );
  }

  if (otpSent) {
    return (
      <OtpStep
        form={otpForm}
        isLoading={isOtpLoading}
        onSubmit={onOtpSubmit}
        onResend={handleResendOtp}
        onChangeEmail={() => {
          setOtpSent(false);
          otpForm.reset();
          setError(null);
        }}
        error={error}
        email={emailForm.getValues('email')}
      />
    );
  }

  return (
    <EmailStep
      form={emailForm}
      isLoading={isOtpLoading}
      onSubmit={onEmailSubmit}
      error={error}
    />
  );
}
