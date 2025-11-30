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
  TUpdatePublication,
  ZUpdatePublication,
  EPublicationStatus,
  TPublicationDetail,
} from '@repo/common';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updatePublication } from '@/actions/publication.action';
import { uploadFile } from '@/lib/file-upload';
import { toast } from 'sonner';

interface EditPublicationFormProps {
  publication: TPublicationDetail;
  categories?: TCategoryBasic[];
}

export default function EditPublicationForm({
  publication,
  categories = [],
}: EditPublicationFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(publication.tags || []);
  const [newTag, setNewTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>(
    publication.featuredImage || '',
  );
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TUpdatePublication>({
    resolver: zodResolver(ZUpdatePublication) as any,
    defaultValues: {
      title: publication.title,
      titleEn: publication.titleEn || undefined,
      slug: publication.slug,
      excerpt: publication.excerpt || undefined,
      content: publication.content || undefined,
      tags: publication.tags || [],
      status: publication.status,
      featured: publication.featured,
      isPremium: publication.isPremium,
      allowComments: publication.allowComments,
      featuredImage: publication.featuredImage || undefined,
      publishedAt: publication.publishedAt
        ? new Date(publication.publishedAt)
        : undefined,
      expiresAt: publication.expiresAt
        ? new Date(publication.expiresAt)
        : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      title: publication.title,
      titleEn: publication.titleEn || undefined,
      slug: publication.slug,
      excerpt: publication.excerpt || undefined,
      content: publication.content || undefined,
      tags: publication.tags || [],
      status: publication.status,
      featured: publication.featured,
      isPremium: publication.isPremium,
      allowComments: publication.allowComments,
      featuredImage: publication.featuredImage || undefined,
      publishedAt: publication.publishedAt
        ? new Date(publication.publishedAt)
        : undefined,
      expiresAt: publication.expiresAt
        ? new Date(publication.expiresAt)
        : undefined,
    });
    setTags(publication.tags || []);
    setFeaturedImage(publication.featuredImage || '');
  }, [publication, form]);

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
    <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutate(async () => await updatePublication(publication.id, data), {
              onSuccess: () => {
                router.push(`/admin/publications/${publication.id}`);
              },
              successMessage: 'Publication updated successfully',
              errorMessage: 'Failed to update publication',
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
                name='titleEn'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter English title (optional)'
                        {...field}
                        value={field.value || ''}
                      />
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
                      <Input placeholder='publication-slug' {...field} />
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
                        content={typeof field.value === 'string' ? field.value || '' : ''}
                        onChange={field.onChange}
                        placeholder='Start writing your publication...'
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
                        <SelectItem value={EPublicationStatus.archived}>
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              {isLoading ? 'Updating...' : 'Update Publication'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


