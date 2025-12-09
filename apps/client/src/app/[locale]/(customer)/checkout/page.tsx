import { CheckoutForm } from '@/components';
import { getAuth } from '@/actions/auth.action';
import { ErrorType, isErrorResponse } from '@repo/common';
import { redirect } from 'next/navigation';

export default async function Checkout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, session, error } = await getAuth();

  // Check if there's no session or invalid session
  if (
    !user ||
    !session ||
    (error && isErrorResponse(error) &&
      (error.errorType === ErrorType.NOT_ACCESS_SESSION ||
        error.errorType === ErrorType.INVALID_SESSION ||
        error.errorType === ErrorType.EXPIRED_SESSION))
  ) {
    const loginUrl = `/${locale}/auth/signin`;
    const callbackUrl = `/${locale}/checkout`;
    redirect(`${loginUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <div className='min-h-screen bg-background dark:bg-background py-12'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-foreground dark:text-foreground'>Checkout</h1>
          <p className='text-muted-foreground dark:text-muted-foreground mt-2'>Complete your order</p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
