import { getArticle } from '@/actions/article.action';
import ArticleDetail from '@/features/articles/article-detail';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ArticlePage({ params }: PageProps) {
    const { id } = await params;
    const articleResponse = await getArticle(id);

    if (!articleResponse || articleResponse.error) {
        notFound();
    }

    const article = articleResponse;

    return (
        <div className='space-y-6 p-6'>
            <ArticleDetail article={article} />
        </div>
    );
}

