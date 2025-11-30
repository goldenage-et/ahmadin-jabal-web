'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TNewsletterDetail, ENewsletterStatus } from '@repo/common';
import {
  Edit,
  Trash2,
  Mail,
  Calendar,
  ArrowLeft,
  Users,
  Eye,
  MousePointerClick,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteNewsletter } from '@/actions/newsletter.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';

interface NewsletterDetailProps {
  newsletter: TNewsletterDetail;
}

export default function NewsletterDetail({
  newsletter,
}: NewsletterDetailProps) {
  const router = useRouter();
  const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();

  const getStatusBadge = (status: ENewsletterStatus) => {
    switch (status) {
      case ENewsletterStatus.sent:
        return (
          <Badge variant='default' className='bg-green-500'>
            Sent
          </Badge>
        );
      case ENewsletterStatus.draft:
        return (
          <Badge variant='secondary' className='bg-gray-500'>
            Draft
          </Badge>
        );
      case ENewsletterStatus.scheduled:
        return (
          <Badge variant='default' className='bg-blue-500'>
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const handleDelete = () => {
    deleteMutate(async () => await deleteNewsletter(newsletter.id), {
      onSuccess: () => {
        router.push('/admin/newsletter');
        toast.success('Newsletter deleted successfully');
      },
      errorMessage: 'Failed to delete newsletter',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/newsletter'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Newsletters
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/newsletter/${newsletter.id}/edit`}>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm' disabled={isDeleting}>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  newsletter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                {getStatusBadge(newsletter.status)}
              </div>
              <CardTitle className='text-3xl'>{newsletter.title}</CardTitle>
              <p className='text-muted-foreground mt-2'>{newsletter.subject}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {newsletter.content && (
            <div>
              <h3 className='font-semibold mb-2'>Content</h3>
              <div
                className='prose dark:prose-invert max-w-none'
                dangerouslySetInnerHTML={{
                  __html:
                    typeof newsletter.content === 'string'
                      ? newsletter.content
                      : JSON.stringify(newsletter.content),
                }}
              />
            </div>
          )}

          <Separator />

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Recipients</p>
                <p className='font-semibold'>
                  {newsletter.recipientCount || 0}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Eye className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Opened</p>
                <p className='font-semibold'>{newsletter.openedCount || 0}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <MousePointerClick className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Clicked</p>
                <p className='font-semibold'>{newsletter.clickedCount || 0}</p>
              </div>
            </div>
            {newsletter.sentAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Sent</p>
                  <p className='font-semibold text-xs'>
                    {format(new Date(newsletter.sentAt), 'PPp')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


