'use client';

import { createAddress, updateAddress } from '@/actions/address.action';
import { CountryInput } from '@/components/country-input';
import { StateInput } from '@/components/state-input';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { TAddress, TCreateAddress, TUpdateAddress } from '@repo/common';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Street is required')
    .max(255, 'Street must be less than 255 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  zipCode: z
    .string()
    .min(1, 'Zip code is required')
    .max(20, 'Zip code must be less than 20 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: TAddress | null;
  mode: 'create' | 'edit';
}

export function AddressForm({
  open,
  onOpenChange,
  address,
  mode,
}: AddressFormProps) {
  const { mutate, isLoading } = useApiMutation();
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      country: address?.country || 'Ethiopia',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    if (mode === 'create') {
      mutate(() => createAddress(data as TCreateAddress), {
        successMessage: 'Address created successfully',
        errorMessage: 'Failed to create address',
        onSuccess: (data) => {
          onOpenChange(false);
          form.reset(data);
        },
      });
    } else if (mode === 'edit' && address) {
      mutate(() => updateAddress(address.id, data as TUpdateAddress), {
        successMessage: 'Address updated successfully',
        errorMessage: 'Failed to update address',
        onSuccess: (data) => {
          onOpenChange(false);
          form.reset(data);
        },
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset(
      address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ethiopia',
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Address' : 'Edit Address'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new address to your account.'
              : 'Update your address information.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountryInput
                      disabled={true}
                      className='h-12'
                      placeholder='Country'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <StateInput
                      country={form.watch('country')}
                      className='h-12'
                      placeholder='State'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className='h-12' placeholder='New York' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='street'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      className='h-12'
                      placeholder='123 Main Street'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='zipCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input className='h-12' placeholder='10001' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : mode === 'create'
                    ? 'Add Address'
                    : 'Update Address'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
