import { getCategories } from '@/actions/categories.action';
import { getPublication } from '@/actions/publication.action';
import EditPublicationForm from '@/features/publications/edit-publication-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({ params }: PageProps) {
  const { id } = await params;
  const publicationResponse = await getPublication(id);

  if (!publicationResponse || publicationResponse.error) {
    notFound();
  }

  const publication = publicationResponse;
  const categoriesResponse = await getCategories();

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/publications/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Publication
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
              Edit Publication
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update publication information and settings
            </p>
          </div>
        </div>
        <EditPublicationForm
          publication={publication}
          categories={categoriesResponse}
        />
      </div>
    </div>
  );
}


