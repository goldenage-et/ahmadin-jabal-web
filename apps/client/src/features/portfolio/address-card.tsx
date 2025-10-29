'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  deleteShippingAddress,
  setDefaultAddress,
} from '../../actions/profile.action';

interface AddressCardProps {
  address: {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    isDefault: boolean;
  };
  onEdit: (address: AddressCardProps['address']) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteShippingAddress(address.id);
      toast.success('Address deleted successfully');
      onDelete(address.id);
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      await setDefaultAddress(address.id);
      toast.success('Default address updated successfully');
      onSetDefault(address.id);
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address. Please try again.');
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center'>
          <MapPin className='h-4 w-4 text-gray-400 mr-2' />
          <span className='font-medium'>Address</span>
          {address.isDefault && (
            <Badge className='ml-2' variant='secondary'>
              Default
            </Badge>
          )}
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onEdit(address)}
          className='h-8 w-8 p-0'
        >
          <Edit className='h-4 w-4' />
        </Button>
      </div>

      <div className='text-sm text-gray-600 space-y-1 mb-4'>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.country}</p>
      </div>

      <div className='flex space-x-2'>
        {!address.isDefault && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            className='flex-1'
          >
            {isSettingDefault ? 'Setting...' : 'Set as Default'}
          </Button>
        )}
        <Button
          variant='outline'
          size='sm'
          onClick={handleDelete}
          disabled={isDeleting}
          className='flex-1 text-red-600 hover:text-red-700 hover:bg-red-50'
        >
          <Trash2 className='h-4 w-4 mr-1' />
          {isDeleting ? 'Deleting...' : 'Remove'}
        </Button>
      </div>
    </div>
  );
}
