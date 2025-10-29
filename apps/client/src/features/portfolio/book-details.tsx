'use client';

import { useBuyNowStore } from '@/features/cart/store/buy-now-store';
import { BookReviewSection } from '@/features/reviews/components/book-review-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  TBookDetail,
  TBookReviewBasic,
  TReviewAnalytics,
  TUserBasic
} from '@repo/common';
import { ChevronRight, Heart, MapPin, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function BookDetails({
  book,
  user,
  reviews,
  analytics,
}: {
  book: TBookDetail;
  user: TUserBasic | null;
  reviews: TBookReviewBasic[];
  analytics: TReviewAnalytics | null;
}) {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeSection, setActiveSection] = useState('reviews');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { setBuyNowItem } = useBuyNowStore();

  // Refs for sections
  const reviewsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);
  const storeRecommendationsRef = useRef<HTMLDivElement>(null);
  const youMayLikeRef = useRef<HTMLDivElement>(null);
  // Buy now handler - goes directly to checkout WITHOUT adding to cart
  const handleBuyNow = async () => {
    // Check stock availability
    const stockQuantity = book.inventoryQuantity;
    if (stockQuantity !== null && stockQuantity !== undefined && stockQuantity < quantity) {
      toast.error(`Only ${stockQuantity} items available in stock`);
      return;
    }

    setIsAddingToCart(true);
    try {
      setBuyNowItem(book);
      // Immediately redirect to checkout
      router.push('/checkout?buyNow=true');
    } catch (error) {
      toast.error('Failed to process buy now');
      console.error('Error in buy now:', error);
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    const imageIndex = images.findIndex((image) => image.isMain);
    if (imageIndex !== -1) {
      setSelectedImage(imageIndex);
    } else if (images.length > 0) {
      setSelectedImage(0);
    }
  }, [book]);

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'reviews', ref: reviewsRef },
        { id: 'description', ref: descriptionRef },
        { id: 'specifications', ref: specificationsRef },
        { id: 'store', ref: storeRef },
        { id: 'store-recommendations', ref: storeRecommendationsRef },
        { id: 'you-may-like', ref: youMayLikeRef },
      ];

      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const sectionMap: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      reviews: reviewsRef,
      description: descriptionRef,
      specifications: specificationsRef,
      store: storeRef,
      'store-recommendations': storeRecommendationsRef,
      'you-may-like': youMayLikeRef,
    };

    const targetRef = sectionMap[sectionId];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const getImageByIndex = (index: number) => {
    return images[index].url || '/placeholder.jpg';
  };

  const images = useMemo(() => {
    type ImageWithMeta = {
      id: string;
      url: string;
      alt?: string;
      isMain?: boolean;
    };

    const allImages: ImageWithMeta[] = book.images?.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isMain: img.isMain
    })) || [];

    return allImages;
  }, [book.images]);

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
    const selectedImg = images[index];
  };

  return (
    <div className='min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
        <div className='lg:col-span-9'>
          <div className='w-full flex flex-col lg:flex-row gap-8'>
            <div className='w-full'>
              <div className='flex flex-col-reverse md:flex-row gap-4'>
                {/* Thumbnail Gallery */}
                <div
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    maxHeight: '600px', // Set a max height for vertical scroll
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE 10+
                  }}
                  className={`flex flex-row md:flex-col gap-2 w-full md:w-20 h-20 md:h-full overflow-x-auto md:overflow-x-visible md:overflow-y-auto [&::-webkit-scrollbar]:hidden`}
                >
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-16 h-16 shrink-0 aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <Image
                        src={image.url || '/placeholder.jpg'}
                        alt={`${image.alt} ${book.title} ${index + 1}`}
                        className='w-full h-full object-cover'
                        width={64}
                        height={64}
                      />
                    </button>
                  ))}
                </div>

                {/* Main Book Image */}
                <div className='flex-1 aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                  <Image
                    src={getImageByIndex(selectedImage)}
                    alt={book.title}
                    className='w-full h-full object-cover'
                    width={600}
                    height={600}
                  />
                </div>
              </div>
            </div>
            <div className='w-full space-y-6'>
              {/* Book Title */}
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold text-gray-900 leading-tight'>
                  {book.title}
                </h1>

                {/* Rating and Reviews */}
                <div className='flex items-center mt-3 space-x-2'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className='text-sm font-medium'>{book.rating}</span>
                  <span className='text-sm text-gray-500'>
                    {book.reviewCount} Reviews
                  </span>
                  <span className='text-sm text-gray-500'>|</span>
                  <span className='text-sm text-gray-500'>38 sold</span>
                </div>
              </div>

              {/* Price Section */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-3'>
                  <span className='text-3xl font-bold text-primary-600'>
                    ETB
                    {(book.price || 0).toLocaleString()}
                  </span>
                  {/* {book.compareAtPrice && (
                    <span className='text-sm text-primary-600 font-medium'>
                      {Math.round(
                        ((book.compareAtPrice -
                          (book.price || 0)) /
                          book.compareAtPrice) *
                        100,
                      )}
                      % off
                    </span>
                  )} */}
                </div>
                {/* {book.compareAtPrice && (
                  <div className='flex items-center space-x-2'>
                    <span className='text-lg text-gray-500 line-through'>
                      ETB{book.compareAtPrice.toLocaleString()}
                    </span>
                  </div>
                )} */}
              </div>

              {/* Wholesale Offer */}
              <div className='flex items-center space-x-2'>
                <Badge variant='destructive' className='text-xs'>
                  Wholesale
                </Badge>
                <span className='text-sm text-gray-600'>
                  3+ pieces, extra 1% off
                </span>
              </div>
              <p className='text-xs text-gray-500'>
                Tax excluded, add at checkout if applicable
              </p>

              {/* Additional Offer Banner */}
              <div className='bg-primary text-white bg-opacity-10 border border-primbg-primary text-white-200 rounded-lg p-3 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-primary text-white rounded-full'></div>
                  <span className='text-sm text-white font-medium'>
                    ETB161.65 off over ETB163.27
                  </span>
                </div>
                <ChevronRight className='h-4 w-4 text-wite-600' />
              </div>
            </div>
          </div>
          <div className='mt-12 w-full'>
            <div className='sticky top-24 bg-white z-10 border-b border-gray-200'>
              <div className='flex space-x-8 py-4 overflow-x-auto'>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'reviews'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Customer Reviews ({book.reviewCount})
                </button>
                <button
                  onClick={() => scrollToSection('description')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'description'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Description
                </button>
                <button
                  onClick={() => scrollToSection('specifications')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'specifications'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => scrollToSection('store')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'store'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Store
                </button>
                <button
                  onClick={() => scrollToSection('store-recommendations')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'store-recommendations'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Store Recommendations
                </button>
                <button
                  onClick={() => scrollToSection('you-may-like')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'you-may-like'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  You May Like
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className='space-y-12'>
              {/* Customer Reviews Section */}
              <div ref={reviewsRef} id='reviews' className='pt-8'>
                <h2 className='text-2xl font-bold mb-6'>Customer Reviews</h2>
                <BookReviewSection
                  bookId={book.id}
                  userId={user?.id}
                  reviews={reviews}
                  analytics={analytics}
                />
              </div>

              {/* Description Section */}
              <div ref={descriptionRef} id='description' className='pt-8'>
                <h2 className='text-2xl font-bold mb-6'>Description</h2>
                <Card>
                  <CardContent className='p-6'>
                    <p className='text-gray-700 leading-relaxed'>
                      {book.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Specifications Section */}
              <div ref={specificationsRef} id='specifications' className='pt-8'>
                <h2 className='text-2xl font-bold mb-6'>Specifications</h2>
                <Card>
                  <CardContent className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {book.specifications?.map((attr, index) => (
                        <div
                          key={index}
                          className='flex justify-between py-2 border-b'
                        >
                          <span className='font-medium'>{attr.name}</span>
                          <span className='text-gray-600'>{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Store Recommendations Section */}
              <div
                ref={storeRecommendationsRef}
                id='store-recommendations'
                className='pt-8'
              >
                <h2 className='text-2xl font-bold mb-6'>
                  Store Recommendations
                </h2>
                <Card>
                  <CardContent className='p-6'>
                    <p className='text-gray-700'>
                      Recommended books from this store will be displayed
                      here.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* You May Like Section */}
              <div ref={youMayLikeRef} id='you-may-like' className='pt-8'>
                <h2 className='text-2xl font-bold mb-6'>You May Like</h2>
                <Card>
                  <CardContent className='p-6'>
                    <p className='text-gray-700'>
                      Similar books you might be interested in will be
                      displayed here.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-3 mt-4'>
          <div className='sticky top-24 max-w-sm'>
            <Card className='space-y-6 p-6 shadow-lg'>
              {/* Location */}
              <div className='flex items-center space-x-2'>
                <MapPin className='h-4 w-4 text-gray-400' />
                <span className='text-sm text-gray-600'>Ethiopia</span>
              </div>

              {/* Shipping Info */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Shipping: ETB2,626.89
                  </span>
                  <ChevronRight className='h-4 w-4 text-gray-400' />
                </div>
                <p className='text-xs text-gray-500'>
                  Delivery: Oct 24 - 31, item ships within 14 days
                </p>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Return&refund policy
                  </span>
                  <ChevronRight className='h-4 w-4 text-gray-400' />
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>
                    Security & Privacy
                  </span>
                  <ChevronRight className='h-4 w-4 text-gray-400' />
                </div>

                <div className='text-xs text-gray-500 space-y-1'>
                  <p>Safe payments: We do not share your personal detail...</p>
                  <p>
                    Secure personal details: We protect your privacy and ...
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-8 h-8 p-0'
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-medium'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setQuantity(quantity + 1)}
                    className='w-8 h-8 p-0'
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                <Button
                  className='w-full bg-primary text-white hover:bg-primary/90 font-bold py-3'
                  size='lg'
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : 'Buy now'}
                </Button>
              </div>

              {/* Social Actions */}
              <div className='flex items-center space-x-4 pt-4 border-t'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='flex items-center space-x-2'
                >
                  <span>Share</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
