import { getNewsletter } from '@/actions/newsletter.action';
import EditNewsletterForm from '@/features/newsletter/edit-newsletter-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isErrorResponse, TNewsletterDetail } from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditNewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const newsletterResponse = await getNewsletter(id);

  if (isErrorResponse(newsletterResponse)) {
    return (
      <ErrorState
        title='Newsletter Not Found'
        message={newsletterResponse.message || 'The newsletter you are looking for does not exist.'}
      />
    );
  }

  const newsletter = newsletterResponse as TNewsletterDetail;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/newsletter/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Newsletter
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Newsletter
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update newsletter information
            </p>
          </div>
        </div>
        <EditNewsletterForm newsletter={newsletter} />
      </div>
    </div>
  );
}


