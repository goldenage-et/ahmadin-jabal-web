'use client';

import { deleteAddress } from '@/actions/address.action';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { TAddress } from '@repo/common';
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AddressForm } from './address-form';

interface AddressCardProps {
  address: TAddress;
}

export function AddressCard({ address }: AddressCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const handleDelete = async () => {
    await mutate(() => deleteAddress(address.id), {
      successMessage: 'Address deleted successfully',
      errorMessage: 'Failed to delete address',
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const formatAddress = () => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
  };

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5 text-muted-foreground' />
              <div>
                <CardTitle className='text-lg'>Address</CardTitle>
                <CardDescription className='text-sm'>
                  {formatAddress()}
                </CardDescription>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowEditForm(true)}
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-2 text-sm'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-medium'>Street:</span>
                <p className='text-muted-foreground'>{address.street}</p>
              </div>
              <div>
                <span className='font-medium'>City:</span>
                <p className='text-muted-foreground'>{address.city}</p>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <span className='font-medium'>State:</span>
                <p className='text-muted-foreground'>{address.state}</p>
              </div>
              <div>
                <span className='font-medium'>Zip Code:</span>
                <p className='text-muted-foreground'>{address.zipCode}</p>
              </div>
            </div>
            <div>
              <span className='font-medium'>Country:</span>
              <p className='text-muted-foreground'>{address.country}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className='text-xs text-muted-foreground'>
          Created: {new Date(address.createdAt!).toLocaleDateString()}
          {address.updatedAt && address.updatedAt !== address.createdAt && (
            <span className='ml-2'>
              • Updated: {new Date(address.updatedAt).toLocaleDateString()}
            </span>
          )}
        </CardFooter>
      </Card>

      {/* Edit Address Form */}
      <AddressForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        address={address}
        mode='edit'
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
              <br />
              <br />
              <strong>{formatAddress()}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
