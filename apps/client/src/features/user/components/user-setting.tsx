'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TUpdateMe,
  TUserBasic,
  ZChangePassword,
  ZUpdateMe,
} from '@repo/common';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { changePassword, verifyEmail } from '../../auth/actions/auth.action';
import {
  changeEmail,
  deleteCurrentUser,
  updateCurrentUser,
} from '../actions/user.action';
import { useApiMutation } from '@/hooks/use-api-mutation';

const ZChangePasswordWithConfirmation = ZChangePassword.extend({
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ChangePasswordFormValues = z.infer<typeof ZChangePasswordWithConfirmation>;

// Email change schema
const ZChangeEmail = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ChangeEmailFormValues = z.infer<typeof ZChangeEmail>;

// Email verification schema
const ZVerifyEmailChange = z.object({
  otp: z.string().min(6, 'OTP must be at least 6 characters'),
});

type VerifyEmailChangeFormValues = z.infer<typeof ZVerifyEmailChange>;

export default function UserSetting({ user }: { user: TUserBasic }) {
  const [accountLoading, setAccountLoading] = useState(false);
  const [showAction, setShowAction] = useState<
    'changePassword' | 'changeEmail' | undefined
  >();
  const [showPassword, setShowPassword] = useState<
    ('old' | 'new' | 'confirm')[]
  >([]);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null,
  );
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState<
    { message: string; canDelete: boolean }[] | null
  >(null);
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [changeEmailError, setChangeEmailError] = useState<string | null>(null);
  const [changeEmailSuccess, setChangeEmailSuccess] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [verifyEmailError, setVerifyEmailError] = useState<string | null>(null);
  const [verifyEmailSuccess, setVerifyEmailSuccess] = useState(false);

  const { isLoading, mutate } = useApiMutation();
  const form = useForm<TUpdateMe>({
    resolver: zodResolver(ZUpdateMe),
    defaultValues: {
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      image: user.image || '',
    },
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ZChangePasswordWithConfirmation),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changeEmailForm = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(ZChangeEmail),
    defaultValues: {
      email: '',
    },
  });

  const verifyEmailForm = useForm<VerifyEmailChangeFormValues>({
    resolver: zodResolver(ZVerifyEmailChange),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: TUpdateMe) => {
    mutate(async () => updateCurrentUser(values), {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update profile');
      },
      successMessage: 'Profile updated successfully',
      errorMessage: 'Failed to update profile',
    });
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    mutate(
      async () => {
        setChangePasswordLoading(true);
        return changePassword(values);
      },
      {
        onSuccess: () => {
          setChangePasswordLoading(false);
        },
        onError: (error) => {
          setChangePasswordLoading(false);
          toast.error(error?.message || 'Failed to change password');
        },
        successMessage: 'Password changed successfully',
        errorMessage: 'Failed to change password',
      },
    );
  };

  const handleChangeEmail = async (values: ChangeEmailFormValues) => {
    setChangeEmailLoading(true);
    setChangeEmailError(null);
    const response = await changeEmail(values);
    if (response?.error) {
      setChangeEmailLoading(false);
      setChangeEmailError(
        response?.message || 'Failed to send verification code',
      );
      toast.error(response?.message || 'Failed to send verification code');
      return;
    }
    setChangeEmailLoading(false);
    setPendingEmail(values.email);
    setChangeEmailSuccess(true);
    setShowEmailVerification(true);
    toast.success('Verification code sent to your new email');
    setShowAction(undefined);
  };

  const handleVerifyEmailChange = async (
    values: VerifyEmailChangeFormValues,
  ) => {
    mutate(
      async () => {
        setVerifyEmailLoading(true);
        setVerifyEmailError(null);
        return verifyEmail({
          email: pendingEmail,
          otp: values.otp,
        });
      },
      {
        onSuccess: () => {
          setVerifyEmailSuccess(true);
          toast.success('Email changed successfully');
          setTimeout(() => {
            setShowEmailVerification(false);
            setVerifyEmailSuccess(false);
            setPendingEmail('');
            verifyEmailForm.reset();
            changeEmailForm.reset();
          }, 2000);
        },
        onError: (error) => {
          setVerifyEmailError(error?.message || 'Invalid verification code');
        },
        successMessage: 'Email changed successfully',
        errorMessage: 'Invalid verification code',
      },
    );
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    mutate(
      async () => {
        setDeleteAccountLoading(true);
        return deleteCurrentUser();
      },
      {
        onSuccess: () => {
          setDeleteAccountLoading(false);
          toast.success('Account deleted successfully');
        },
        onError: (error) => {
          setDeleteAccountLoading(false);
          toast.error(error?.message || 'Failed to delete account');
        },
        successMessage: 'Account deleted successfully',
        errorMessage: 'Failed to delete account',
      },
    );
  };

  const resetChangePasswordForm = () => {
    setShowAction(undefined);
    setChangePasswordError(null);
    setChangePasswordSuccess(false);
    changePasswordForm.reset();
  };

  const resetChangeEmailForm = () => {
    setShowAction(undefined);
    setChangeEmailError(null);
    setChangeEmailSuccess(false);
    changeEmailForm.reset();
  };

  const resetEmailVerificationForm = () => {
    setShowEmailVerification(false);
    setVerifyEmailError(null);
    setVerifyEmailSuccess(false);
    setPendingEmail('');
    verifyEmailForm.reset();
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Enter your first name'
                          {...field}
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
                          type='text'
                          placeholder='Enter your middle name'
                          {...field}
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
                          type='text'
                          placeholder='Enter your last name'
                          {...field}
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
                        <Input
                          type='tel'
                          placeholder='Enter your phone number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  disabled={accountLoading}
                  className='w-full'
                >
                  {accountLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() =>
                  setShowAction((v) =>
                    v === 'changeEmail' ? undefined : 'changeEmail',
                  )
                }
              >
                <Mail className='h-4 w-4 mr-2' />
                Change Email
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() =>
                  setShowAction((v) =>
                    v === 'changePassword' ? undefined : 'changePassword',
                  )
                }
              >
                <User className='h-4 w-4 mr-2' />
                Change Password
              </Button>

              {showAction === 'changeEmail' && (
                <Card className='border-2 border-blue-100 bg-blue-50/50'>
                  <CardContent className='pt-6'>
                    <Form {...changeEmailForm}>
                      <form
                        onSubmit={changeEmailForm.handleSubmit(
                          handleChangeEmail,
                        )}
                        className='space-y-4'
                      >
                        <div className='mb-4'>
                          <p className='text-sm text-gray-600 mb-2'>
                            Current email:{' '}
                            <span className='font-medium'>{user.email}</span>
                          </p>
                          <p className='text-xs text-gray-500'>
                            Enter your new email address. We'll send a
                            verification code to confirm the change.
                          </p>
                        </div>

                        <FormField
                          control={changeEmailForm.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type='email'
                                  placeholder='Enter new email address'
                                  autoComplete='email'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {changeEmailError && (
                          <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md'>
                            <AlertTriangle className='h-4 w-4' />
                            {changeEmailError}
                          </div>
                        )}

                        {changeEmailSuccess && (
                          <div className='flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md'>
                            <CheckCircle className='h-4 w-4' />
                            Verification code sent successfully!
                          </div>
                        )}

                        <div className='flex gap-2'>
                          <Button
                            type='submit'
                            disabled={changeEmailLoading}
                            className='flex-1'
                          >
                            {changeEmailLoading
                              ? 'Sending...'
                              : 'Send Verification Code'}
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={resetChangeEmailForm}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              {showAction === 'changeEmail' && showEmailVerification && (
                <Card className='border-2 border-orange-100 bg-orange-50/50'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-orange-700'>
                      <Mail className='h-5 w-5' />
                      Verify Email Change
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='mb-4'>
                        <p className='text-sm text-gray-700 mb-2'>
                          We've sent a verification code to:{' '}
                          <span className='font-medium'>{pendingEmail}</span>
                        </p>
                        <p className='text-xs text-gray-600'>
                          Please check your email and enter the verification
                          code below to complete the email change.
                        </p>
                      </div>

                      <Form {...verifyEmailForm}>
                        <form
                          onSubmit={verifyEmailForm.handleSubmit(
                            handleVerifyEmailChange,
                          )}
                          className='space-y-4'
                        >
                          <FormField
                            control={verifyEmailForm.control}
                            name='otp'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                  <Input
                                    type='text'
                                    placeholder='Enter 6-digit verification code'
                                    maxLength={6}
                                    className='text-center text-lg font-mono tracking-widest'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {verifyEmailError && (
                            <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md'>
                              <AlertTriangle className='h-4 w-4' />
                              {verifyEmailError}
                            </div>
                          )}

                          {verifyEmailSuccess && (
                            <div className='flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md'>
                              <CheckCircle className='h-4 w-4' />
                              Email changed successfully!
                            </div>
                          )}

                          <div className='flex gap-2'>
                            <Button
                              type='submit'
                              disabled={verifyEmailLoading}
                              className='flex-1'
                            >
                              {verifyEmailLoading
                                ? 'Verifying...'
                                : 'Verify & Change Email'}
                            </Button>
                            <Button
                              type='button'
                              variant='outline'
                              onClick={resetEmailVerificationForm}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showAction === 'changePassword' && (
                <Card className='border-2 border-blue-100 bg-blue-50/50'>
                  <CardContent className='pt-6'>
                    <Form {...changePasswordForm}>
                      <form
                        onSubmit={changePasswordForm.handleSubmit(
                          handleChangePassword,
                        )}
                        className='space-y-4'
                      >
                        <FormField
                          control={changePasswordForm.control}
                          name='oldPassword'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                                  <Input
                                    type={
                                      showPassword.includes('old')
                                        ? 'text'
                                        : 'password'
                                    }
                                    placeholder='Enter current password'
                                    {...field}
                                    disabled={isLoading}
                                    className='h-12 pl-10'
                                  />
                                  <button
                                    type='button'
                                    tabIndex={-1}
                                    className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                                    onClick={() =>
                                      setShowPassword((prev) => {
                                        if (prev.includes('old')) {
                                          return prev.filter(
                                            (p) => p !== 'old',
                                          );
                                        }
                                        return [...prev, 'old'];
                                      })
                                    }
                                    aria-label={
                                      showPassword.includes('old')
                                        ? 'Hide password'
                                        : 'Show password'
                                    }
                                  >
                                    {showPassword.includes('old') ? (
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
                          control={changePasswordForm.control}
                          name='newPassword'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                                  <Input
                                    type={
                                      showPassword.includes('new')
                                        ? 'text'
                                        : 'password'
                                    }
                                    placeholder='Enter your password'
                                    {...field}
                                    disabled={isLoading}
                                    className='h-12 pl-10'
                                  />
                                  <button
                                    type='button'
                                    tabIndex={-1}
                                    className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                                    onClick={() =>
                                      setShowPassword((prev) => {
                                        if (prev.includes('new')) {
                                          return prev.filter(
                                            (p) => p !== 'new',
                                          );
                                        }
                                        return [...prev, 'new'];
                                      })
                                    }
                                    aria-label={
                                      showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                    }
                                  >
                                    {showPassword.includes('new') ? (
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
                          control={changePasswordForm.control}
                          name='confirmPassword'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <div className='relative'>
                                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                                  <Input
                                    type={
                                      showPassword.includes('confirm')
                                        ? 'text'
                                        : 'password'
                                    }
                                    placeholder='Confirm new password'
                                    {...field}
                                    disabled={isLoading}
                                    className='h-12 pl-10'
                                  />
                                  <button
                                    type='button'
                                    tabIndex={-1}
                                    className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                                    onClick={() =>
                                      setShowPassword((prev) => {
                                        if (prev.includes('confirm')) {
                                          return prev.filter(
                                            (p) => p !== 'confirm',
                                          );
                                        }
                                        return [...prev, 'confirm'];
                                      })
                                    }
                                    aria-label={
                                      showPassword
                                        ? 'Hide password'
                                        : 'Show password'
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

                        {changePasswordError && (
                          <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md'>
                            <AlertTriangle className='h-4 w-4' />
                            {changePasswordError}
                          </div>
                        )}

                        {changePasswordSuccess && (
                          <div className='flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md'>
                            <CheckCircle className='h-4 w-4' />
                            Password changed successfully!
                          </div>
                        )}

                        <div className='flex gap-2'>
                          <Button
                            type='submit'
                            disabled={changePasswordLoading}
                            className='flex-1'
                          >
                            {changePasswordLoading
                              ? 'Changing...'
                              : 'Change Password'}
                          </Button>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={resetChangePasswordForm}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className='border-red-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='h-5 w-5' />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {!showDeleteConfirm ? (
              <Button
                variant='outline'
                className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
                onClick={handleDeleteAccount}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Account
              </Button>
            ) : (
              <div className='space-y-4 p-4 border-2 border-red-200 bg-red-50 rounded-md'>
                <div className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5' />
                  <span className='font-semibold'>Are you sure?</span>
                </div>
                <p className='text-sm'>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data.
                </p>

                {deleteAccountError && (
                  <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md'>
                    <AlertTriangle className='h-4 w-4' />
                    {deleteAccountError.map((error) => (
                      <p key={error.message}>{error.message}</p>
                    ))}
                  </div>
                )}

                <div className='flex gap-2'>
                  <Button
                    variant='destructive'
                    onClick={handleDeleteAccount}
                    disabled={deleteAccountLoading}
                    className='flex-1'
                  >
                    {deleteAccountLoading
                      ? 'Deleting...'
                      : 'Yes, Delete My Account'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteAccountLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
