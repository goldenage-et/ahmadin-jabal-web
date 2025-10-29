'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TBookSpecification,
  TUpdateBookSpecification,
  ZUpdateBookSpecification,
} from '@repo/common';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateBookSpecification } from '../actions/book.action';

interface UpdateSpecificationFormProps {
  specificationId: string;
  specification: TBookSpecification;
  bookId: string;
  onSuccess?: (specification: any) => void;
  onCancel?: () => void;
}

export default function UpdateSpecificationForm({
  specificationId,
  specification,
  bookId,
  onSuccess,
  onCancel,
}: UpdateSpecificationFormProps) {
  const { mutate, isLoading } = useApiMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TUpdateBookSpecification>({
    resolver: zodResolver(ZUpdateBookSpecification) as any,
    defaultValues: {
      name: specification.name,
      value: specification.value,
    },
  });

  const handleSubmit = (data: TUpdateBookSpecification) => {
    setError(null);
    mutate(
      async () => updateBookSpecification(bookId, specificationId, data),
      {
        onSuccess: (specification) => {
          if (onSuccess) onSuccess(specification);
          form.reset();
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to update specification');
        },
        successMessage: 'Specification updated successfully',
        errorMessage: 'Failed to update specification',
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-6'
        autoComplete='off'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specification Name</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Color, Size, Material' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Red, Large, Cotton' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className='text-red-600 text-sm'>{error}</div>}

        <div className='flex gap-2 justify-end'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Specification'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface UpdateSpecificationDialogProps {
  specificationId: string;
  specification: TBookSpecification;
  bookId: string;
  className?: string;
}

export function UpdateSpecificationDialog({
  specificationId,
  specification,
  bookId,
  className,
}: UpdateSpecificationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => setOpen(isOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn(className)}>
          <Plus className='h-4 w-4 mr-2' />
          Update Specification
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Update Book Specification</DialogTitle>
          <DialogDescription>
            Update the specification information and settings.
          </DialogDescription>
        </DialogHeader>
        <UpdateSpecificationForm
          specificationId={specificationId}
          specification={specification}
          bookId={bookId}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
