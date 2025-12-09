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
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateGallery } from '@/actions/media.action';
import { uploadFile } from '@/lib/file-upload';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
      titleAm: gallery.titleAm || null,
      titleOr: gallery.titleOr || null,
      description: gallery.description || null,
      descriptionAm: gallery.descriptionAm || null,
      descriptionOr: gallery.descriptionOr || null,
      slug: gallery.slug,
      category: gallery.category || null,
      featured: gallery.featured,
      status: gallery.status,
      coverImage: gallery.coverImage || null,
      metadata: gallery.metadata || null,
      publishedAt: gallery.publishedAt
        ? new Date(gallery.publishedAt)
        : null,
    },
  });

  useEffect(() => {
    form.reset({
      title: gallery.title,
      titleAm: gallery.titleAm || null,
      titleOr: gallery.titleOr || null,
      description: gallery.description || null,
      descriptionAm: gallery.descriptionAm || null,
      descriptionOr: gallery.descriptionOr || null,
      slug: gallery.slug,
      category: gallery.category || null,
      featured: gallery.featured,
      status: gallery.status,
      coverImage: gallery.coverImage || null,
      metadata: gallery.metadata || null,
      publishedAt: gallery.publishedAt
        ? new Date(gallery.publishedAt)
        : null,
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
                name='titleAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Amharic title (optional)'
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
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
                        onChange={(e) => field.onChange(e.target.value || null)}
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
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='descriptionAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Amharic description (optional)'
                        rows={3}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
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
                    <FormLabel>Oromo Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Oromo description (optional)'
                        rows={3}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
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
                        placeholder='Gallery category (optional)'
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
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

              <FormField
                control={form.control}
                name='publishedAt'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Published Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value || undefined}
                          onSelect={(date) => field.onChange(date || null)}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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
                        <Input
                          placeholder='Or enter cover image URL directly'
                          value={coverImage}
                          onChange={(e) => {
                            setCoverImage(e.target.value);
                            form.setValue('coverImage', e.target.value || null);
                          }}
                        />
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


