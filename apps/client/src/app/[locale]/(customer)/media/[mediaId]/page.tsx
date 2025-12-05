import { getAuth } from '@/actions/auth.action';
import { getMedia } from '@/actions/media.action';
import MediaDetails from '@/features/media/components/media-details';
import { notFound } from 'next/navigation';
import { isErrorResponse } from '@repo/common';

type PageProps = {
    params: Promise<{
        mediaId: string;
    }>;
};

export default async function MediaPage({ params }: PageProps) {
    const { mediaId } = await params;
    const mediaResponse = await getMedia(mediaId);
    const { user } = await getAuth();

    if (!mediaResponse || isErrorResponse(mediaResponse)) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <MediaDetails
                    media={mediaResponse}
                    user={user}
                />
            </div>
        </div>
    );
}

