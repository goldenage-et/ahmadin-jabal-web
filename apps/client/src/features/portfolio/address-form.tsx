'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  addShippingAddress,
  updateShippingAddress,
} from '../../../../actions/profile.action';

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  } | null;
}

export function AddressForm({
  isOpen,
  onClose,
  onSuccess,
  editingAddress,
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: editingAddress?.street || '',
      city: editingAddress?.city || '',
      state: editingAddress?.state || '',
      country: editingAddress?.country || '',
      zipCode: editingAddress?.zipCode || '',
      isDefault: editingAddress?.isDefault || false,
    },
  });

  const isDefault = watch('isDefault');

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await updateShippingAddress(editingAddress.id, data);
        toast.success('Address updated successfully');
      } else {
        await addShippingAddress(data);
        toast.success('Address added successfully');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClose}
            className='h-8 w-8 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='street'>Street Address</Label>
              <Input
                id='street'
                {...register('street')}
                placeholder='123 Main Street'
                className={errors.street ? 'border-red-500' : ''}
              />
              {errors.street && (
                <p className='text-sm text-red-500'>{errors.street.message}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='city'>City</Label>
                <Input
                  id='city'
                  {...register('city')}
                  placeholder='New York'
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className='text-sm text-red-500'>{errors.city.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Input
                  id='state'
                  {...register('state')}
                  placeholder='NY'
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className='text-sm text-red-500'>{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <Input
                  id='country'
                  {...register('country')}
                  placeholder='United States'
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && (
                  <p className='text-sm text-red-500'>
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='zipCode'>ZIP Code</Label>
                <Input
                  id='zipCode'
                  {...register('zipCode')}
                  placeholder='10001'
                  className={errors.zipCode ? 'border-red-500' : ''}
                />
                {errors.zipCode && (
                  <p className='text-sm text-red-500'>
                    {errors.zipCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='isDefault'
                checked={isDefault}
                onCheckedChange={(checked) => setValue('isDefault', !!checked)}
              />
              <Label htmlFor='isDefault' className='text-sm'>
                Set as default address
              </Label>
            </div>

            <div className='flex space-x-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                className='flex-1'
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' className='flex-1' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingAddress
                    ? 'Update Address'
                    : 'Add Address'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
