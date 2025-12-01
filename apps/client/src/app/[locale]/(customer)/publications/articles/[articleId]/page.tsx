import { getAuth } from '@/actions/auth.action';
import { getArticle } from '@/actions/article.action';
import ArticleDetails from '@/features/articles/components/article-details';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{
        articleId: string;
    }>;
};

export default async function ArticlePage({ params }: PageProps) {
    const { articleId } = await params;
    const articleResponse = await getArticle(articleId);
    const { user } = await getAuth();

    if (!articleResponse || articleResponse.error || !articleResponse.data) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <ArticleDetails
                    article={articleResponse.data}
                    user={user}
                />
            </div>
        </div>
    );
}

