'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, BookOpen, FileText, Video } from 'lucide-react';

export function FeaturedContent() {
    const t = useTranslations('publications');

    const featuredItems = [
        {
            type: 'book',
            title: 'ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ',
            titleEn: 'Ethiopian Muslims: History of Persecution and Struggle from 615-1700',
            description: 'A comprehensive historical account of Ethiopian Muslims and their struggles for equality and justice.',
            image: 'https://via.placeholder.com/300x400?text=Book+Cover',
            year: '2011',
            pages: '272',
            language: 'Amharic',
            price: '$25.00',
            isFree: false,
            icon: BookOpen,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            type: 'video',
            title: 'Talk with Ustaz Ahmedin Jebel - February 2018',
            description: 'An in-depth interview discussing community rights, equality, and the future of Ethiopian Muslims.',
            image: 'https://img.youtube.com/vi/m1Ii39S_FlE/maxresdefault.jpg',
            duration: '45:30',
            views: '125K',
            year: '2018',
            isFree: true,
            icon: Video,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/20',
        },
        {
            type: 'article',
            title: 'The Future of Islamic Education in Ethiopia',
            description: 'A comprehensive analysis of Islamic education challenges and opportunities in contemporary Ethiopia.',
            image: 'https://via.placeholder.com/300x200?text=Article',
            readTime: '8 min read',
            year: '2023',
            isFree: true,
            icon: FileText,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Content
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Explore Ustaz Ahmedin Jebel's published works, speeches, and educational content that have shaped the community.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge variant={item.isFree ? "default" : "secondary"} className="bg-white/90 text-gray-900">
                                            {item.isFree ? 'Free' : item.price}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center`}>
                                            <IconComponent className={`h-5 w-5 ${item.color}`} />
                                        </div>
                                    </div>
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Play className="h-6 w-6 text-gray-900 ml-1" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                        {item.title}
                                    </CardTitle>
                                    {item.titleEn && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            {item.titleEn}
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <div className="flex items-center space-x-4">
                                            <span>{item.year}</span>
                                            {item.pages && <span>{item.pages} pages</span>}
                                            {item.duration && <span>{item.duration}</span>}
                                            {item.readTime && <span>{item.readTime}</span>}
                                        </div>
                                        {item.views && <span>{item.views} views</span>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={item.type === 'book' ? '/books' : item.type === 'video' ? '/media' : '/articles'}>
                                                {item.type === 'book' ? 'View Book' : item.type === 'video' ? 'Watch' : 'Read Article'}
                                            </Link>
                                        </Button>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                        <Link href="/publications">
                            View All Publications
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
