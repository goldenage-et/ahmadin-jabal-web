import { getManyBlogs } from '@/actions/blog.action';
import { EBlogStatus, isErrorResponse } from '@repo/common';
import { BlogsClient } from './blogs-client';
import { ErrorState } from '@/components/error-state';

type BlogsPageProps = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        categoryId?: string;
        authorId?: string;
        status?: string;
        featured?: string;
        isFree?: string;
    }>;
};

export default async function BlogsPage({
    params: paramsPromise,
    searchParams: searchParamsPromise
}: BlogsPageProps) {
    const { locale } = await paramsPromise;
    const searchParams = await searchParamsPromise;

    // Build query parameters from search params
    const queryParams = {
        page: searchParams.page ? parseInt(searchParams.page) : 1,
        limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
        status: (searchParams.status as EBlogStatus) || EBlogStatus.published,
        search: searchParams.search,
        categoryId: searchParams.categoryId,
        authorId: searchParams.authorId,
        featured: searchParams.featured === 'true' ? true : undefined,
        isFree: searchParams.isFree === 'true' ? true : undefined,
    };

    // Fetch blogs on the server
    const blogsResponse = await getManyBlogs(queryParams);

    // Handle error response
    if (isErrorResponse(blogsResponse)) {
        return (
            <ErrorState
                title='Error Loading Blogs'
                message={blogsResponse.message}
            />
        );
    }

    // Successful response has TPaginationResponse structure with data and meta
    const paginationData = blogsResponse as { data: any[]; meta: any };
    const blogs = paginationData?.data || [];
    const meta = paginationData?.meta;

    return <BlogsClient blogs={blogs} meta={meta} locale={locale as 'en' | 'am' | 'om'} />;
}

