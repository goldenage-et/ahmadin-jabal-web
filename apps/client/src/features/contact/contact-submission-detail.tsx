'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TContactSubmissionDetail, EContactSubmissionStatus } from '@repo/common';
import {
  Mail,
  MessageSquare,
  Calendar,
  User,
  ArrowLeft,
  Reply,
  Trash2,
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
import { deleteContactSubmission, replyToContactSubmission } from '@/actions/contact.action';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { toast } from 'sonner';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ContactSubmissionDetailProps {
  submission: TContactSubmissionDetail;
}

export default function ContactSubmissionDetail({
  submission,
}: ContactSubmissionDetailProps) {
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { mutate: deleteMutate, isLoading: isDeleting } = useApiMutation();
  const { mutate: replyMutate, isLoading: isReplying } = useApiMutation();

  const getStatusBadge = (status: EContactSubmissionStatus) => {
    switch (status) {
      case EContactSubmissionStatus.new:
        return (
          <Badge variant='default' className='bg-blue-500'>
            New
          </Badge>
        );
      case EContactSubmissionStatus.read:
        return (
          <Badge variant='secondary' className='bg-gray-500'>
            Read
          </Badge>
        );
      case EContactSubmissionStatus.replied:
        return (
          <Badge variant='default' className='bg-green-500'>
            Replied
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const handleDelete = () => {
    deleteMutate(async () => await deleteContactSubmission(submission.id), {
      onSuccess: () => {
        router.push('/admin/contact');
        toast.success('Submission deleted successfully');
      },
      errorMessage: 'Failed to delete submission',
    });
  };

  const handleReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    replyMutate(
      async () => await replyToContactSubmission(submission.id, replyMessage),
      {
        onSuccess: () => {
          toast.success('Reply sent successfully');
          setReplyMessage('');
          setShowReplyForm(false);
          router.refresh();
        },
        errorMessage: 'Failed to send reply',
      },
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/admin/contact'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Contact
          </Link>
        </Button>
        <div className='flex items-center gap-2'>
          {submission.status !== EContactSubmissionStatus.replied && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className='h-4 w-4 mr-2' />
              Reply
            </Button>
          )}
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
                  contact submission.
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
                {getStatusBadge(submission.status)}
              </div>
              <CardTitle className='text-2xl'>{submission.subject}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Name</p>
                <p className='font-semibold'>{submission.name}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p className='font-semibold'>{submission.email}</p>
              </div>
            </div>
            {submission.phone && (
              <div className='flex items-center gap-2'>
                <MessageSquare className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Phone</p>
                  <p className='font-semibold'>{submission.phone}</p>
                </div>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Submitted</p>
                <p className='font-semibold text-xs'>
                  {format(new Date(submission.createdAt), 'PPp')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className='font-semibold mb-2 flex items-center gap-2'>
              <MessageSquare className='h-4 w-4' />
              Message
            </h3>
            <p className='text-muted-foreground whitespace-pre-wrap'>
              {submission.message}
            </p>
          </div>

          {submission.replyMessage && (
            <>
              <Separator />
              <div>
                <h3 className='font-semibold mb-2 flex items-center gap-2'>
                  <Reply className='h-4 w-4' />
                  Reply
                </h3>
                <p className='text-muted-foreground whitespace-pre-wrap'>
                  {submission.replyMessage}
                </p>
                {submission.repliedAt && (
                  <p className='text-xs text-muted-foreground mt-2'>
                    Replied on: {format(new Date(submission.repliedAt), 'PPp')}
                  </p>
                )}
              </div>
            </>
          )}

          {showReplyForm && (
            <>
              <Separator />
              <div className='space-y-4'>
                <h3 className='font-semibold'>Send Reply</h3>
                <Textarea
                  placeholder='Enter your reply message...'
                  rows={6}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handleReply}
                    disabled={isReplying || !replyMessage.trim()}
                  >
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyMessage('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


