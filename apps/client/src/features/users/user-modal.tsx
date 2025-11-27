'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TCreateUser,
  TAuthUser,
  TUpdateUser,
  ZCreateUser
} from '@repo/common';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TAuthUser | null;
  isSubmitting: boolean;
  onSubmit: (data: TCreateUser | TUpdateUser) => void;
  readOnly?: boolean;
}

export function UserModal({
  isOpen,
  onClose,
  initialData,
  isSubmitting,
  onSubmit,
  readOnly = false,
}: UserModalProps) {
  const isEdit = !!initialData;
  const form = useForm<TCreateUser>({
    resolver: zodResolver(ZCreateUser),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    console.log(
      'Modal useEffect - initialData:',
      initialData,
      'isOpen:',
      isOpen,
    );
    if (initialData && isOpen) {
      // Reset form with initial data when editing
      console.log('Resetting form with initial data');
      form.reset({
        firstName: initialData.firstName || '',
        middleName: initialData.middleName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
      });
    } else if (!initialData && isOpen) {
      // Reset form with empty values when creating
      console.log('Resetting form with empty values');
      form.reset({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
      });
    }
  }, [initialData, isOpen, form]);

  const handleSubmit = (data: TCreateUser) => {
    onSubmit(data);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {readOnly
              ? 'User Details'
              : isEdit
                ? 'Edit User'
                : 'Create New User'}
          </DialogTitle>
          <DialogDescription>
            {readOnly
              ? 'View user information below.'
              : isEdit
                ? 'Update the user information below.'
                : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter first name'
                        {...field}
                        disabled={readOnly}
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
                    <FormLabel>Middle Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter middle name'
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter last name'
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='user@example.com'
                        {...field}
                        disabled={readOnly}
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
                        placeholder='+1 (555) 123-4567'
                        {...field}
                        disabled={readOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Read-only fields for display */}
            {readOnly && initialData && (
              <div className='space-y-4 pt-4 border-t'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Roles
                    </label>
                    <div className='mt-1'>
                      <Badge variant='secondary' className='capitalize'>
                        {initialData.roles?.map((role) => role.name).join(', ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Status
                    </label>
                    <div className='mt-1'>
                      <Badge
                        variant={initialData.active ? 'default' : 'destructive'}
                      >
                        {initialData.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Email Verified
                    </label>
                    <div className='mt-1'>
                      <Badge
                        variant={
                          initialData.emailVerified ? 'default' : 'secondary'
                        }
                      >
                        {initialData.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Created At
                    </label>
                    <div className='mt-1 text-sm'>
                      {initialData.createdAt
                        ? new Date(initialData.createdAt).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Updated At
                    </label>
                    <div className='mt-1 text-sm'>
                      {initialData.updatedAt
                        ? new Date(initialData.updatedAt).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type='button' variant='outline' onClick={onClose}>
                {readOnly ? 'Close' : 'Cancel'}
              </Button>
              {!readOnly && (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Saving...'
                    : isEdit
                      ? 'Update User'
                      : 'Create User'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
