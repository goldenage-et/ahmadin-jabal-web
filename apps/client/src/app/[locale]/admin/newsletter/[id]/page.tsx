import { getNewsletter } from '@/actions/newsletter.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import NewsletterDetail from '@/features/newsletter/newsletter-detail';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewsletterPage({ params }: PageProps) {
  const { id } = await params;
  const newsletterResponse = await getNewsletter(id);

  if (!newsletterResponse || newsletterResponse.error) {
    notFound();
  }

  const newsletter = newsletterResponse;

  return (
    <div className='space-y-6 p-6'>
      <NewsletterDetail newsletter={newsletter} />
    </div>
  );
}


