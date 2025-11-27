'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Award } from 'lucide-react';

export function BiographyPreview() {
    const t = useTranslations('biography');

    const timelineEvents = [
        {
            year: '2011',
            title: 'First Book Published',
            description: 'Published "Ethiopian Muslims: History of Persecution and Struggle from 615-1700"',
        },
        {
            year: '2012',
            title: 'Muslim Arbitration Committee',
            description: 'Selected as one of 17 Muslim leaders to address community grievances',
        },
        {
            year: '2015',
            title: 'Arrest and Imprisonment',
            description: 'Sentenced to 22 years for advocating for Muslim rights and equality',
        },
        {
            year: '2018',
            title: 'Release and Continued Advocacy',
            description: 'Released from prison and continued community advocacy work',
        },
        {
            year: '2021',
            title: 'Political Candidacy',
            description: 'Ran for House of People\'s Representatives for Jimma city',
        },
        {
            year: '2023',
            title: 'Community Leadership',
            description: 'Delivered powerful speeches advocating for unity and justice',
        },
    ];

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                {t('title')}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                {t('shortIntro')}
                            </p>
                            <Button asChild size="lg" className="text-lg px-8 py-6">
                                <Link href="/about">
                                    {t('readMore')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Key Facts */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">3+ Books</div>
                                    <div className="text-sm text-gray-500">Published</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">22 Years</div>
                                    <div className="text-sm text-gray-500">Experience</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Ethiopia</div>
                                    <div className="text-sm text-gray-500">Based</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Community</div>
                                    <div className="text-sm text-gray-500">Leader</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Timeline */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('timeline')}
                        </h3>
                        <div className="space-y-6">
                            {timelineEvents.map((event, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {event.year}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {event.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
