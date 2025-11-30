import { getCategories } from '@/actions/categories.action';
import { getArticle } from '@/actions/article.action';
import EditArticleForm from '@/features/articles/edit-article-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const articleResponse = await getArticle(id);

  if (!articleResponse || articleResponse.error) {
    notFound();
  }

  const article = articleResponse;
  const categoriesResponse = await getCategories();

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href={`/admin/articles/${id}`}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Article
            </Link>
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-foreground dark:text-foreground'>
              Edit Article
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update article information and settings
            </p>
          </div>
        </div>
        <EditArticleForm article={article} categories={categoriesResponse} />
      </div>
    </div>
  );
}


