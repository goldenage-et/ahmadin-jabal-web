'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  TCategory,
  TCreateCategory,
  TUpdateCategory,
  ZCreateCategory,
  TCategoryImage,
} from '@repo/common';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import CategoryImageManager from '@/features/categories/category-image-manager';
import MediaManager from '../../components/media-manager';
import SingleFileUploader from '../../components/single-file-uploader';
import { IconDropdown } from '@/components/ui/icon-dropdown';
import { ColorPicker } from '@/components/ui/color-picker';

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TCategory;
  categories: TCategory[];
  isSubmitting: boolean;
  onSubmit: (data: TCreateCategory | TUpdateCategory) => void;
};

export function CategoryModal({
  isOpen,
  onClose,
  initialData,
  categories,
  isSubmitting,
  onSubmit,
}: CategoryModalProps) {
  const isEdit = !!initialData;

  const form = useForm<TCreateCategory>({
    resolver: zodResolver(ZCreateCategory),
    defaultValues: {
      name: '',
      description: '',
      image: undefined,
      iconName: undefined,
      backgroundColor: undefined,
      parentId: undefined,
    },
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || '',
        image: initialData.image || undefined,
        iconName: initialData.iconName || undefined,
        backgroundColor: initialData.backgroundColor || undefined,
        parentId: initialData.parentId || undefined,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        image: undefined,
        iconName: undefined,
        backgroundColor: undefined,
        parentId: undefined,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: TCreateCategory) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Filter out the current category from parent options (to prevent self-reference)
  const parentOptions = categories.filter((cat) => cat.id !== initialData?.id);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the category information below.'
              : 'Add a new category to organize your books.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left Column */}
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Electronics, Clothing, Books'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe this category...'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='parentId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category (Optional)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === 'none' ? null : value)
                        }
                        value={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a parent category' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>
                            No parent (Root category)
                          </SelectItem>
                          {parentOptions.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
                <FormField
                  control={form.control}
                  name='image'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Image</FormLabel>
                      <FormControl>
                        <SingleFileUploader
                          storeId={'categories'}
                          onUploaded={field.onChange}
                          existingImage={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='iconName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <FormControl>
                        <IconDropdown
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select an icon...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='backgroundColor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder='Select a background color...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEdit ? (
                  'Update Category'
                ) : (
                  'Create Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
