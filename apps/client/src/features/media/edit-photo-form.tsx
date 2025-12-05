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
  TUpdatePhoto,
  ZUpdatePhoto,
  EMediaStatus,
  TPhotoDetail,
} from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updatePhoto } from '@/actions/media.action';
import { uploadFile } from '@/lib/file-upload';
import { toast } from 'sonner';

interface EditPhotoFormProps {
  photo: TPhotoDetail;
}

export default function EditPhotoForm({ photo }: EditPhotoFormProps) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string>(photo.url || '');
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TUpdatePhoto>({
    resolver: zodResolver(ZUpdatePhoto) as any,
    defaultValues: {
      caption: photo.caption || undefined,
      description: photo.description || undefined,
      url: photo.url || undefined,
      featured: photo.featured,
      status: photo.status,
      publishedAt: photo.publishedAt
        ? new Date(photo.publishedAt)
        : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      caption: photo.caption || undefined,
      description: photo.description || undefined,
      url: photo.url || undefined,
      featured: photo.featured,
      status: photo.status,
      publishedAt: photo.publishedAt
        ? new Date(photo.publishedAt)
        : undefined,
    });
    setPhotoUrl(photo.url || '');
  }, [photo, form]);

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
            mutate(async () => await updatePhoto(photo.id, data), {
              onSuccess: () => {
                router.push(`/admin/media/photo-gallery/photos/${photo.id}`);
              },
              successMessage: 'Photo updated successfully',
              errorMessage: 'Failed to update photo',
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
                name='caption'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caption</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter photo caption'
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
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Brief description of the photo'
                        rows={4}
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
              {isLoading ? 'Updating...' : 'Update Photo'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

