'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Heart, Quote, ArrowRight, Award, Shield } from 'lucide-react';

export default function AdvocacyPage() {
    const t = useTranslations('advocacy');

    const advocacyAreas = [
        {
            title: 'Religious Freedom & Equality',
            description: 'Advocating for equal rights and religious freedom for all Ethiopian Muslims, ensuring they are treated as first-class citizens.',
            icon: Shield,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            impact: 'Led major campaigns for religious equality',
        },
        {
            title: 'Community Rights Protection',
            description: 'Fighting against mosque demolitions and protecting the rights of Muslim communities to practice their faith freely.',
            icon: Heart,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/20',
            impact: 'Prevented multiple mosque demolitions',
        },
        {
            title: 'Youth Empowerment',
            description: 'Mentoring and inspiring young Muslims to take leadership roles in their communities and advocate for positive change.',
            icon: Users,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            impact: 'Mentored 500+ young leaders',
        },
        {
            title: 'Educational Advocacy',
            description: 'Promoting Islamic education and ensuring access to quality religious education for all community members.',
            icon: Award,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
            impact: 'Established educational programs',
        },
    ];

    const keyEvents = [
        {
            year: '2012',
            title: 'Muslim Arbitration Committee Formation',
            description: 'Selected as one of 17 Muslim leaders to form the Muslim Arbitration Committee to address community grievances concerning governmental and religious-institution interference.',
            location: 'Addis Ababa, Ethiopia',
            impact: 'High',
            category: 'Leadership',
        },
        {
            year: '2012-2018',
            title: 'Imprisonment for Advocacy',
            description: 'Arrested and sentenced to 22 years in prison for advocating for Muslim rights and equality, becoming a symbol of resistance and resilience.',
            location: 'Ethiopia',
            impact: 'Very High',
            category: 'Sacrifice',
        },
        {
            year: '2018',
            title: 'Release and Continued Advocacy',
            description: 'Released from prison and immediately resumed community advocacy work, continuing to fight for equality and justice.',
            location: 'Ethiopia',
            impact: 'High',
            category: 'Resilience',
        },
        {
            year: '2021',
            title: 'Political Candidacy',
            description: 'Ran for House of People\'s Representatives for Jimma city, demonstrating commitment to democratic participation and community representation.',
            location: 'Jimma, Ethiopia',
            impact: 'Medium',
            category: 'Politics',
        },
        {
            year: '2023',
            title: 'Mosque Demolition Protest Speech',
            description: 'Delivered a powerful speech at a funeral for Muslims killed in protests over mosque demolitions, calling for unity and strategic action.',
            location: 'Addis Ababa, Ethiopia',
            impact: 'Very High',
            category: 'Leadership',
        },
    ];

    const notableQuotes = [
        {
            quote: "There are many elements who want to turn us into mountaineers. And we are fighting for our country, not to be a stepping-stone for others.",
            context: "From his June 3, 2023 speech at a funeral for Muslims killed in protests over mosque demolitions",
            year: "2023",
            impact: "High"
        },
        {
            quote: "Muslims refuse anything less than equality and will not accept being second class citizens.",
            context: "From his withdrawal announcement for 2021 elections",
            year: "2021",
            impact: "Very High"
        },
        {
            quote: "We must preserve our heritage and fight for justice through education and unity, not through division and hatred.",
            context: "From various community speeches and writings",
            year: "2018-2023",
            impact: "High"
        },
        {
            quote: "The youth are our future, and we must invest in them, educate them, and empower them to lead our community forward.",
            context: "From youth engagement speeches",
            year: "2020-2023",
            impact: "Medium"
        }
    ];

    const impactStats = [
        { number: '22', label: 'Years of Advocacy', description: 'Dedicated service to community rights' },
        { number: '3+', label: 'Books Published', description: 'Educational and historical works' },
        { number: '500+', label: 'Youth Mentored', description: 'Young leaders empowered' },
        { number: '1000+', label: 'Speeches Delivered', description: 'Community engagement events' },
        { number: '50+', label: 'Mosques Protected', description: 'Religious freedom advocacy' },
        { number: '100K+', label: 'Community Impact', description: 'Lives touched through advocacy' },
    ];

    const getImpactColor = (impact: string) => {
        const colors = {
            'Very High': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            'Low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        };
        return colors[impact as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            'Leadership': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'Sacrifice': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
            'Resilience': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            'Politics': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
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
                        {t('description')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Impact Statistics */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('impact')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Through decades of dedicated advocacy, Ustaz Ahmedin Jebel has made a lasting impact on the Ethiopian Muslim community.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {impactStats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {stat.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Advocacy Areas */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Focus Areas
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Ustaz Ahmedin Jebel's advocacy work spans multiple critical areas that strengthen the community and protect fundamental rights.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {advocacyAreas.map((area, index) => {
                            const IconComponent = area.icon;
                            return (
                                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start space-x-4">
                                            <div className={`w-12 h-12 ${area.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className={`h-6 w-6 ${area.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl">{area.title}</CardTitle>
                                                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                                                    {area.impact}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {area.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Key Events Timeline */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('events')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A timeline of significant events in Ustaz Ahmedin Jebel's advocacy journey.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {keyEvents.map((event, index) => (
                            <div key={index} className="flex items-start space-x-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                        {event.year}
                                    </div>
                                </div>
                                <Card className="flex-1">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-xl">{event.title}</CardTitle>
                                            <div className="flex space-x-2">
                                                <Badge className={getImpactColor(event.impact)}>
                                                    {event.impact} Impact
                                                </Badge>
                                                <Badge className={getCategoryColor(event.category)}>
                                                    {event.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{event.year}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {event.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notable Quotes */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Powerful Quotes
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Inspiring words that have motivated and guided the community through challenging times.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {notableQuotes.map((quote, index) => (
                            <Card key={index} className="border-l-4 border-l-green-600 group hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-3">
                                        <Quote className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                                "{quote.quote}"
                                            </blockquote>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    <p className="font-medium">{quote.context}</p>
                                                    <p>{quote.year}</p>
                                                </div>
                                                <Badge className={getImpactColor(quote.impact)}>
                                                    {quote.impact} Impact
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Join the Movement
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Support Ustaz Ahmedin Jebel's advocacy work and help continue the fight for equality, justice, and community rights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 py-6">
                            <Link href="/contact">
                                Get Involved
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                            <Link href="/media">
                                Watch Speeches
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
