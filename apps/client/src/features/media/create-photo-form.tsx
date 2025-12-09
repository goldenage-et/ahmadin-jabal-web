'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
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
  TCreatePhoto,
  ZCreatePhoto,
  EMediaStatus,
  EMediaSource,
} from '@repo/common';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPhoto } from '@/actions/media.action';
import { uploadFile } from '@/lib/file-upload';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function CreatePhotoForm() {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TCreatePhoto>({
    resolver: zodResolver(ZCreatePhoto) as any,
    defaultValues: {
      title: null,
      titleAm: null,
      titleOr: null,
      descriptionAm: null,
      descriptionOr: null,
      caption: null,
      captionAm: null,
      captionOr: null,
      alt: null,
      category: null,
      url: '',
      thumbnail: null,
      fileSize: null,
      mimeType: null,
      width: null,
      height: null,
      source: EMediaSource.upload,
      externalId: null,
      featured: false,
      status: EMediaStatus.draft,
      metadata: null,
      mediaId: null,
      publishedAt: null,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
      form.setValue('url', url);
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
            mutate(async () => await createPhoto(data), {
              onSuccess: (created) => {
                if (created && 'id' in created) {
                  router.push(`/admin/media/photo-gallery/photos/${created.id}`);
                }
              },
              successMessage: 'Photo created successfully',
              errorMessage: 'Failed to create photo',
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter photo title (optional)'
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
                name='caption'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter photo caption (optional)'
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
                name='captionAm'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amharic Caption</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Amharic caption (optional)'
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
                name='captionOr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oromo Caption</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Oromo caption (optional)'
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
                name='alt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Alt text for accessibility (optional)'
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
                        placeholder='Photo category (optional)'
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
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL *</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        <Input
                          type='file'
                          accept='image/*'
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                        <Input
                          placeholder='Or enter URL directly'
                          {...field}
                          value={field.value || ''}
                        />
                        {photoUrl && (
                          <div className='relative w-32 h-32'>
                            <img
                              src={photoUrl}
                              alt='Photo'
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

              <FormField
                control={form.control}
                name='thumbnail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com/thumbnail.jpg'
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
                name='source'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as EMediaSource)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EMediaSource.upload}>Upload</SelectItem>
                        <SelectItem value={EMediaSource.youtube}>YouTube</SelectItem>
                        <SelectItem value={EMediaSource.external}>
                          External
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value={EMediaStatus.published}>
                          Published
                        </SelectItem>
                        <SelectItem value={EMediaStatus.scheduled}>
                          Scheduled
                        </SelectItem>
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
                    <FormLabel>Featured Photo</FormLabel>
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
              {isLoading ? 'Creating...' : 'Create Photo'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
