'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Mail, MessageCircle, Heart, Share2 } from 'lucide-react';

export function CTASection() {
  const t = useTranslations('contact');

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Contact Options */}
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="group hover:shadow-lg transition-all duration-300 border-white/20 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Speaking Requests</h3>
                  <p className="text-sm opacity-90 mb-4">Invite Ustaz for lectures, conferences, or community events</p>
                  <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/contact">Request Speaking</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-white/20 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-6 text-center text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Support the Work</h3>
                  <p className="text-sm opacity-90 mb-4">Help continue the important work of community advocacy</p>
                  <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <Link href="/donate">Donate Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Links */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Follow on Social Media</h3>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  YouTube
                </Button>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </div>
          </div>

          {/* Right - Newsletter Signup */}
          <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center text-white mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t('newsletter')}</h3>
                <p className="opacity-90">Stay updated with the latest news, publications, and events</p>
              </div>

              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
                <Button type="submit" className="w-full bg-white text-green-600 hover:bg-white/90 font-semibold">
                  Subscribe to Newsletter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-white/70 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}