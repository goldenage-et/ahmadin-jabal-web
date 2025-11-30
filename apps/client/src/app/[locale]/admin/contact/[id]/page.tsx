import { getContactSubmission } from '@/actions/contact.action';
import ContactSubmissionDetail from '@/features/contact/contact-submission-detail';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContactSubmissionPage({ params }: PageProps) {
  const { id } = await params;
  const submissionResponse = await getContactSubmission(id);

  if (!submissionResponse || submissionResponse.error) {
    notFound();
  }

  const submission = submissionResponse;

  return (
    <div className='space-y-6 p-6'>
      <ContactSubmissionDetail submission={submission} />
    </div>
  );
}


