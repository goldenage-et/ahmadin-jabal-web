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
  TUpdateAudio,
  ZUpdateAudio,
  EMediaStatus,
  EMediaSource,
  TAudioDetail,
} from '@repo/common';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateAudio } from '@/actions/media.action';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditAudioFormProps {
  audio: TAudioDetail;
}

export default function EditAudioForm({ audio }: EditAudioFormProps) {
  const router = useRouter();
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TUpdateAudio>({
    resolver: zodResolver(ZUpdateAudio) as any,
    defaultValues: {
      title: audio.title,
      titleAm: audio.titleAm || null,
      titleOr: audio.titleOr || null,
      description: audio.description || null,
      descriptionAm: audio.descriptionAm || null,
      descriptionOr: audio.descriptionOr || null,
      category: audio.category || null,
      url: audio.url || undefined,
      thumbnail: audio.thumbnail || null,
      duration: audio.duration || null,
      fileSize: audio.fileSize || null,
      mimeType: audio.mimeType || null,
      source: audio.source || undefined,
      externalId: audio.externalId || null,
      featured: audio.featured,
      status: audio.status,
      isAvailable: audio.isAvailable,
      metadata: audio.metadata || null,
      mediaId: audio.mediaId || null,
      publishedAt: audio.publishedAt
        ? new Date(audio.publishedAt)
        : null,
    },
  });

  useEffect(() => {
    form.reset({
      title: audio.title,
      titleAm: audio.titleAm || null,
      titleOr: audio.titleOr || null,
      description: audio.description || null,
      descriptionAm: audio.descriptionAm || null,
      descriptionOr: audio.descriptionOr || null,
      category: audio.category || null,
      url: audio.url || undefined,
      thumbnail: audio.thumbnail || null,
      duration: audio.duration || null,
      fileSize: audio.fileSize || null,
      mimeType: audio.mimeType || null,
      source: audio.source || undefined,
      externalId: audio.externalId || null,
      featured: audio.featured,
      status: audio.status,
      isAvailable: audio.isAvailable,
      metadata: audio.metadata || null,
      mediaId: audio.mediaId || null,
      publishedAt: audio.publishedAt
        ? new Date(audio.publishedAt)
        : null,
    });
  }, [audio, form]);

  return (
    <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutate(async () => await updateAudio(audio.id, data), {
              onSuccess: () => {
                router.push(`/admin/media/audios/${audio.id}`);
              },
              successMessage: 'Audio updated successfully',
              errorMessage: 'Failed to update audio',
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
                      <Input placeholder='Enter audio title' {...field} />
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description of the audio'
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
                        placeholder='Audio category (optional)'
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
                name='url'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audio URL *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com/audio.mp3'
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
                name='duration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='e.g., 1530 for 25:30'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
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
                    <FormLabel>Featured Audio</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isAvailable'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Available</FormLabel>
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
              {isLoading ? 'Updating...' : 'Update Audio'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
