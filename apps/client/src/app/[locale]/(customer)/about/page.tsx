'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Award, BookOpen, Quote, Download } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('biography');

  const timelineEvents = [
    {
      year: '2011',
      title: 'First Major Publication',
      description: 'Published "ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ" (Ethiopian Muslims: History of Persecution and Struggle from 615-1700), a comprehensive 272-page historical account.',
      category: 'publication',
    },
    {
      year: '2012',
      title: 'Muslim Arbitration Committee Formation',
      description: 'Selected as one of 17 Muslim leaders to form the Muslim Arbitration Committee to address community grievances concerning governmental and religious-institution interference.',
      category: 'leadership',
    },
    {
      year: '2012',
      title: 'Arrest and Detention',
      description: 'Arrested in connection with MAC leadership, facing charges including terrorism, conspiracy to establish an Islamic state, and public incitement.',
      category: 'struggle',
    },
    {
      year: '2015',
      title: 'Sentencing',
      description: 'Sentenced to 22 years in prison on August 3, 2015, for his advocacy work and community leadership.',
      category: 'struggle',
    },
    {
      year: '2018',
      title: 'Release from Prison',
      description: 'Released on February 14, 2018, after serving 6 years of his 22-year sentence.',
      category: 'freedom',
    },
    {
      year: '2021',
      title: 'Political Candidacy',
      description: 'Ran as a candidate for the House of People\'s Representatives for Jimma city but later withdrew citing personal reasons, though votes were still cast for him.',
      category: 'politics',
    },
    {
      year: '2023',
      title: 'Community Leadership Speech',
      description: 'Delivered a powerful speech at a funeral for Muslims killed in protests over mosque demolitions, calling for unity, strategy, and moving forward.',
      category: 'leadership',
    },
  ];

  const notableQuotes = [
    {
      quote: "There are many elements who want to turn us into mountaineers. And we are fighting for our country, not to be a stepping-stone for others.",
      context: "From his June 3, 2023 speech at a funeral for Muslims killed in protests",
      year: "2023"
    },
    {
      quote: "Muslims refuse anything less than equality and will not accept being second class citizens.",
      context: "From his withdrawal announcement for 2021 elections",
      year: "2021"
    },
    {
      quote: "We must preserve our heritage and fight for justice through education and unity.",
      context: "From various community speeches and writings",
      year: "2018-2023"
    }
  ];

  const publications = [
    {
      title: 'ኢትዮጵያውያን ሙስሊሞች ከ 615-1700 የጭቆናና የትግል ታሪክ',
      titleEn: 'Ethiopian Muslims: History of Persecution and Struggle from 615-1700',
      year: '2011',
      pages: '272',
      language: 'Amharic',
      description: 'A comprehensive historical account of Ethiopian Muslims and their struggles for equality and justice throughout history.',
      isAvailable: true,
    },
    {
      title: 'The Role of Islamic Education in Modern Ethiopia',
      year: '2019',
      pages: '150',
      language: 'English',
      description: 'An analysis of Islamic education challenges and opportunities in contemporary Ethiopian society.',
      isAvailable: true,
    },
    {
      title: 'Community Rights and Religious Freedom',
      year: '2020',
      pages: '200',
      language: 'Amharic',
      description: 'A detailed examination of religious freedom and community rights in Ethiopia.',
      isAvailable: true,
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      publication: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      leadership: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      struggle: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      freedom: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      politics: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              A dedicated Islamic educator, historian, and community advocate who has devoted his life to promoting faith, preserving heritage, and fighting for justice for Ethiopian Muslims.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Tabs defaultValue="biography" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="biography">Biography</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
          </TabsList>

          <TabsContent value="biography" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://pbs.twimg.com/media/DOry78lW4AAVjeo.jpg"
                    alt="Ustaz Ahmedin Jebel"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal & Institutional Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <span className="font-semibold">Name:</span> Ahmedin Jebel (አሕመዲን ጀበል)
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <span className="font-semibold">Nationality:</span> Ethiopian
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <span className="font-semibold">Role:</span> Islamic Educator, Historian, Community Advocate
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <span className="font-semibold">Institutional Affiliation:</span> Former Social Affairs Advisor to the Ethiopian Islamic Affairs Supreme Council (EIASC)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Life & Career Events</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Ustaz Ahmedin Jebel has been a prominent figure in Ethiopian Muslim community affairs for over two decades.
                    His work spans Islamic education, historical research, community advocacy, and political engagement.
                    Despite facing significant challenges including imprisonment for his advocacy work, he has remained committed
                    to promoting equality, justice, and the preservation of Islamic heritage in Ethiopia.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-8">
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {event.year}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
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
          </TabsContent>

          <TabsContent value="quotes" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {notableQuotes.map((quote, index) => (
                <Card key={index} className="border-l-4 border-l-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Quote className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                          "{quote.quote}"
                        </blockquote>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p className="font-medium">{quote.context}</p>
                          <p>{quote.year}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="publications" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publications.map((publication, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{publication.title}</CardTitle>
                    {publication.titleEn && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {publication.titleEn}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {publication.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{publication.year}</span>
                        <span>{publication.pages} pages</span>
                        <span>{publication.language}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" disabled={!publication.isAvailable}>
                          {publication.isAvailable ? 'View Details' : 'Coming Soon'}
                        </Button>
                        {publication.isAvailable && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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