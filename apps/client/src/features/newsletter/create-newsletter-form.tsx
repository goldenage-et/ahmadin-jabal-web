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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TCreateNewsletter,
  ZCreateNewsletter,
  ENewsletterStatus,
} from '@repo/common';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createNewsletter } from '@/actions/newsletter.action';

export default function CreateNewsletterForm() {
  const router = useRouter();
  const { mutate, isLoading } = useApiMutation();

  const form = useForm<TCreateNewsletter>({
    resolver: zodResolver(ZCreateNewsletter) as any,
    defaultValues: {
      subject: '',
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      status: ENewsletterStatus.draft,
      scheduledAt: undefined,
    },
  });

  return (
    <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutate(async () => await createNewsletter(data), {
              onSuccess: (created) => {
                if (created && 'id' in created) {
                  router.push(`/admin/newsletter/${created.id}`);
                }
              },
              successMessage: 'Newsletter created successfully',
              errorMessage: 'Failed to create newsletter',
            });
          })}
          className='space-y-6'
        >
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <FormControl>
                      <Input placeholder='Newsletter subject' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder='Newsletter title' {...field} />
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
                        placeholder='English title (optional)'
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
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={typeof field.value === 'string' ? field.value || '' : ''}
                        onChange={field.onChange}
                        placeholder='Start writing your newsletter...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as ENewsletterStatus)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ENewsletterStatus.draft}>Draft</SelectItem>
                        <SelectItem value={ENewsletterStatus.sent}>Sent</SelectItem>
                        <SelectItem value={ENewsletterStatus.scheduled}>
                          Scheduled
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
              {isLoading ? 'Creating...' : 'Create Newsletter'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


