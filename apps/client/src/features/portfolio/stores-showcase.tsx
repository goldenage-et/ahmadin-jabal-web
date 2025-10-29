'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TStoreBasic } from '@repo/common';
import {
  Store,
  Star,
  Users,
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface StoresShowcaseProps {
  stores: TStoreBasic[];
  title?: string;
  subtitle?: string;
  maxStores?: number;
}

export function StoresShowcase({
  stores,
  title = 'Featured Stores',
  subtitle = 'Discover amazing vendors and their unique books',
  maxStores = 8,
}: StoresShowcaseProps) {
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById('stores-showcase');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const displayedStores = stores.slice(0, maxStores);

  if (displayedStores.length === 0) {
    return null;
  }

  const getStoreImage = (store: TStoreBasic) => {
    // You can implement store image logic here
    return store.logo || '/placeholder-store.jpg';
  };

  return (
    <section
      id='stores-showcase'
      className='py-12 bg-gradient-to-br from-gray-50 to-white'
    >
      <div className='px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Store className='h-6 w-6 text-blue-600' />
              <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
                {title}
              </h2>
            </div>
            <p className='text-gray-600'>{subtitle}</p>
          </div>
          <Link href='/projects'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2'
            >
              View All Stores
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>

        {/* Stores Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
          {displayedStores.map((store, index) => {
            const isHovered = hoveredStore === store.id;

            return (
              <Link key={store.id} href={`/stores/${store.slug || store.id}`}>
                <Card
                  className='group relative overflow-hidden bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible
                      ? 'fadeInUp 0.4s ease-out forwards'
                      : 'none',
                  }}
                  onMouseEnter={() => setHoveredStore(store.id)}
                  onMouseLeave={() => setHoveredStore(null)}
                >
                  {/* Store Logo/Image */}
                  <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200'>
                    <Image
                      src={getStoreImage(store)}
                      alt={store.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw'
                    />

                    {/* Store Status Badges */}
                    <div className='absolute top-2 left-2 flex flex-col gap-1'>
                      {store.verifiedAt && (
                        <Badge className='bg-primary text-primary-foreground border-0 shadow-lg text-xs px-2 py-1'>
                          <Shield className='h-3 w-3 mr-1' />
                          Verified
                        </Badge>
                      )}
                      {store.isActive && (
                        <Badge className='bg-secondary text-secondary-foreground border-0 shadow-lg text-xs px-2 py-1'>
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Store Info */}
                  <CardContent className='p-3'>
                    <h4 className='font-medium text-sm line-clamp-2 leading-tight text-gray-900 group-hover:text-primary transition-colors duration-200 mb-2'>
                      {store.name}
                    </h4>

                    {store.description && (
                      <p className='text-xs text-gray-500 line-clamp-2 mb-2'>
                        {store.description}
                      </p>
                    )}

                    {/* Store Stats */}
                    <div className='flex items-center justify-between text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        <span>Active Store</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <TrendingUp className='h-3 w-3' />
                        <span>Verified</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Hover overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </Card>
              </Link>
            );
          })}
        </div>

        {/* View All Stores CTA */}
        <div className='text-center mt-8'>
          <Link href='/projects'>
            <Button
              size='lg'
              className='bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3'
            >
              <Store className='mr-2 h-5 w-5' />
              Explore All Stores
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </section>
  );
}
