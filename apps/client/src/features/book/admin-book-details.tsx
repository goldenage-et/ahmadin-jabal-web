'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  EBookStatus,
  TBookDetail,
  TBookDetailAnalytics,
  TBookReviewBasic,
  TCategoryBasic,
  TReviewAnalytics
} from '@repo/common';
import { format } from 'date-fns';
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  Edit,
  Eye,
  MessageSquare,
  Package,
  Share2,
  Star,
  Trash2,
  Truck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BookAnalytics from './book-analytics';
import ImageManager from './image-manager';
import ReviewManagement from './review-management';
import EditBookForm from './edit-book-form';
import SpecificationsManagement from './specifications-management';

type AdminBookDetailProps = {
  book: TBookDetail;
  categories: TCategoryBasic[];
  category: TCategoryBasic | undefined;
  reviews: TBookReviewBasic[];
  reviewAnalytics: TReviewAnalytics;
  bookAnalytics: TBookDetailAnalytics;
};

export default function AdminBookDetail({
  book: book,
  categories,
  category,
  reviews,
  reviewAnalytics,
  bookAnalytics,
}: AdminBookDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [images, setImages] = useState<string[]>(
    Array.isArray(book.images)
      ? book.images.map((img) => (typeof img === 'string' ? img : img.url))
      : [],
  );
  const createdAt = book?.createdAt;
  const updatedAt = book?.updatedAt;
  if (!book) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <Package className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold'>Book not found</h3>
          <p className='text-muted-foreground'>
            The book you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/admin/books')}
            className='mt-4'
          >
            Back to Books
          </Button>
        </div>
      </div>
    );
  }
  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    router.push('/admin/books');
  };

  const getStatusColor = (status?: EBookStatus) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case EBookStatus.active:
        return 'bg-green-100 text-green-800';
      case EBookStatus.draft:
        return 'bg-gray-100 text-gray-800';
      case EBookStatus.archived:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatus = () => {
    if (book.inventoryQuantity === 0)
      return { status: 'out-of-stock', color: 'text-red-600' };
    if (
      (book.inventoryQuantity || 0) <=
      (book.inventoryLowStockThreshold || 0)
    )
      return { status: 'low-stock', color: 'text-orange-600' };
    return { status: 'in-stock', color: 'text-green-600' };
  };

  const inventoryStatus = getInventoryStatus();

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
      <div className='container mx-auto px-4 py-6 space-y-8'>
        {/* Modern Header with Breadcrumb */}
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Link
              href='/admin/books'
              className='hover:text-foreground transition-colors'
            >
              Books
            </Link>
            <span>/</span>
            <span className='text-foreground font-medium'>{book.title}</span>
          </div>

          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl lg:text-4xl font-bold tracking-tight bg-linear-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  {book.title}
                </h1>
                <Badge
                  className={cn('text-xs', getStatusColor(book.status))}
                >
                  {book.status}
                </Badge>
                {book.featured && (
                  <Badge
                    variant='secondary'
                    className='text-xs bg-yellow-100 text-yellow-800 border-yellow-200'
                  >
                    <Star className='h-3 w-3 mr-1' />
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              {!isEditing && (
                <>
                  <Button
                    variant='outline'
                    size='sm'
                    className='hidden sm:flex'
                    asChild
                  >
                    <Link href={`/books/${book.id}`} target='_blank'>
                      <Eye className='h-4 w-4 mr-2' />
                      Preview
                    </Link>
                  </Button>
                  <Button variant='outline' size='sm'>
                    <Share2 className='h-4 w-4 mr-2' />
                    Share
                  </Button>
                  <Button onClick={() => setIsEditing(true)} size='sm'>
                    <Edit className='h-4 w-4 mr-2' />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modern Overview Cards */}
        {!isEditing && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
            <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-green-50 to-emerald-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-green-700'>Price</p>
                    <div className='space-y-1'>
                      <p className='text-2xl font-bold text-green-900'>
                        ${book.price}
                      </p>
                      {book.purchasePrice && (
                        <p className='text-sm text-green-600'>
                          Purchase Price: ${book.purchasePrice}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors'>
                    <DollarSign className='h-6 w-6 text-green-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-blue-700'>
                      Inventory
                    </p>
                    <div className='space-y-1'>
                      <p
                        className={`text-2xl font-bold ${inventoryStatus.color}`}
                      >
                        {inventoryStatus.status === 'unlimited'
                          ? '∞'
                          : book.inventoryQuantity}
                      </p>
                      <p className='text-sm text-blue-600'>
                        {inventoryStatus.status === 'unlimited'
                          ? 'Unlimited'
                          : inventoryStatus.status === 'out-of-stock'
                            ? 'Out of Stock'
                            : inventoryStatus.status === 'low-stock'
                              ? 'Low Stock'
                              : 'In Stock'}
                      </p>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors'>
                    <Truck className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-yellow-50 to-amber-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-yellow-700'>
                      Rating
                    </p>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-1'>
                        <p className='text-2xl font-bold text-yellow-900'>
                          {book.rating}
                        </p>
                        <Star className='h-5 w-5 text-yellow-500 fill-current' />
                      </div>
                      <p className='text-sm text-yellow-600'>
                        {book.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors'>
                    <Star className='h-6 w-6 text-yellow-600' />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-purple-50 to-violet-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-purple-700'>
                      Status
                    </p>
                    <div className='space-y-2'>
                      <Badge
                        className={cn(
                          'text-xs',
                          getStatusColor(book.status),
                        )}
                      >
                        {book.status}
                      </Badge>
                      {book.featured && (
                        <Badge
                          variant='secondary'
                          className='text-xs bg-yellow-100 text-yellow-800 border-yellow-200'
                        >
                          <Star className='h-3 w-3 mr-1' />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors'>
                    <CheckCircle className='h-6 w-6 text-purple-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {isEditing ? (
          <EditBookForm
            book={book}
            categories={categories}
            onCancel={handleCancel}
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <div className='b'>
              <TabsList className=''>
                <TabsTrigger value='overview' className=''>
                  Overview
                </TabsTrigger>
                <TabsTrigger value='analytics' className=''>
                  Analytics
                </TabsTrigger>
                <TabsTrigger value='reviews' className=''>
                  Reviews
                  {book.reviewCount > 0 && (
                    <Badge variant='secondary' className='ml-2 text-xs'>
                      {book.reviewCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-8 mt-8'>
              <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
                <ImageManager
                  images={images.map((url) => ({
                    id: url,
                    url,
                    alt: '',
                    isMain: false,
                  }))}
                  onImagesChange={(newImages) =>
                    handleImagesChange(newImages.map((img) => img.url))
                  }
                  className='xl:col-span-2'
                  isEditing={isEditing}
                />
                <Card className='border-0 shadow-lg h-fit'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='text-xl font-semibold'>
                      Book Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'>
                        <div>
                          <Label className='text-sm font-medium text-slate-600'>
                            Category
                          </Label>
                          <p className='text-sm font-semibold text-slate-900'>
                            {category?.name || 'No Category'}
                          </p>
                        </div>
                        <Package className='h-5 w-5 text-slate-400' />
                      </div>
                    </div>

                    <Separator />

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-slate-600'>
                          Created
                        </Label>
                        <p className='text-sm text-slate-900'>
                          {format(new Date(createdAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label className='text-sm font-medium text-slate-600'>
                          Updated
                        </Label>
                        <p className='text-sm text-slate-900'>
                          {format(new Date(updatedAt), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='overview' className='space-y-8 mt-8'>
              {/* Enhanced Book Information */}
              <Card className='border-0 shadow-lg'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl font-semibold'>
                    Book Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div className='space-y-3'>
                      <h3 className='text-xl font-semibold text-slate-900'>
                        {book.title}
                      </h3>
                      <p className='text-slate-600 leading-relaxed'>
                        {book.description}
                      </p>
                    </div>
                    {book.tags && book.tags.length > 0 && (
                      <div className='space-y-3'>
                        <Label className='text-sm font-medium text-slate-600'>
                          Tags
                        </Label>
                        <div className='flex flex-wrap gap-2'>
                          {book.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant='secondary'
                              className='text-xs px-3 py-1'
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <SpecificationsManagement
                bookId={book.id}
                specifications={book.specifications || []}
                onSpecificationUpdate={() => { }}
              />
            </TabsContent>
            {/* Enhanced Analytics Tab */}
            <TabsContent value='analytics' className='space-y-8 mt-8'>
              <BookAnalytics bookAnalytics={bookAnalytics} />
            </TabsContent>

            {/* Enhanced Reviews Tab */}
            <TabsContent value='reviews' className='space-y-8 mt-8'>
              {/* Review Analytics Overview */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-yellow-50 to-amber-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-yellow-700'>
                          Average Rating
                        </p>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-1'>
                            <p className='text-2xl font-bold text-yellow-900'>
                              {reviewAnalytics?.averageRating?.toFixed(1) ||
                                book.rating}
                            </p>
                            <Star className='h-5 w-5 text-yellow-500 fill-current' />
                          </div>
                          <p className='text-sm text-yellow-600'>
                            {reviewAnalytics?.totalReviews ||
                              book.reviewCount}{' '}
                            reviews
                          </p>
                        </div>
                      </div>
                      <div className='p-3 rounded-full bg-yellow-100 group-hover:bg-yellow-200 transition-colors'>
                        <Star className='h-6 w-6 text-yellow-600' />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-green-50 to-emerald-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-green-700'>
                          5-Star Reviews
                        </p>
                        <p className='text-2xl font-bold text-green-900'>
                          {reviewAnalytics?.ratingDistribution?.fiveStar || 0}
                        </p>
                        <p className='text-sm text-green-600'>5-star reviews</p>
                      </div>
                      <div className='p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors'>
                        <CheckCircle2 className='h-6 w-6 text-green-600' />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-blue-50 to-indigo-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-blue-700'>
                          Verified Reviews
                        </p>
                        <p className='text-2xl font-bold text-blue-900'>
                          {reviewAnalytics?.verifiedReviews || 0}
                        </p>
                        <p className='text-sm text-blue-600'>
                          From verified purchases
                        </p>
                      </div>
                      <div className='p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors'>
                        <CheckCircle className='h-6 w-6 text-blue-600' />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-linear-to-br from-purple-50 to-violet-50'>
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-2'>
                        <p className='text-sm font-medium text-purple-700'>
                          Pending Reviews
                        </p>
                        <p className='text-2xl font-bold text-purple-900'>
                          {reviewAnalytics?.pendingReviews || 0}
                        </p>
                        <p className='text-sm text-purple-600'>
                          Awaiting moderation
                        </p>
                      </div>
                      <div className='p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors'>
                        <MessageSquare className='h-6 w-6 text-purple-600' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review Management Tools */}
              <ReviewManagement
                bookId={book.id}
                reviews={reviews}
                reviewAnalytics={reviewAnalytics}
              />
            </TabsContent>
          </Tabs>
        )}
        {/* Modern Tabs Navigation */}

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className='max-w-md'>
            <AlertDialogHeader>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                  <Trash2 className='h-5 w-5 text-red-600' />
                </div>
                <AlertDialogTitle className='text-lg'>
                  Delete Book
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className='text-slate-600'>
                Are you sure you want to delete{' '}
                <span className='font-semibold text-slate-900'>
                  "{book.title}"
                </span>
                ? This action cannot be undone and will permanently remove the
                book.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='gap-3'>
              <AlertDialogCancel className='flex-1'>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className='flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Book
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
