import { getCategories } from '@/actions/categories.action';
import { getBlog } from '@/actions/blog.action';
import EditBlogForm from '@/features/blogs/edit-blog-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isErrorResponse, type TBlogDetail, type TCategoryBasic } from '@repo/common';
import { ErrorState } from '@/components/error-state';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blogResponse = await getBlog(id);

  // Handle blog response errors
  if (isErrorResponse(blogResponse)) {
    notFound();
  }

  // After error check, TypeScript knows it's TBlogDetail
  const blog = blogResponse as TBlogDetail;

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
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/blogs/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Blog
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
              Edit Blog
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update blog information and settings
            </p>
          </div>
        </div>
        <EditBlogForm blog={blog} categories={categories} />
      </div>
    </div>
  );
}


