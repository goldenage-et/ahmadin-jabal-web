import { getCategories } from '@/actions/categories.action';
import { getPublication } from '@/actions/publication.action';
import EditPublicationForm from '@/features/publications/edit-publication-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { isErrorResponse, type TPublicationDetail, type TCategoryBasic } from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch data in parallel
  const [publicationResponse, categoriesResponse] = await Promise.all([
    getPublication(id),
    getCategories(),
  ]);

  // Handle publication response errors
  if (isErrorResponse(publicationResponse)) {
    return (
      <ErrorState
        title='Publication Not Found'
        message={publicationResponse.message || 'The publication you are looking for does not exist.'}
      />
    );
  }

  // Handle categories response errors
  if (isErrorResponse(categoriesResponse)) {
    return (
      <ErrorState
        title='Error Loading Categories'
        message={categoriesResponse.message || 'Failed to load categories.'}
      />
    );
  }

  const publication = publicationResponse as TPublicationDetail;
  const categories = categoriesResponse as TCategoryBasic[];

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/publications/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Publication
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Edit Publication
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update publication information and settings
            </p>
          </div>
        </div>
        <EditPublicationForm
          publication={publication}
          categories={categories}
        />
      </div>
    </div>
  );
}


