import { StructuredData } from '@/components/structured-data';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { AuthSync } from '@/providers/storage/auth-sync';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from "next/navigation";
import { getAuth } from '../../actions/auth.action';
import { QueryProvider } from '../../components/query-provider';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Ustaz Ahmedin Jebel - Preacher · Historian · Community Advocate',
    template: '%s | Ustaz Ahmedin Jebel',
  },
  description:
    'Official website of Ustaz Ahmedin Jebel - Islamic educator, historian, and community advocate promoting faith, heritage and justice for Ethiopian Muslims',
  keywords: [
    'Ustaz Ahmedin Jebel',
    'Islamic education',
    'Ethiopian Muslims',
    'Islamic history',
    'community advocacy',
    'religious education',
    'Amharic books',
    'Islamic books',
    'Ethiopian Islamic history',
  ],
  authors: [{ name: 'Ustaz Ahmedin Jebel' }],
  creator: 'Ustaz Ahmedin Jebel',
  publisher: 'Ustaz Ahmedin Jebel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Ustaz Ahmedin Jebel - Preacher · Historian · Community Advocate',
    description:
      'Official website of Ustaz Ahmedin Jebel - Islamic educator, historian, and community advocate promoting faith, heritage and justice for Ethiopian Muslims',
    siteName: 'Ustaz Ahmedin Jebel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ustaz Ahmedin Jebel - Preacher · Historian · Community Advocate',
    description:
      'Official website of Ustaz Ahmedin Jebel - Islamic educator, historian, and community advocate promoting faith, heritage and justice for Ethiopian Muslims',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { session, user } = await getAuth();
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthSync user={user} session={session} />
            <QueryProvider>
              {children}
              <Toaster position='top-right' richColors closeButton />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
