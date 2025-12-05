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
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TUpdateGallery,
  ZUpdateGallery,
  EMediaStatus,
  TGalleryDetail,
} from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateGallery } from '@/actions/media.action';
import { uploadFile } from '@/lib/file-upload';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';

interface EditGalleryFormProps {
  gallery: TGalleryDetail;
}

export default function EditGalleryForm({ gallery }: EditGalleryFormProps) {
  const router = useRouter();
  const [coverImage, setCoverImage] = useState<string>(
    gallery.coverImage || '',
  );
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TUpdateGallery>({
    resolver: zodResolver(ZUpdateGallery) as any,
    defaultValues: {
      title: gallery.title,
      titleEn: gallery.titleEn || undefined,
      description: gallery.description || undefined,
      slug: gallery.slug,
      category: gallery.category || undefined,
      featured: gallery.featured,
      status: gallery.status,
      coverImage: gallery.coverImage || undefined,
      metadata: gallery.metadata || undefined,
      publishedAt: gallery.publishedAt
        ? new Date(gallery.publishedAt)
        : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      title: gallery.title,
      titleEn: gallery.titleEn || undefined,
      description: gallery.description || undefined,
      slug: gallery.slug,
      category: gallery.category || undefined,
      featured: gallery.featured,
      status: gallery.status,
      coverImage: gallery.coverImage || undefined,
      metadata: gallery.metadata || undefined,
      publishedAt: gallery.publishedAt
        ? new Date(gallery.publishedAt)
        : undefined,
    });
    setCoverImage(gallery.coverImage || '');
  }, [gallery, form]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setCoverImage(url);
      form.setValue('coverImage', url);
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
            mutate(async () => await updateGallery(gallery.id, data), {
              onSuccess: () => {
                router.push(`/admin/media/photo-gallery/galleries/${gallery.id}`);
              },
              successMessage: 'Gallery updated successfully',
              errorMessage: 'Failed to update gallery',
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
                      <Input placeholder='Enter gallery title' {...field} />
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
                      <Input
                        placeholder='gallery-slug'
                        {...field}
                        onChange={(e) => {
                          handleSlugChange(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title (auto-generated from title)
                    </FormDescription>
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
                        placeholder='Brief description of the gallery'
                        rows={4}
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
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Gallery category'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        field.onChange(value as EMediaStatus)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EMediaStatus.draft}>Draft</SelectItem>
                        <SelectItem value={EMediaStatus.published}>Published</SelectItem>
                        <SelectItem value={EMediaStatus.scheduled}>Scheduled</SelectItem>
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
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Featured Gallery</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='coverImage'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        {coverImage && (
                          <div className='relative w-32 h-32'>
                            <img
                              src={coverImage}
                              alt='Cover'
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
              {isLoading ? 'Updating...' : 'Update Gallery'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


