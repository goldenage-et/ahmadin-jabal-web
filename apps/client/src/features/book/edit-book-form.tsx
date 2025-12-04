'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EBookStatus,
  TCategoryBasic,
  TBookDetail,
  TBookImage,
  TUpdateBook,
  ZUpdateBook,
  generateCode,
} from '@repo/common';
import { ArrowLeft, Plus, Save, X, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateBook } from '@/actions/book.action';
import { slugify } from '@/lib/slugify';
import ImageManager from './image-manager';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function EditBookForm({
  book,
  categories,
  onCancel,
}: {
  book: TBookDetail;
  categories: TCategoryBasic[];
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [images, setImages] = useState<TBookImage[]>(book.images || []);
  const [tags, setTags] = useState<string[]>(book.tags || []);
  const [newTag, setNewTag] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    title: false,
    description: false,
    author: false,
    publisher: false,
  });
  const { mutate, isLoading } = useApiMutation();

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const form = useForm<TUpdateBook>({
    resolver: zodResolver(ZUpdateBook) as any,
    defaultValues: {
      title: book.title || undefined,
      titleAm: book.titleAm || undefined,
      titleOr: book.titleOr || undefined,
      description: book.description || undefined,
      descriptionAm: book.descriptionAm || undefined,
      descriptionOr: book.descriptionOr || undefined,
      price: book.price || undefined,
      purchasePrice: book.purchasePrice || undefined,
      categoryId: book.categoryId || undefined,
      subcategoryId: book.subcategoryId || undefined,
      inventoryQuantity: book.inventoryQuantity || undefined,
      inventoryLowStockThreshold: book.inventoryLowStockThreshold || undefined,
      publisher: book.publisher || undefined,
      publisherAm: book.publisherAm || undefined,
      publisherOr: book.publisherOr || undefined,
      isbn: book.isbn || undefined,
      author: book.author || undefined,
      authorAm: book.authorAm || undefined,
      authorOr: book.authorOr || undefined,
      sku: book.sku || undefined,
      barcode: book.barcode || undefined,
      status: book.status || undefined,
      featured: book.featured || undefined,
      tags: book.tags || undefined,
      images: book.images || undefined,
    } as TUpdateBook,
  });

  // Auto-generate slug from title when title changes
  const title = form.watch('title');
  useEffect(() => {
    if (title) {
      const generatedSlug = slugify(title);
      form.setValue('slug', generatedSlug);
    }
  }, [title, form]);

  const onSubmit = (data: TUpdateBook) => {
    // Include alternate language fields even if not in TUpdateBook type
    const formValues = form.getValues() as any;
    const updateData = {
      ...data,
      titleAm: formValues.titleAm,
      titleOr: formValues.titleOr,
      descriptionAm: formValues.descriptionAm,
      descriptionOr: formValues.descriptionOr,
    } as any;

    mutate(async () => updateBook(book.id, updateData), {
      onSuccess: (data) => {
        router.push(`/admin/books/${data.id}`);
      },
      onError: (error) => {
        console.log(error);
      },
      successMessage: 'Book updated successfully',
      errorMessage: 'Failed to update book',
    });
  };

  // Initialize tags and images from book data
  useEffect(() => {
    if (book.tags && book.tags.length > 0) {
      setTags(book.tags);
    }
    if (book.images && book.images.length > 0) {
      setImages(book.images);
    }
  }, [book]);

  const handleImagesChange = (newImages: TBookImage[]) => {
    setImages(newImages);
    form.setValue('images', newImages);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const categoryId = form.watch('categoryId');
  const subcategories = categories.filter(
    (category) => category.parentId === categoryId,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Left Sidebar - Additional Fields */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Tags */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base font-semibold'>Tags</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Add tag'
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className='text-sm'
                  />
                  <Button
                    type='button'
                    onClick={addTag}
                    size='icon'
                    variant='outline'
                    disabled={!newTag.trim()}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='flex items-center gap-1 text-xs'
                      >
                        {tag}
                        <X
                          className='h-3 w-3 cursor-pointer hover:text-destructive'
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base font-semibold'>
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='sku'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>SKU</FormLabel>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1'>
                          <FormControl>
                            <Input
                              placeholder='SKU'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm'
                            />
                          </FormControl>
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => form.setValue('sku', generateCode('SKU'))}
                          title='Auto-generate SKU'
                          className='shrink-0'
                        >
                          <RefreshCcw className='h-4 w-4' />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='barcode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>Barcode</FormLabel>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1'>
                          <FormControl>
                            <Input
                              placeholder='Barcode'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm'
                            />
                          </FormControl>
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => form.setValue('barcode', generateCode('BRC'))}
                          title='Auto-generate Barcode'
                          className='shrink-0'
                        >
                          <RefreshCcw className='h-4 w-4' />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Main - Required and Useful Fields */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Basic Information */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg font-semibold'>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Title with collapsible alternate languages */}
                <Collapsible
                  open={openSections.title}
                  onOpenChange={() => toggleSection('title')}
                >
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center gap-2'>
                          <CollapsibleTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-5 w-5 -ml-1'
                            >
                              {openSections.title ? (
                                <ChevronUp className='h-4 w-4' />
                              ) : (
                                <ChevronDown className='h-4 w-4' />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <FormLabel>Title *</FormLabel>
                        </div>
                        <FormControl>
                          <Input placeholder='Enter book title' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                    <FormField
                      control={form.control}
                      name={'titleAm' as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm text-muted-foreground'>
                            Title (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter title in Amharic'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'titleOr' as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm text-muted-foreground'>
                            Title (Oromo)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter title in Oromo'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                {/* Description with collapsible alternate languages */}
                <Collapsible
                  open={openSections.description}
                  onOpenChange={() => toggleSection('description')}
                >
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center gap-2'>
                          <CollapsibleTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-5 w-5 -ml-1'
                            >
                              {openSections.description ? (
                                <ChevronUp className='h-4 w-4' />
                              ) : (
                                <ChevronDown className='h-4 w-4' />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <FormLabel>Description</FormLabel>
                        </div>
                        <FormControl>
                          <Textarea
                            placeholder='Enter book description'
                            {...field}
                            className='min-h-[120px]'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                    <FormField
                      control={form.control}
                      name={'descriptionAm' as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm text-muted-foreground'>
                            Description (Amharic)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter description in Amharic'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm min-h-[100px]'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={'descriptionOr' as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm text-muted-foreground'>
                            Description (Oromo)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter description in Oromo'
                              {...field}
                              value={field.value as string ?? ''}
                              className='text-sm min-h-[100px]'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('subcategoryId', undefined);
                          }}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
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

                  <FormField
                    control={form.control}
                    name='subcategoryId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                          disabled={!categoryId || subcategories.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select subcategory' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories.map((subcategory) => (
                              <SelectItem
                                key={subcategory.id}
                                value={subcategory.id}
                              >
                                {subcategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* Author with collapsible alternate languages */}
                  <Collapsible
                    open={openSections.author}
                    onOpenChange={() => toggleSection('author')}
                  >
                    <FormField
                      control={form.control}
                      name='author'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex items-center gap-2'>
                            <CollapsibleTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-5 w-5 -ml-1'
                              >
                                {openSections.author ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <FormLabel>Author</FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              placeholder='Enter author name'
                              {...field}
                              value={field.value as string ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                      <FormField
                        control={form.control}
                        name='authorAm'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm text-muted-foreground'>
                              Author (Amharic)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter author in Amharic'
                                {...field}
                                value={field.value ?? ''}
                                className='text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='authorOr'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm text-muted-foreground'>
                              Author (Oromo)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter author in Oromo'
                                {...field}
                                value={field.value ?? ''}
                                className='text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Publisher with collapsible alternate languages */}
                  <Collapsible
                    open={openSections.publisher}
                    onOpenChange={() => toggleSection('publisher')}
                  >
                    <FormField
                      control={form.control}
                      name='publisher'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex items-center gap-2'>
                            <CollapsibleTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-5 w-5 -ml-1'
                              >
                                {openSections.publisher ? (
                                  <ChevronUp className='h-4 w-4' />
                                ) : (
                                  <ChevronDown className='h-4 w-4' />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <FormLabel>Publisher</FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              placeholder='Enter publisher'
                              {...field}
                              value={field.value as string ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                      <FormField
                        control={form.control}
                        name='publisherAm'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm text-muted-foreground'>
                              Publisher (Amharic)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter publisher in Amharic'
                                {...field}
                                value={field.value ?? ''}
                                className='text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='publisherOr'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-sm text-muted-foreground'>
                              Publisher (Oromo)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Enter publisher in Oromo'
                                {...field}
                                value={field.value ?? ''}
                                className='text-sm'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                <FormField
                  control={form.control}
                  name='isbn'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter ISBN' {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg font-semibold'>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            placeholder='0.00'
                            {...field}
                            value={field.value || undefined}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className='text-xs'>
                          Selling price
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='purchasePrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.01'
                            placeholder='0.00'
                            {...field}
                            value={field.value || undefined}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription className='text-xs'>
                          Cost price
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg font-semibold'>Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='inventoryQuantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='0'
                            {...field}
                            value={field.value || undefined}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='inventoryLowStockThreshold'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Threshold</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='10'
                            {...field}
                            value={field.value || undefined}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className='text-xs'>
                          Alert when stock falls below this
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg font-semibold'>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageManager
                  isEditing
                  maxImages={10}
                  maxFileSize={5}
                  images={images}
                  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                  onImagesChange={handleImagesChange}
                />
              </CardContent>
            </Card>

            {/* Status & Settings */}
            <Card>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg font-semibold'>
                  Status & Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(EBookStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='featured'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Featured</FormLabel>
                          <FormDescription className='text-xs'>
                            Show as featured book
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-between pt-4 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Cancel
          </Button>
          <Button type='submit' disabled={isLoading}>
            <Save className='h-4 w-4 mr-2' />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
