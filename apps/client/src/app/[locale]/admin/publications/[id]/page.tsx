import { getPublication } from '@/actions/publication.action';
import PublicationDetail from '@/features/publications/publication-detail';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicationPage({ params }: PageProps) {
  const { id } = await params;
  const publicationResponse = await getPublication(id);

  if (!publicationResponse || publicationResponse.error) {
    notFound();
  }

  const publication = publicationResponse;

  return (
    <div className='space-y-6 p-6'>
      <PublicationDetail publication={publication} />
    </div>
  );
}


