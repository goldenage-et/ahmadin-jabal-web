'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Calendar, Globe, Star } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { TBlogBasic, TPaginationResponse } from '@repo/common';
import Image from 'next/image';
import { getLocalizedTitle, getLocalizedExcerpt } from '@/lib/locale-utils';
import { Crown } from 'lucide-react';

type BlogsClientProps = {
    blogs: TBlogBasic[];
    meta?: TPaginationResponse<TBlogBasic[]>['meta'];
    locale: 'en' | 'am' | 'om';
};

export function BlogsClient({ blogs, meta, locale }: BlogsClientProps) {
    const getCategoryColor = (category: string | undefined) => {
        if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';

        const colors: Record<string, string> = {
            'History': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Education': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Community': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Advocacy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Header */}
            <div className="bg-green-100 dark:bg-green-950 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground dark:text-foreground">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blogs</h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Explore insightful blogs and educational content by Ustaz Ahmedin Jebel.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-xl text-muted-foreground">No blogs available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {blogs.map((blog) => {
                            const title = getLocalizedTitle(blog, locale);
                            const excerpt = getLocalizedExcerpt(blog, locale);

                            const featuredImage = blog.featuredImage ||
                                (blog.medias && Array.isArray(blog.medias) && blog.medias.length > 0
                                    ? (blog.medias[0] as any)?.url
                                    : null);

                            return (
                                <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {featuredImage && (
                                                <div className="relative w-full md:w-64 h-48 md:h-40 shrink-0 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={featuredImage}
                                                        alt={title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        {blog.categoryId && (
                                                            <Badge className={getCategoryColor(blog.categoryId)}>
                                                                Category
                                                            </Badge>
                                                        )}
                                                        {blog.isPremium && (
                                                            <Badge variant="outline" className="bg-yellow-500/90 text-white border-yellow-400">
                                                                <Crown className="h-3 w-3 mr-1" />
                                                                Premium
                                                            </Badge>
                                                        )}
                                                        {blog.price && (
                                                            <Badge variant="secondary">
                                                                {formatPrice(blog.price)}
                                                            </Badge>
                                                        )}
                                                        {blog.featured && (
                                                            <Badge className="bg-green-600 text-white">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <Link href={`/blogs/${blog.id}`}>
                                                    <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors cursor-pointer">
                                                        {title}
                                                    </h3>
                                                </Link>

                                                {excerpt && (
                                                    <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                                                        {excerpt}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground dark:text-muted-foreground">
                                                        {blog.publishedAt && (
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center space-x-1">
                                                            <Globe className="h-4 w-4" />
                                                            <span>{blog.viewCount || 0} views</span>
                                                        </div>
                                                        {blog.likeCount > 0 && (
                                                            <div className="flex items-center space-x-1">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span>{blog.likeCount}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/blogs/${blog.id}`}>
                                                                <FileText className="h-4 w-4 mr-1" />
                                                                Read Blog
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>

                                                {blog.tags && blog.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-3">
                                                        {blog.tags.slice(0, 5).map((tag) => (
                                                            <Badge key={tag} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

