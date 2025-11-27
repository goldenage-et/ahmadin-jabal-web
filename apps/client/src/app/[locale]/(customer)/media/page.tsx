'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Headphones, Camera, ExternalLink, Calendar, Eye, Clock } from 'lucide-react';

export default function MediaPage() {
    const t = useTranslations('media');

    const videos = [
        {
            id: 'm1Ii39S_FlE',
            title: 'Talk with Ustaz Ahmedin Jebel - February 2018',
            description: 'An in-depth interview discussing community rights, equality, and the future of Ethiopian Muslims after his release from prison.',
            duration: '45:30',
            views: '125K',
            date: 'February 2018',
            category: 'Interview',
            thumbnail: 'https://img.youtube.com/vi/m1Ii39S_FlE/maxresdefault.jpg',
        },
        {
            id: 'example1',
            title: 'Community Rights and Equality - June 2023',
            description: 'Powerful speech delivered at a funeral for Muslims killed in protests over mosque demolitions.',
            duration: '32:15',
            views: '89K',
            date: 'June 2023',
            category: 'Speech',
            thumbnail: 'https://via.placeholder.com/480x360?text=Video+Thumbnail',
        },
        {
            id: 'example2',
            title: 'Islamic Education in Modern Ethiopia',
            description: 'Lecture on the importance of Islamic education and its role in community development.',
            duration: '28:45',
            views: '67K',
            date: 'March 2023',
            category: 'Lecture',
            thumbnail: 'https://via.placeholder.com/480x360?text=Video+Thumbnail',
        },
        {
            id: 'example3',
            title: 'Historical Perspective on Ethiopian Muslims',
            description: 'Educational talk about the rich history of Muslims in Ethiopia and their contributions.',
            duration: '41:20',
            views: '43K',
            date: 'January 2023',
            category: 'Educational',
            thumbnail: 'https://via.placeholder.com/480x360?text=Video+Thumbnail',
        },
    ];

    const audioSermons = [
        {
            title: 'Friday Sermon - Unity in Diversity',
            description: 'Weekly Friday sermon discussing the importance of unity within the Muslim community.',
            duration: '25:30',
            date: 'December 2023',
            category: 'Friday Sermon',
            isAvailable: true,
        },
        {
            title: 'Ramadan Reflections - Night 15',
            description: 'Special Ramadan night reflection on patience and perseverance.',
            duration: '18:45',
            date: 'March 2023',
            category: 'Ramadan',
            isAvailable: true,
        },
        {
            title: 'Community Issues and Solutions',
            description: 'Addressing current community challenges and proposing solutions.',
            duration: '35:20',
            date: 'November 2023',
            category: 'Community',
            isAvailable: true,
        },
        {
            title: 'Youth Engagement and Leadership',
            description: 'Motivational talk for young Muslims about taking leadership roles.',
            duration: '22:15',
            date: 'October 2023',
            category: 'Youth',
            isAvailable: true,
        },
    ];

    const photoGallery = [
        {
            src: 'https://pbs.twimg.com/media/DOry78lW4AAVjeo.jpg',
            alt: 'Ustaz Ahmedin Jebel speaking at an event',
            caption: 'Speaking at a community event',
            date: '2018',
        },
        {
            src: 'https://yt3.googleusercontent.com/876ei-KvER4PPIQVIkPtTDnWVkp28iU62LKMmXYNaARw2hN5pNEy_d_hRcBtkt7aVx67ohBFDVs%3Ds900-c-k-c0x00ffffff-no-rj',
            alt: 'Official portrait of Ustaz Ahmedin Jebel',
            caption: 'Official portrait',
            date: '2020',
        },
        {
            src: 'https://media.abna24.com/old/image/png/2023/May/28/20967e57-afdb-4a42-a1fb-b02c9b913ef1.png',
            alt: 'Ustaz Ahmedin Jebel at a press conference',
            caption: 'Press conference on community rights',
            date: '2023',
        },
        {
            src: 'https://via.placeholder.com/400x300?text=Event+Photo',
            alt: 'Community gathering',
            caption: 'Community gathering in Addis Ababa',
            date: '2022',
        },
        {
            src: 'https://via.placeholder.com/400x300?text=Book+Signing',
            alt: 'Book signing event',
            caption: 'Book signing event',
            date: '2021',
        },
        {
            src: 'https://via.placeholder.com/400x300?text=Lecture',
            alt: 'Educational lecture',
            caption: 'Educational lecture at university',
            date: '2023',
        },
    ];

    const getCategoryColor = (category: string) => {
        const colors = {
            'Interview': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Speech': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Lecture': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Educational': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
            'Friday Sermon': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Ramadan': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            'Community': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300',
            'Youth': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background">
            {/* Header */}
            <div className="bg-green-100 dark:bg-green-950 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground dark:text-foreground">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto">
                        Explore Ustaz Ahmedin Jebel's speeches, interviews, lectures, and educational content that have inspired and educated the community.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <Tabs defaultValue="videos" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="videos">{t('videos')}</TabsTrigger>
                        <TabsTrigger value="audio">{t('audio')}</TabsTrigger>
                        <TabsTrigger value="gallery">{t('gallery')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="videos" className="space-y-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((video, index) => (
                                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <Button
                                                size="lg"
                                                className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-gray-900"
                                                asChild
                                            >
                                                <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                                                    <Play className="h-6 w-6 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <Badge className={getCategoryColor(video.category)}>
                                                {video.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                                            {video.duration}
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                                            {video.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-muted-foreground mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{video.date}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{video.views}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                                                    {t('watch')}
                                                    <ExternalLink className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="audio" className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {audioSermons.map((sermon, index) => (
                                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg">{sermon.title}</CardTitle>
                                            <Badge className={getCategoryColor(sermon.category)}>
                                                {sermon.category}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed mb-4">
                                            {sermon.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-muted-foreground mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{sermon.date}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{sermon.duration}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!sermon.isAvailable}
                                                className="flex items-center space-x-2"
                                            >
                                                <Headphones className="h-4 w-4" />
                                                <span>{t('listen')}</span>
                                            </Button>
                                            {sermon.isAvailable && (
                                                <Button variant="ghost" size="sm">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="gallery" className="space-y-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {photoGallery.map((photo, index) => (
                                <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="relative aspect-square overflow-hidden">
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-foreground dark:text-foreground mb-1">
                                            {photo.caption}
                                        </h3>
                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                                            {photo.date}
                                        </p>
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
