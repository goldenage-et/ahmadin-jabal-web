'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { BookOpen, Heart, Users, History } from 'lucide-react';

const focusAreaIcons = {
    education: BookOpen,
    research: History,
    rights: Heart,
    youth: Users,
};

export function FocusAreas() {
    const t = useTranslations('focusAreas');

    const focusAreas = [
        {
            key: 'education',
            icon: focusAreaIcons.education,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            key: 'research',
            icon: focusAreaIcons.research,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            key: 'rights',
            icon: focusAreaIcons.rights,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/20',
        },
        {
            key: 'youth',
            icon: focusAreaIcons.youth,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Through dedicated service and unwavering commitment, Ustaz Ahmedin Jebel has focused on key areas that strengthen the community and preserve our heritage.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {focusAreas.map((area) => {
                        const IconComponent = area.icon;
                        return (
                            <Card key={area.key} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                                <CardContent className="p-8 text-center">
                                    <div className={`w-16 h-16 ${area.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className={`h-8 w-8 ${area.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {t(`${area.key}.title`)}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {t(`${area.key}.description`)}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
