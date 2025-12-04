import { getCategories } from '@/actions/categories.action';
import CreateBlogForm from '@/features/blogs/create-blog-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { isErrorResponse, type TCategoryBasic } from '@repo/common';
import { ErrorState } from '@/components/error-state';

export default async function CreateBlogPage() {
    const categoriesResponse = await getCategories();

    // Handle categories response errors
    if (isErrorResponse(categoriesResponse)) {
        return (
            <ErrorState
                title='Error Loading Categories'
                message={categoriesResponse.message || 'Failed to load categories.'}
            />
        );
    }

    const categories = categoriesResponse as TCategoryBasic[];
    return (
        <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <div className='flex items-center gap-4'>
                <Button variant='ghost' size='sm' asChild>
                    <Link href='/admin/blogs'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back
                    </Link>
                </Button>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
                        Create Blog
                    </h1>
                    <p className='text-muted-foreground dark:text-muted-foreground'>
                        Add a new blog to your blog
                    </p>
                </div>
            </div>
            <CreateBlogForm categories={categories} />
        </div>
    );
}

