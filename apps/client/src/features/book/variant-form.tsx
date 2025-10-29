'use client';

import SingleFileUploader from '@/components/single-file-uploader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TCreateBookVariant,
  TBookVariant,
  TUpdateBookVariant,
  ZCreateBookVariant,
  ZUpdateBookVariant,
} from '@repo/common';
import { AlertCircle, Loader2, Package, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  createBookVariant,
  updateBookVariant,
} from '../../../actions/variant.action';
import { v4 } from 'uuid';

interface VariantFormProps {
  bookPrice: number;
  bookId: string;
  storeId: string;
  variant?: TBookVariant; // If provided, we're editing; if not, we're creating
  onSuccess?: (variant: any) => void;
  onCancel?: () => void;
}

export default function VariantForm({
  bookPrice,
  storeId = 'variants',
  bookId,
  variant,
  onSuccess,
  onCancel,
}: VariantFormProps) {
  const { mutate, isLoading } = useApiMutation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!variant;

  // Initialize form with default values or existing variant data
  const form = useForm<TCreateBookVariant | TUpdateBookVariant>({
    resolver: zodResolver(
      isEditing ? ZUpdateBookVariant : ZCreateBookVariant,
    ) as any,
    defaultValues: variant
      ? {
        name: variant.name,
        bookId: variant.bookId,
        price: variant.price,
        quantity: variant.quantity,
        status: variant.status,
        specifications: variant.specifications || [],
      }
      : ({
        name: '',
        bookId,
        price: bookPrice,
        quantity: 0,
        status: 'active' as any,
        specifications: [],
      } as any),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'specifications',
  });

  console.log(form.formState.errors);

  // Update form when variant prop changes
  useEffect(() => {
    if (variant) {
      form.reset({
        name: variant.name,
        bookId: variant.bookId,
        price: variant.price,
        quantity: variant.quantity,
        status: variant.status,
        specifications: variant.specifications || [],
      } as any);
    }
  }, [variant, form]);

  const price = form.watch('price');
  const quantity = form.watch('quantity');
  const specifications = form.watch('specifications');

  const handleSubmit = async (
    data: TCreateBookVariant | TUpdateBookVariant,
  ) => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && variant) {
        await mutate(
          async () =>
            updateBookVariant(variant.id, data as TUpdateBookVariant),
          {
            onSuccess: (updatedVariant) => {
              if (onSuccess) onSuccess(updatedVariant);
            },
            onError: (err: any) => {
              setError(err?.message || 'Failed to update variant');
            },
            successMessage: 'Variant updated successfully',
            errorMessage: 'Failed to update variant',
          },
        );
      } else {
        await mutate(
          async () => createBookVariant(data as TCreateBookVariant),
          {
            onSuccess: (newVariant) => {
              if (onSuccess) onSuccess(newVariant);
              form.reset({
                name: '',
                bookId,
                price: bookPrice,
                quantity: 0,
                status: 'active' as any,
                specifications: [],
              } as any);
            },
            onError: (err: any) => {
              setError(err?.message || 'Failed to create variant');
            },
            successMessage: 'Variant created successfully',
            errorMessage: 'Failed to create variant',
          },
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAttribute = () => {
    append({
      id: v4(),
      name: '',
      value: '',
    } as any);
  };

  const removeAttribute = (index: number) => {
    remove(index);
  };

  return (
    <Form {...form} >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-6 py-4'
        autoComplete='off'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. Large, Nike, Pro'
                  {...field}
                  className='w-full'
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? null : val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>
                Price
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='ml-2 px-2 py-0 h-6 text-xs'
                  onClick={() => form.setValue('price', bookPrice)}
                  tabIndex={-1}
                >
                  Use Book Price (${bookPrice})
                </Button>
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
                    $
                  </span>
                  <Input
                    type='number'
                    step='0.01'
                    min={0}
                    placeholder='0.00'
                    className='pl-8'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='quantity'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Quantity</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min={0}
                  placeholder='0'
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === '' ? null : Number(val));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant Image (Optional)</FormLabel>
              <FormControl>
                <SingleFileUploader
                  storeId={storeId}
                  onUploaded={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specifications Section */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <FormLabel>Variant Specifications</FormLabel>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addAttribute}
              className='flex items-center gap-2'
            >
              <Plus className='h-4 w-4' />
              Add Specification
            </Button>
          </div>

          {fields.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              <Package className='h-8 w-8 mx-auto mb-2' />
              <p>No specifications added yet</p>
              <p className='text-sm'>
                Add specifications like color, size, brand, or model
              </p>
            </div>
          )}
          <div className='px-2 space-y-2'>
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className='rounded-lg p-4 space-y-4 border-1 border-primary mb-2'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='font-medium'>Specification {index + 1}</h4>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeAttribute(index)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='w-full flex items-center gap-2'>
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.name`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='e.g. Brand, Size, Model'
                              {...field}
                              className='w-full'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.value`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='e.g. Nike, Pro, Red'
                              {...field}
                              className='w-full'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary */}
        {(price && price > 0) ||
          (quantity && quantity > 0) ||
          (specifications && specifications.length > 0) ? (
          <div className='bg-muted/50 p-4 rounded-lg space-y-2'>
            <h4 className='font-medium text-sm'>Variant Summary</h4>
            <div className='flex flex-wrap gap-2 text-sm'>
              {price && price > 0 && <Badge variant='outline'>${price}</Badge>}
              {quantity && quantity > 0 && (
                <Badge variant='outline'>{quantity} in stock</Badge>
              )}
              {specifications &&
                specifications.map((specification, index) => (
                  <Badge key={index} variant='secondary'>
                    {specification.name}: {specification.value}
                  </Badge>
                ))}
            </div>
          </div>
        ) : null}

        <div className='flex gap-2 justify-end'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isLoading || isSubmitting}>
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update Variant'
            ) : (
              'Create Variant'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CreateVariantDialog({
  bookId,
  storeId,
  bookPrice,
  className,
}: {
  bookId: string;
  storeId: string;
  bookPrice: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => setOpen(isOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn(className)}>
          <Plus className='h-4 w-4 mr-2' />
          Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Create Book Variant</DialogTitle>
          <DialogDescription>
            Add a new variant for this book. Specify specifications, price,
            and inventory.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[calc(100vh-10rem)]'>
          <div className='px-2 space-y-2'>
            <VariantForm
              storeId={storeId}
              bookId={bookId}
              bookPrice={bookPrice}
              onCancel={() => setOpen(false)}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function EditVariantDialog({
  variant,
  storeId,
  bookPrice,
  bookId,
  onSuccess,
  onCancel,
}: {
  variant: TBookVariant;
  storeId: string;
  bookPrice: number;
  bookId: string;
  onSuccess?: (variant: any) => void;
  onCancel?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => setOpen(isOpen);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn()}>
          <Plus className='h-4 w-4 mr-2' />
          Edit Variant
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Edit Book Variant</DialogTitle>
          <DialogDescription>
            Update the details for this book variant.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[calc(100vh-10rem)]'>
          <div className='px-3 space-y-2'>
            <VariantForm
              storeId={storeId}
              bookId={bookId}
              bookPrice={bookPrice}
              variant={variant}
              onCancel={() => {
                setOpen(false);
                if (onCancel) onCancel();
              }}
              onSuccess={(updatedVariant) => {
                setOpen(false);
                if (onSuccess) onSuccess(updatedVariant);
              }}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
