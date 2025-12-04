import { getAuth } from '@/actions/auth.action';
import { getBlog } from '@/actions/blog.action';
import BlogDetails from '@/features/blogs/components/blog-details';
import { notFound } from 'next/navigation';
import { isErrorResponse, type TBlogDetail } from '@repo/common';

type PageProps = {
    params: Promise<{
        locale: string;
        blogId: string;
    }>;
};

export default async function BlogPage({ params }: PageProps) {
    const { locale, blogId } = await params;
    const blogResponse = await getBlog(blogId);
    const { user } = await getAuth();

    // Handle blog response errors
    if (isErrorResponse(blogResponse)) {
        notFound();
    }

    // After error check, TypeScript knows it's TBlogDetail
    const blog = blogResponse as TBlogDetail;

    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <BlogDetails
                    blog={blog}
                    user={user}
                    locale={locale as 'en' | 'am' | 'om'}
                />
            </div>
        </div>
    );
}

