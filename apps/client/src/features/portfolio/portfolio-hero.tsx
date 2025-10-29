'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export function PortfolioHero() {
    const t = useTranslations('hero');

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
            <div className="absolute inset-0" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                {t('title')}
                            </h1>
                            <p className="text-xl sm:text-2xl text-green-600 dark:text-green-400 font-medium">
                                {t('subtitle')}
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                                {t('tagline')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="text-lg px-8 py-6">
                                <Link href="/about">
                                    {t('cta')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                                <Play className="mr-2 h-5 w-5" />
                                Watch Video
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">3+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Books Published</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">22</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">1000+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Community Impact</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://pbs.twimg.com/media/DOry78lW4AAVjeo.jpg"
                                alt="Ustaz Ahmedin Jebel"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400 font-bold">U</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Islamic Scholar</div>
                                    <div className="text-xs text-gray-500">Since 2011</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">22</div>
                                <div className="text-xs text-gray-500">Years of Service</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
