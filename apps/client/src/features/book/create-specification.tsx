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
  TCreateBookSpecification,
  ZCreateBookSpecification,
} from '@repo/common';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBookSpecification } from '@/actions/book.action';

interface CreateSpecificationFormProps {
  bookId: string;
  onSuccess?: (specification: any) => void;
  onCancel?: () => void;
}

export default function CreateSpecificationForm({
  bookId,
  onSuccess,
  onCancel,
}: CreateSpecificationFormProps) {
  const { mutate, isLoading } = useApiMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TCreateBookSpecification>({
    resolver: zodResolver(ZCreateBookSpecification) as any,
    defaultValues: {
      name: '',
      value: '',
    },
  });

  const handleSubmit = (data: TCreateBookSpecification) => {
    setError(null);
    mutate(async () => createBookSpecification(bookId, data), {
      onSuccess: (specification) => {
        if (onSuccess) onSuccess(specification);
        form.reset();
      },
      onError: (err: any) => {
        setError(err?.message || 'Failed to create specification');
      },
      successMessage: 'Specification created successfully',
      errorMessage: 'Failed to create specification',
    });
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
            {isLoading ? 'Creating...' : 'Create Specification'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CreateSpecificationDialog({
  bookId,
  className,
}: {
  bookId: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => setOpen(isOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn(className)} variant='outline' size='sm'>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Book Specification</DialogTitle>
          <DialogDescription>
            Add a new specification for this book. Specifications help
            customers understand book specifications.
          </DialogDescription>
        </DialogHeader>
        <CreateSpecificationForm
          bookId={bookId}
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
