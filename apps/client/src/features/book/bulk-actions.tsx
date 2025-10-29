'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { EBookStatus } from '@repo/common';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { bookBulkOperation } from '@/features/book/actions/book.action';
import { toast } from 'sonner';

interface BulkActionsProps {
  selectedBooks?: string[];
}

export function BulkActions({ selectedBooks = [] }: BulkActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<EBookStatus | ''>('');

  const {
    mutate: bookBulkOperationMutation,
    isLoading: isUpdatingBulkBook,
  } = useApiMutation();

  const handleBulkStatusUpdate = (status: EBookStatus) => {
    if (selectedBooks.length === 0) {
      toast.error('No books selected');
      return;
    }

    bookBulkOperationMutation(
      async () =>
        bookBulkOperation({
          update: selectedBooks.map((id) => ({ id, status })),
          delete: [],
        }),
      {
        onSuccess: () => {
          toast.success('Books updated successfully');
          setSelectedStatus('');
          // Refresh the page to update the data
          window.location.reload();
        },
        onError: (error) => {
          console.error('Failed to update books:', error);
          toast.error('Failed to update books');
        },
      },
    );
  };

  const handleBulkDelete = () => {
    if (selectedBooks.length === 0) {
      toast.error('No books selected');
      return;
    }

    bookBulkOperationMutation(
      async () =>
        bookBulkOperation({
          update: [],
          delete: selectedBooks.map((id) => ({ id })),
        }),
      {
        onSuccess: () => {
          toast.success('Books deleted successfully');
          // Refresh the page to update the data
          window.location.reload();
        },
        onError: (error) => {
          console.error('Failed to delete books:', error);
          toast.error('Failed to delete books');
        },
      },
    );
  };

  if (selectedBooks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {selectedBooks.length} book(s) selected
          </p>
          <div className='flex gap-2'>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                if (value && value !== '') {
                  handleBulkStatusUpdate(value as EBookStatus);
                }
              }}
              disabled={isUpdatingBulkBook}
            >
              <SelectTrigger className='w-32'>
                <SelectValue placeholder='Update status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EBookStatus.draft}>Draft</SelectItem>
                <SelectItem value={EBookStatus.active}>Active</SelectItem>
                <SelectItem value={EBookStatus.archived}>
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleBulkDelete}
              variant='outline'
              size='sm'
              className='text-red-600'
              disabled={isUpdatingBulkBook}
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
