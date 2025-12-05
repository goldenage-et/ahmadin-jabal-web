import { CheckoutForm } from '@/components';

export default function Checkout() {
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
