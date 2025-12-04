import { getBlog } from '@/actions/blog.action';
import BlogDetail from '@/features/blogs/blog-detail';
import { notFound } from 'next/navigation';
import { isErrorResponse, type TBlogDetail } from '@repo/common';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BlogPage({ params }: PageProps) {
    const { id } = await params;
    const blogResponse = await getBlog(id);

    // Handle blog response errors
    if (isErrorResponse(blogResponse)) {
        notFound();
    }

    // After error check, TypeScript knows it's TBlogDetail
    const blog = blogResponse as TBlogDetail;

    return (
        <div className='space-y-6 p-6'>
            <BlogDetail blog={blog} />
        </div>
    );
}

