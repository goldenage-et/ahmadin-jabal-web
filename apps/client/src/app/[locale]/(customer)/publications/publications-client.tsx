'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, FileText, Download, Calendar, Globe, Star, ArrowRight, Play, File, Image as ImageIcon } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { TPublicationBasic, TBlogBasic, TPaginationResponse } from '@repo/common';
import {
    getLocalizedPublicationTitle,
    getLocalizedPublicationExcerpt,
    getLocalizedTitle,
    getLocalizedExcerpt,
} from '@/lib/locale-utils';

type PublicationsClientProps = {
    publications: TPublicationBasic[];
    publicationsMeta?: TPaginationResponse<TPublicationBasic[]>['meta'];
    featuredBlogs: TBlogBasic[];
    locale: 'en' | 'am' | 'om';
};

export function PublicationsClient({ publications, publicationsMeta, featuredBlogs, locale }: PublicationsClientProps) {
    const t = useTranslations('publications');

    const getCategoryColor = (category: string | undefined) => {
        if (!category) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';

        const colors: Record<string, string> = {
            'History': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Education': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Rights': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Leadership': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
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
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Explore Ustaz Ahmedin Jebel's published works and educational materials that have shaped the community.
                    </p>
                </div>
            </div>

            {/* Publications Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {publications.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-xl text-muted-foreground">No publications available yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publications.map((publication) => {
                            const title = getLocalizedPublicationTitle(publication, locale);
                            const excerpt = getLocalizedPublicationExcerpt(publication, locale);

                            // Get display image: featured image or first media item
                            // Type assertion needed as TPublicationBasic may not include media in type but backend might return it
                            const media = (publication as any).media as Array<{ id: string; url: string; type?: 'image' | 'video' | 'document'; alt?: string }> | undefined;
                            const displayImage = publication.featuredImage ||
                                (media && media.length > 0 && (media[0].type === 'image' || !media[0].type)
                                    ? media[0].url
                                    : null);

                            // Get media counts by type
                            const mediaCounts = media ? {
                                images: media.filter(m => m.type === 'image' || !m.type).length,
                                videos: media.filter(m => m.type === 'video').length,
                                documents: media.filter(m => m.type === 'document').length,
                            } : { images: 0, videos: 0, documents: 0 };

                            return (
                                <Card key={publication.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    {displayImage && (
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={displayImage}
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {publication.featured && (
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-green-600 text-white">
                                                        Featured
                                                    </Badge>
                                                </div>
                                            )}
                                            {publication.isPremium && (
                                                <div className="absolute top-4 right-4">
                                                    <Badge variant="secondary" className="bg-yellow-600 text-white">
                                                        Premium
                                                    </Badge>
                                                </div>
                                            )}
                                            {/* Media indicator overlay */}
                                            {media && media.length > 0 && (
                                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                                    {mediaCounts.images > 0 && (
                                                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                                                            <ImageIcon className="h-3 w-3 mr-1" />
                                                            {mediaCounts.images}
                                                        </Badge>
                                                    )}
                                                    {mediaCounts.videos > 0 && (
                                                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                                                            <Play className="h-3 w-3 mr-1" />
                                                            {mediaCounts.videos}
                                                        </Badge>
                                                    )}
                                                    {mediaCounts.documents > 0 && (
                                                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                                                            <File className="h-3 w-3 mr-1" />
                                                            {mediaCounts.documents}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            {publication.categoryId && (
                                                <Badge className={getCategoryColor(publication.categoryId)}>
                                                    Category
                                                </Badge>
                                            )}
                                            <div className="flex items-center space-x-1 text-sm text-muted-foreground dark:text-muted-foreground">
                                                {publication.likeCount > 0 && (
                                                    <>
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{publication.likeCount}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <Link href={`/publications/${publication.id}`}>
                                            <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors cursor-pointer">
                                                {title}
                                            </CardTitle>
                                        </Link>
                                    </CardHeader>

                                    <CardContent>
                                        {excerpt && (
                                            <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                                                {excerpt}
                                            </p>
                                        )}

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-muted-foreground">
                                                {publication.publishedAt && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(publication.publishedAt).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-1">
                                                    <Globe className="h-4 w-4" />
                                                    <span>{publication.viewCount || 0} views</span>
                                                </div>
                                            </div>

                                            {publication.tags && publication.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {publication.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/publications/${publication.id}`}>
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        Read More
                                                    </Link>
                                                </Button>
                                                <div className="flex items-center gap-2">
                                                    {media && media.length > 0 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {media.length} {media.length === 1 ? 'media' : 'media'}
                                                        </Badge>
                                                    )}
                                                    {publication.downloadCount > 0 && (
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Featured Blogs Section */}
            {featuredBlogs.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground mb-2">
                                    Featured Blogs
                                </h2>
                                <p className="text-muted-foreground dark:text-muted-foreground">
                                    Explore insightful blogs and educational content
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/blogs">
                                    View All Blogs
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {featuredBlogs.slice(0, 4).map((blog) => {
                                const title = getLocalizedTitle(blog, locale);
                                const excerpt = getLocalizedExcerpt(blog, locale);

                                // Type assertion for blog medias (may not be in type but backend might return it)
                                const blogMedias = (blog as any).medias as Array<{ url: string }> | undefined;
                                const featuredImage = blog.featuredImage ||
                                    (blogMedias && Array.isArray(blogMedias) && blogMedias.length > 0
                                        ? blogMedias[0]?.url
                                        : null);

                                return (
                                    <Card key={blog.id} className="group hover:shadow-lg transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {featuredImage && (
                                                    <div className="relative w-full md:w-32 h-32 shrink-0 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={featuredImage}
                                                            alt={title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {blog.isPremium && (
                                                            <Badge variant="default" className="bg-yellow-600 text-white">
                                                                Premium
                                                            </Badge>
                                                        )}
                                                        {blog.featured && (
                                                            <Badge className="bg-green-600 text-white">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <Link href={`/blogs/${blog.id}`}>
                                                        <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors cursor-pointer line-clamp-2">
                                                            {title}
                                                        </h3>
                                                    </Link>

                                                    {excerpt && (
                                                        <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                                                            {excerpt}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 text-xs text-muted-foreground dark:text-muted-foreground">
                                                            {blog.publishedAt && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center space-x-1">
                                                                <Globe className="h-3 w-3" />
                                                                <span>{blog.viewCount || 0} views</span>
                                                            </div>
                                                        </div>

                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/blogs/${blog.id}`}>
                                                                Read
                                                                <ArrowRight className="h-3 w-3 ml-1" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="text-center mt-8">
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/blogs">
                                    View All Blogs
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

