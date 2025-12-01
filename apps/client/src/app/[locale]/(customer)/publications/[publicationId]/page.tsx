import { getAuth } from '@/actions/auth.action';
import { getPublication } from '@/actions/publication.action';
import PublicationDetails from '@/features/publications/components/publication-details';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{
        publicationId: string;
    }>;
};

export default async function PublicationPage({ params }: PageProps) {
    const { publicationId } = await params;
    const publicationResponse = await getPublication(publicationId);
    const { user } = await getAuth();

    if (!publicationResponse || publicationResponse.error || !publicationResponse.data) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <PublicationDetails
                    publication={publicationResponse.data}
                    user={user}
                />
            </div>
        </div>
    );
}

