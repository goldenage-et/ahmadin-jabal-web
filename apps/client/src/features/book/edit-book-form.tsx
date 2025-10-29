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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@repo/common';
import {
  ArrowLeft,
  DollarSign,
  Eye,
  Image as ImageIcon,
  Package,
  Plus,
  Save,
  Settings,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateBook } from '../actions/book.action';
import ImageManager from './image-manager';
import { Separator } from '@/components/ui/separator';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<TBookImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TUpdateBook>({
    resolver: zodResolver(ZUpdateBook) as any,
    defaultValues: {
      title: book.title || undefined,
      description: book.description || undefined,
      price: book.price || undefined,
      purchasePrice: book.purchasePrice || undefined,
      categoryId: book.categoryId || undefined,
      inventoryQuantity: book.inventoryQuantity || undefined,
      inventoryLowStockThreshold: book.inventoryLowStockThreshold || undefined,
      tags: book.tags || undefined,
      images: book.images || undefined,
    } as TUpdateBook,
  });

  const onSubmit = (data: TUpdateBook) => {
    mutate(async () => updateBook(book.id, data), {
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

  const steps = [
    { id: 1, title: 'Basic Info', icon: Package },
    { id: 2, title: 'Pricing', icon: DollarSign },
    { id: 3, title: 'Inventory', icon: Truck },
    { id: 4, title: 'Media', icon: ImageIcon },
    { id: 5, title: 'SEO & Tags', icon: Tag },
  ];

  console.log(form.formState.errors);
  const categoryId = form.watch('categoryId');
  const subcategories = categories.filter(
    (category) => category.parentId === categoryId,
  );

  return (
    <div className='space-y-6 w-full'>
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className='flex items-center'>
                  <Button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-md ${isActive
                      ? ''
                      : isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    <Icon className='h-4 w-4' />
                    <span className='text-sm font-medium'>{step.title}</span>
                  </Button>
                  <Separator orientation='horizontal' className='h-4' />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Tabs
            value={currentStep.toString()}
            onValueChange={(value) => setCurrentStep(parseInt(value))}
          >
            {/* Step 1: Basic Info */}
            <TabsContent value='1' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title *</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter book title' {...field} />
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
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='categoryId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
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
                          <FormLabel>Subcategory *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || undefined}
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Pricing */}
            <TabsContent value='2' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>


                    <FormField
                      control={form.control}
                      name='purchasePrice'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price *</FormLabel>
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
                          <FormDescription>
                            The price you paid for the book
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          <FormDescription>
                            The price you sell the book for
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Inventory */}
            <TabsContent value='3' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
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
                          <FormDescription>
                            Alert when stock falls below this number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 4: Media */}
            <TabsContent value='4' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Book Images</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <ImageManager
                    isEditing
                    maxImages={10}
                    maxFileSize={5}
                    images={form.watch('images') || []}
                    acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                    onImagesChange={handleImagesChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 5: SEO & Tags */}
            <TabsContent value='5' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Add a tag'
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button type='button' onClick={addTag}>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {tag}
                          <X
                            className='h-3 w-3 cursor-pointer'
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button type='button' variant='outline' onClick={onCancel}>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Cancel
              </Button>
              <Button type='button' variant='outline'>
                <Eye className='h-4 w-4 mr-2' />
                Preview
              </Button>
            </div>
            <div className='flex gap-2'>
              {currentStep < steps.length && (
                <Button
                  type='button'
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length, currentStep + 1))
                  }
                >
                  Next
                </Button>
              )}
              <Button type='submit' disabled={isLoading}>
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
