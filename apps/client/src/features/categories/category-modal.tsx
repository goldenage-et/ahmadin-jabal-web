'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  TCategory,
  TCreateCategory,
  TUpdateCategory,
  ZCreateCategory,
  ZUpdateCategory,
} from '@repo/common';
import { slugify } from '@/lib/slugify';
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
import SingleFileUploader from '../../components/single-file-uploader';
import { IconDropdown } from '@/components/ui/icon-dropdown';
import { ColorPicker } from '@/components/ui/color-picker';
import { Switch } from '@/components/ui/switch';
import { FormDescription } from '@/components/ui/form';

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

  const form = useForm<TCreateCategory | TUpdateCategory>({
    resolver: zodResolver(isEdit ? ZUpdateCategory : ZCreateCategory) as any,
    defaultValues: {
      name: '',
      nameAm: null,
      nameOr: null,
      description: '',
      descriptionAm: null,
      descriptionOr: null,
      image: undefined,
      iconName: undefined,
      backgroundColor: undefined,
      parentId: undefined,
      active: true,
    },
  });

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        nameAm: initialData.nameAm || null,
        nameOr: initialData.nameOr || null,
        description: initialData.description || '',
        descriptionAm: initialData.descriptionAm || null,
        descriptionOr: initialData.descriptionOr || null,
        image: initialData.image || undefined,
        iconName: initialData.iconName || undefined,
        backgroundColor: initialData.backgroundColor || undefined,
        parentId: initialData.parentId || undefined,
        active: initialData.active ?? true,
      });
    } else {
      form.reset({
        name: '',
        nameAm: null,
        nameOr: null,
        description: '',
        descriptionAm: null,
        descriptionOr: null,
        image: undefined,
        iconName: undefined,
        backgroundColor: undefined,
        parentId: undefined,
        active: true,
      });
    }
  }, [initialData, form]);

  // Auto-generate slug from name
  const name = form.watch('name');
  useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name);
      form.setValue('slug', generatedSlug);
    }
  }, [name, form]);

  const handleSubmit = (data: TCreateCategory | TUpdateCategory) => {
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
                      <FormLabel>Category Name (English) *</FormLabel>
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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='nameAm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name (Amharic)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Category name in Amharic'
                            {...field}
                            value={field.value as string ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='nameOr'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name (Oromo)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Category name in Oromo'
                            {...field}
                            value={field.value as string ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (English)</FormLabel>
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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='descriptionAm'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Amharic)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe this category in Amharic...'
                            className='min-h-[100px]'
                            {...field}
                            value={field.value as string ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='descriptionOr'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Oromo)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe this category in Oromo...'
                            className='min-h-[100px]'
                            {...field}
                            value={field.value as string ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <FormField
                  control={form.control}
                  name='active'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Active</FormLabel>
                        <FormDescription>
                          Enable or disable this category
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
