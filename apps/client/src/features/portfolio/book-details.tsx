'use client';

import { useBuyNow } from '@/actions/buy-now.action';
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
import { ChevronRight, MapPin, Minus, Plus, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeSection, setActiveSection] = useState('reviews');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { setBuyNowItem } = useBuyNow();

  // Process images
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

  // Refs for sections
  const reviewsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLDivElement>(null);

  // Buy now handler - goes directly to checkout WITHOUT adding to cart
  const handleBuyNow = async () => {
    // Check if user is authenticated
    if (!user) {
      const loginUrl = `/${locale}/auth/signin`;
      const callbackUrl = pathname;
      router.push(`${loginUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      toast.info('Please sign in to continue with your purchase');
      return;
    }

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
    if (images.length > 0) {
      const imageIndex = images.findIndex((image) => image.isMain);
      setSelectedImage(imageIndex !== -1 ? imageIndex : 0);
    }
  }, [images]);

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'reviews', ref: reviewsRef },
        { id: 'description', ref: descriptionRef },
        { id: 'specifications', ref: specificationsRef },
      ];

      const scrollPosition = window.scrollY + 100;

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
    return images[index]?.url || '/placeholder-book.jpg';
  };

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
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
                      key={image.id || index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-16 h-16 shrink-0 aspect-square bg-muted rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-border'
                        }`}
                    >
                      <Image
                        src={image.url || '/placeholder-book.jpg'}
                        alt={image.alt || `${book.title} ${index + 1}`}
                        className='w-full h-full object-cover'
                        width={64}
                        height={64}
                      />
                    </button>
                  ))}
                </div>

                {/* Main Book Image */}
                <div className='flex-1 aspect-3/4 bg-muted rounded-lg overflow-hidden'>
                  <Image
                    src={getImageByIndex(selectedImage)}
                    alt={book.title}
                    className='w-full h-full object-cover'
                    width={600}
                    height={800}
                  />
                </div>
              </div>
            </div>
            <div className='w-full space-y-6'>
              {/* Book Title */}
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold text-foreground leading-tight'>
                  {book.title}
                </h1>

                {/* Rating and Reviews */}
                <div className='flex items-center mt-3 space-x-2'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(book.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground'
                          }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm font-medium text-foreground'>
                    {book.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    ({book.reviewCount || 0} {book.reviewCount === 1 ? 'Review' : 'Reviews'})
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-3'>
                  <span className='text-3xl font-bold text-primary'>
                    ETB {(book.price || 0).toLocaleString()}
                  </span>
                </div>
                {book.inventoryQuantity !== null && book.inventoryQuantity !== undefined && (
                  <p className='text-sm text-muted-foreground'>
                    {book.inventoryQuantity > 0
                      ? `${book.inventoryQuantity} items available`
                      : 'Out of stock'}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              {book.inventoryQuantity !== null && book.inventoryQuantity !== undefined && (
                <div className='flex items-center space-x-2'>
                  {book.inventoryQuantity > 0 ? (
                    <Badge variant='default' className='text-xs'>
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant='destructive' className='text-xs'>
                      Out of Stock
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className='mt-12 w-full'>
            <div className='sticky top-24 bg-card z-10 border-b border-border'>
              <div className='flex space-x-8 py-4 px-4 overflow-x-auto'>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'reviews'
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Reviews ({book.reviewCount || 0})
                </button>
                <button
                  onClick={() => scrollToSection('description')}
                  className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'description'
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Description
                </button>
                {book.specifications && book.specifications.length > 0 && (
                  <button
                    onClick={() => scrollToSection('specifications')}
                    className={`text-sm font-medium whitespace-nowrap pb-2 border-b-2 transition-colors ${activeSection === 'specifications'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Specifications
                  </button>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className='space-y-12'>
              {/* Customer Reviews Section */}
              <div ref={reviewsRef} id='reviews' className='pt-8'>
                <h2 className='text-2xl font-bold text-foreground mb-6'>
                  Reviews
                </h2>
                <BookReviewSection
                  bookId={book.id}
                  userId={user?.id}
                  reviews={reviews}
                  analytics={analytics}
                />
              </div>

              {/* Description Section */}
              {book.description && (
                <div ref={descriptionRef} id='description' className='pt-8'>
                  <h2 className='text-2xl font-bold text-foreground mb-6'>
                    Description
                  </h2>
                  <Card>
                    <CardContent className='p-6'>
                      <p className='text-foreground leading-relaxed whitespace-pre-line'>
                        {book.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Specifications Section */}
              {book.specifications && book.specifications.length > 0 && (
                <div ref={specificationsRef} id='specifications' className='pt-8'>
                  <h2 className='text-2xl font-bold text-foreground mb-6'>
                    Specifications
                  </h2>
                  <Card>
                    <CardContent className='p-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {book.specifications.map((attr) => (
                          <div
                            key={attr.id}
                            className='flex justify-between py-2 border-b border-border'
                          >
                            <span className='font-medium text-foreground'>
                              {attr.name}
                            </span>
                            <span className='text-muted-foreground'>
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='lg:col-span-3 mt-4'>
          <div className='sticky top-24 max-w-sm'>
            <Card className='space-y-6 p-6'>
              {/* Quantity Selector */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Quantity
                </label>
                <div className='flex items-center space-x-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-8 h-8 p-0'
                    disabled={
                      book.inventoryQuantity !== null &&
                      book.inventoryQuantity !== undefined &&
                      book.inventoryQuantity <= 0
                    }
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-medium text-foreground'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          quantity + 1,
                          book.inventoryQuantity || Infinity,
                        ),
                      )
                    }
                    className='w-8 h-8 p-0'
                    disabled={
                      book.inventoryQuantity !== null &&
                      book.inventoryQuantity !== undefined &&
                      quantity >= book.inventoryQuantity
                    }
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-3'>
                <Button
                  className='w-full font-bold py-3'
                  size='lg'
                  onClick={handleBuyNow}
                  disabled={
                    isAddingToCart ||
                    (book.inventoryQuantity !== null &&
                      book.inventoryQuantity !== undefined &&
                      book.inventoryQuantity <= 0)
                  }
                >
                  {isAddingToCart
                    ? 'Processing...'
                    : book.inventoryQuantity !== null &&
                      book.inventoryQuantity !== undefined &&
                      book.inventoryQuantity <= 0
                      ? 'Out of Stock'
                      : 'Buy Now'}
                </Button>
              </div>

              {/* Stock Info */}
              {book.inventoryQuantity !== null &&
                book.inventoryQuantity !== undefined && (
                  <div className='text-sm text-muted-foreground'>
                    {book.inventoryQuantity > 0 ? (
                      <p>
                        {book.inventoryQuantity === 1
                          ? 'Only 1 item left in stock'
                          : `${book.inventoryQuantity} items available`}
                      </p>
                    ) : (
                      <p>Currently out of stock</p>
                    )}
                  </div>
                )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
