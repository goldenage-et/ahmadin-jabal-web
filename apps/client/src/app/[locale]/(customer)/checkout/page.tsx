import { CheckoutForm } from '@/actions/checkout.action';

export default function Checkout() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='text-gray-600 mt-2'>Complete your order</p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
