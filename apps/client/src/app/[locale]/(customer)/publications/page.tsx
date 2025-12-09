import { getManyPublications } from '@/actions/publication.action';
import { getManyBlogs } from '@/actions/blog.action';
import { EPublicationStatus, EBlogStatus } from '@repo/common';
import { PublicationsClient } from './publications-client';

type PublicationsPageProps = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        categoryId?: string;
        authorId?: string;
        status?: string;
        featured?: string;
        isPremium?: string;
    }>;
};

export default async function PublicationsPage({
    params: paramsPromise,
    searchParams: searchParamsPromise
}: PublicationsPageProps) {
    const { locale } = await paramsPromise;
    const searchParams = await searchParamsPromise;

    // Build query parameters from search params
    const publicationsQuery = {
        page: searchParams.page ? parseInt(searchParams.page) : 1,
        limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
        status: (searchParams.status as EPublicationStatus) || EPublicationStatus.published,
        search: searchParams.search,
        categoryId: searchParams.categoryId,
        authorId: searchParams.authorId,
        featured: searchParams.featured === 'true' ? true : undefined,
        isPremium: searchParams.isPremium === 'true' ? true : undefined,
    };

    // Fetch publications and featured blogs in parallel
    const [publicationsResponse, featuredBlogsResponse] = await Promise.all([
        getManyPublications(publicationsQuery),
        getManyBlogs({
            status: EBlogStatus.published,
            featured: true,
            limit: 4,
        }),
    ]);

    // Handle publications response
    let publications: any[] = [];
    let publicationsMeta: any = undefined;
    if (!('error' in publicationsResponse && publicationsResponse.error)) {
        const paginationData = publicationsResponse as any;
        publications = paginationData?.data || [];
        publicationsMeta = paginationData?.meta;
    }

    // Handle featured blogs response
    let featuredBlogs: any[] = [];
    if (!('error' in featuredBlogsResponse && featuredBlogsResponse.error)) {
        const blogsPaginationData = featuredBlogsResponse as any;
        featuredBlogs = blogsPaginationData?.data || [];
    }

    return (
        <PublicationsClient
            publications={publications}
            publicationsMeta={publicationsMeta}
            featuredBlogs={featuredBlogs}
            locale={locale as 'en' | 'am' | 'om'}
        />
    );
}
