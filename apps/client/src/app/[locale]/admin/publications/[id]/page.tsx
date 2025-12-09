import { getPublication } from '@/actions/publication.action';
import PublicationDetail from '@/features/publications/publication-detail';
import { isErrorResponse, TPublicationDetail } from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicationPage({ params }: PageProps) {
  const { id } = await params;
  const publicationResponse = await getPublication(id);

  if (isErrorResponse(publicationResponse)) {
    return (
      <ErrorState
        title='Publication Not Found'
        message={publicationResponse.message || 'The publication you are looking for does not exist.'}
      />
    );
  }

  const publication = publicationResponse as TPublicationDetail;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-6 space-y-6'>
        <PublicationDetail publication={publication} />
      </div>
    </div>
  );
}


