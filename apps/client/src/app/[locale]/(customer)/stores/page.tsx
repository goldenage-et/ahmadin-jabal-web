import { getStores } from '../../_actions/store.action';
import { StoresShowcase } from '../components/stores-showcase';

export default async function StoresPage() {
  const stores = await getStores({
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isActive: true,
  });

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='py-20 bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground relative overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-8'>
            <span className='block'>Our</span>
            <span className='block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
              Stores
            </span>
          </h1>
          <p className='text-xl lg:text-2xl mb-12 text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed'>
            Discover amazing vendors and their unique books. Shop from
            verified stores with quality guaranteed.
          </p>
        </div>
      </section>

      {/* All Stores */}
      <StoresShowcase
        stores={stores.data || []}
        title='All Stores'
        subtitle='Browse through all our verified and active stores'
        maxStores={50}
      />
    </div>
  );
}
