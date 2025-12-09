'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TCategoryBasic,
  TCreatePublication,
  ZCreatePublication,
  EPublicationStatus,
} from '@repo/common';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createPublication } from '@/actions/publication.action';
import { uploadFile } from '@/lib/file-upload';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';

interface CreatePublicationFormProps {
  categories?: TCategoryBasic[];
}

export default function CreatePublicationForm({
  categories = [],
}: CreatePublicationFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TCreatePublication>({
    // @ts-ignore - Complex Zod schema causes deep type instantiation
    resolver: zodResolver(ZCreatePublication) as any,
    defaultValues: {
      title: '',
      titleAm: undefined,
      titleOr: undefined,
      slug: '',
      excerpt: undefined,
      excerptAm: undefined,
      excerptOr: undefined,
      content: undefined,
      contentAm: undefined,
      contentOr: undefined,
      media: [],
      tags: [],
      status: EPublicationStatus.draft,
      featured: false,
      isPremium: false,
      allowComments: true,
      featuredImage: undefined,
      publishedAt: undefined,
      expiresAt: undefined,
    },
  });

  // Auto-generate slug from title
  const title = form.watch('title');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (title && !isSlugManuallyEdited) {
      const generatedSlug = slugify(title);
      form.setValue('slug', generatedSlug);
    }
  }, [title, form, isSlugManuallyEdited]);

  // Track if user manually edits the slug
  const handleSlugChange = (value: string) => {
    setIsSlugManuallyEdited(true);
    form.setValue('slug', value);
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTagsArr = [...tags, trimmed];
      setTags(newTagsArr);
      form.setValue('tags', newTagsArr);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const filtered = tags.filter((tag) => tag !== tagToRemove);
    setTags(filtered);
    form.setValue('tags', filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setFeaturedImage(url);
      form.setValue('featuredImage', url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutate(async () => await createPublication(data), {
              onSuccess: (created) => {
                if (created && 'id' in created) {
                  router.push(`/admin/publications/${created.id}`);
                }
              },
              successMessage: 'Publication created successfully',
              errorMessage: 'Failed to create publication',
            });
          })}
          className='space-y-6'
        >
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
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter publication title' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter URL slug'
                        {...field}
                        onChange={(e) => handleSlugChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='titleAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Amharic title (optional)'
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='titleOr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oromo Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Oromo title (optional)'
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='excerpt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description'
                        rows={3}
                        {...field}
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='excerptAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description in Amharic (optional)'
                        rows={3}
                        {...field}
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='excerptOr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oromo Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description in Oromo (optional)'
                        rows={3}
                        {...field}
                        value={typeof field.value === 'string' ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={typeof field.value === 'string' ? field.value || '' : typeof field.value === 'object' ? JSON.stringify(field.value) : ''}
                        onChange={(value) => field.onChange(value || undefined)}
                        placeholder='Start writing your publication...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contentAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={typeof field.value === 'string' ? field.value || '' : typeof field.value === 'object' ? JSON.stringify(field.value) : ''}
                        onChange={(value) => field.onChange(value || undefined)}
                        placeholder='Start writing in Amharic (optional)...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contentOr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oromo Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={typeof field.value === 'string' ? field.value || '' : typeof field.value === 'object' ? JSON.stringify(field.value) : ''}
                        onChange={(value) => field.onChange(value || undefined)}
                        placeholder='Start writing in Oromo (optional)...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {categories.length > 0 && (
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a category' />
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
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as EPublicationStatus)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EPublicationStatus.draft}>Draft</SelectItem>
                        <SelectItem value={EPublicationStatus.published}>
                          Published
                        </SelectItem>
                        <SelectItem value={EPublicationStatus.scheduled}>
                          Scheduled
                        </SelectItem>
                        <SelectItem value={EPublicationStatus.archived}>
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='publishedAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published At</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? new Date(e.target.value) : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Schedule publication date (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='expiresAt'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires At</FormLabel>
                      <FormControl>
                        <Input
                          type='datetime-local'
                          value={
                            field.value
                              ? new Date(field.value).toISOString().slice(0, 16)
                              : ''
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? new Date(e.target.value) : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Publication expiration date (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='flex items-center gap-4'>
                <FormField
                  control={form.control}
                  name='featured'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Featured</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isPremium'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Premium</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='allowComments'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-2'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Allow Comments</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='featuredImage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        {featuredImage && (
                          <div className='relative w-32 h-32'>
                            <img
                              src={featuredImage}
                              alt='Featured'
                              className='w-full h-full object-cover rounded'
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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
                  onKeyDown={handleKeyPress}
                />
                <Button type='button' onClick={addTag}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='gap-1'>
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='ml-1 hover:text-destructive'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => router.back()}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Publication'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


