import { getAuth } from '@/actions/auth.action';
import { getPublication } from '@/actions/publication.action';
import PublicationDetails from '@/features/publications/components/publication-details';
import { TPublicationDetail, isErrorResponse } from '@repo/common';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{
        publicationId: string;
        locale: string;
    }>;
};

export default async function PublicationPage({ params }: PageProps) {
    const { publicationId, locale } = await params;
    const publicationResponse = await getPublication(publicationId);
    const { user } = await getAuth();
    console.log({ publicationResponse });

    if (isErrorResponse(publicationResponse)) {
        notFound();
    }

    const publication = publicationResponse;
    console.log({ publication });

    if (!publication) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <PublicationDetails
                    publication={publication as TPublicationDetail}
                    user={user}
                    locale={locale as 'en' | 'am' | 'om'}
                />
            </div>
        </div>
    );
}

