'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, FileText, Download, ShoppingCart, Calendar, Globe, Star } from 'lucide-react';

export default function PublicationsPage() {
    const t = useTranslations('publications');

    const books = [
        {
            id: 1,
            title: 'ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ',
            titleEn: 'Ethiopian Muslims: History of Persecution and Struggle from 615-1700',
            description: 'A comprehensive 272-page historical account of Ethiopian Muslims and their struggles for equality and justice throughout history. This groundbreaking work documents the persecution faced by Muslims in Ethiopia and their continuous struggle for religious freedom and equal rights.',
            author: 'Ustaz Ahmedin Jebel',
            year: '2011',
            pages: '272',
            language: 'Amharic',
            price: '$25.00',
            originalPrice: '$30.00',
            isAvailable: true,
            isFeatured: true,
            rating: 4.8,
            reviews: 124,
            image: 'https://via.placeholder.com/300x400?text=Book+Cover',
            category: 'History',
            tags: ['Ethiopian History', 'Islamic History', 'Religious Freedom', 'Community Rights'],
        },
        {
            id: 2,
            title: 'The Role of Islamic Education in Modern Ethiopia',
            description: 'An in-depth analysis of Islamic education challenges and opportunities in contemporary Ethiopian society. This work explores the importance of religious education in community development and social cohesion.',
            author: 'Ustaz Ahmedin Jebel',
            year: '2019',
            pages: '150',
            language: 'English',
            price: '$18.00',
            isAvailable: true,
            isFeatured: false,
            rating: 4.6,
            reviews: 89,
            image: 'https://via.placeholder.com/300x400?text=Book+Cover',
            category: 'Education',
            tags: ['Islamic Education', 'Community Development', 'Social Issues'],
        },
        {
            id: 3,
            title: 'Community Rights and Religious Freedom in Ethiopia',
            description: 'A detailed examination of religious freedom and community rights in Ethiopia, focusing on the challenges faced by Muslim communities and strategies for advocacy and change.',
            author: 'Ustaz Ahmedin Jebel',
            year: '2020',
            pages: '200',
            language: 'Amharic',
            price: '$22.00',
            isAvailable: true,
            isFeatured: false,
            rating: 4.7,
            reviews: 67,
            image: 'https://via.placeholder.com/300x400?text=Book+Cover',
            category: 'Rights',
            tags: ['Religious Freedom', 'Human Rights', 'Community Advocacy'],
        },
        {
            id: 4,
            title: 'Youth Leadership in Islamic Communities',
            description: 'A guide for young Muslims on taking leadership roles in their communities, based on Islamic principles and contemporary challenges.',
            author: 'Ustaz Ahmedin Jebel',
            year: '2022',
            pages: '180',
            language: 'English',
            price: '$20.00',
            isAvailable: false,
            isFeatured: false,
            rating: 4.5,
            reviews: 45,
            image: 'https://via.placeholder.com/300x400?text=Coming+Soon',
            category: 'Leadership',
            tags: ['Youth Development', 'Leadership', 'Community Building'],
        },
    ];

    const articles = [
        {
            id: 1,
            title: 'The Future of Islamic Education in Ethiopia',
            description: 'A comprehensive analysis of Islamic education challenges and opportunities in contemporary Ethiopia, with recommendations for improvement.',
            author: 'Ustaz Ahmedin Jebel',
            date: '2023-06-15',
            readTime: '8 min read',
            category: 'Education',
            isFree: true,
            views: 1250,
            tags: ['Education', 'Islamic Studies', 'Community Development'],
        },
        {
            id: 2,
            title: 'Community Unity in Times of Challenge',
            description: 'Reflections on maintaining community unity and solidarity during difficult times, based on Islamic principles and historical experiences.',
            author: 'Ustaz Ahmedin Jebel',
            date: '2023-05-20',
            readTime: '6 min read',
            category: 'Community',
            isFree: true,
            views: 980,
            tags: ['Community', 'Unity', 'Islamic Principles'],
        },
        {
            id: 3,
            title: 'Advocacy Strategies for Religious Freedom',
            description: 'A detailed guide on effective advocacy strategies for promoting religious freedom and community rights in diverse societies.',
            author: 'Ustaz Ahmedin Jebel',
            date: '2023-04-10',
            readTime: '10 min read',
            category: 'Advocacy',
            isFree: false,
            price: '$5.00',
            views: 750,
            tags: ['Advocacy', 'Religious Freedom', 'Strategy'],
        },
        {
            id: 4,
            title: 'Historical Perspectives on Ethiopian Muslims',
            description: 'An exploration of the rich history of Muslims in Ethiopia and their contributions to the country\'s development.',
            author: 'Ustaz Ahmedin Jebel',
            date: '2023-03-15',
            readTime: '12 min read',
            category: 'History',
            isFree: true,
            views: 1100,
            tags: ['History', 'Ethiopian Muslims', 'Cultural Heritage'],
        },
    ];

    const getCategoryColor = (category: string) => {
        const colors = {
            'History': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Education': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Rights': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Leadership': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
            'Community': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Advocacy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Explore Ustaz Ahmedin Jebel's published works, including books, articles, and educational materials that have shaped the community.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Tabs defaultValue="books" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="books">{t('books')}</TabsTrigger>
                        <TabsTrigger value="articles">{t('articles')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="books" className="space-y-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {books.map((book) => (
                                <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <Image
                                            src={book.image}
                                            alt={book.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {book.isFeatured && (
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-green-600 text-white">
                                                    Featured
                                                </Badge>
                                            </div>
                                        )}
                                        {!book.isAvailable && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                                    Coming Soon
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge className={getCategoryColor(book.category)}>
                                                {book.category}
                                            </Badge>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{book.rating}</span>
                                                <span>({book.reviews})</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                                        {book.titleEn && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2">
                                                {book.titleEn}
                                            </p>
                                        )}
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {book.description}
                                        </p>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-4">
                                                    <span>{book.year}</span>
                                                    <span>{book.pages} pages</span>
                                                    <span>{book.language}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1">
                                                {book.tags.slice(0, 2).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {book.originalPrice && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {book.originalPrice}
                                                        </span>
                                                    )}
                                                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                        {book.price}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!book.isAvailable}
                                                    >
                                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                                        {book.isAvailable ? 'Buy' : 'Pre-order'}
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="articles" className="space-y-8">
                        <div className="space-y-6">
                            {articles.map((article) => (
                                <Card key={article.id} className="group hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Badge className={getCategoryColor(article.category)}>
                                                        {article.category}
                                                    </Badge>
                                                    {article.isFree ? (
                                                        <Badge variant="default" className="bg-green-600">
                                                            Free
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            {article.price}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                                    {article.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{new Date(article.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <FileText className="h-4 w-4" />
                                                    <span>{article.readTime}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Globe className="h-4 w-4" />
                                                    <span>{article.views} views</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    Read Article
                                                </Button>
                                                {article.isFree && (
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {article.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
