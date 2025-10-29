'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  EBookVariantStatus,
  TBookSpecification,
  TBookVariant,
} from '@repo/common';
import {
  AlertTriangle,
  Archive,
  Check,
  DollarSign,
  Edit,
  Loader2,
  MoreHorizontal,
  Package,
  Package2,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import {
  deleteBookVariant,
  updateBookVariant,
} from '../../../actions/variant.action';
import SpecificationsManagement from './specifications-management';
import VariantForm, { CreateVariantDialog } from './variant-form';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminVariantsManagement({
  bookId,
  storeId,
  variants,
  bookPrice,
}: {
  bookId: string;
  storeId: string;
  variants: TBookVariant[];
  bookPrice: number;
}) {
  const { mutate, isLoading } = useApiMutation();

  const [variant, setVariant] = useState<TBookVariant | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<string | null>(null);
  const [updatingVariant, setUpdatingVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getVariantStats = useCallback((variant: TBookVariant) => {
    return {
      isLowStock: (variant.quantity ?? 0) < 10,
      isOutOfStock: (variant.quantity ?? 0) === 0,
      hasSales: (variant.saleCount ?? 0) > 0,
    };
  }, []);

  const handleDeleteVariant = async (variantId: string) => {
    setDeletingVariant(variantId);
    setError(null);

    try {
      await mutate(async () => deleteBookVariant(variantId), {
        successMessage: 'Variant deleted successfully',
        errorMessage: 'Failed to delete variant',
        onSuccess: () => {
          setVariant(null);
        },
        onError: (err: any) => {
          setError(err?.message || 'Failed to delete variant');
        },
      });
    } finally {
      setDeletingVariant(null);
    }
  };

  const handleUpdateStatus = async (
    variantId: string,
    status: EBookVariantStatus,
  ) => {
    setUpdatingVariant(variantId);
    setError(null);

    try {
      await mutate(
        async () => updateBookVariant(variantId, { status } as any),
        {
          successMessage: 'Variant status updated successfully',
          errorMessage: 'Failed to update variant status',
          onSuccess: () => {
            setVariant(null);
          },
          onError: (err: any) => {
            setError(err?.message || 'Failed to update variant status');
          },
        },
      );
    } finally {
      setUpdatingVariant(null);
    }
  };

  return (
    <>
      <Card className='border-0 shadow-lg'>
        <CardHeader className='pb-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <CardTitle className='text-xl font-semibold'>
                Book Variants
              </CardTitle>
              <p className='text-sm text-slate-600 mt-1'>
                Manage different variations of this book
              </p>
              <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Package2 className='h-4 w-4' />
                  {variants.length} variant{variants.length !== 1 ? 's' : ''}
                </span>
                <span className='flex items-center gap-1'>
                  <TrendingUp className='h-4 w-4' />
                  {
                    variants.filter(
                      (v) => v.status === EBookVariantStatus.active,
                    ).length
                  }{' '}
                  active
                </span>
              </div>
            </div>
            <CreateVariantDialog
              bookId={bookId}
              storeId={storeId}
              bookPrice={bookPrice}
            />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {error && (
            <div className='p-6'>
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {variants.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6'>
              {variants.map((variant) => {
                const stats = getVariantStats(variant);
                const isDeleting = deletingVariant === variant.id;
                const isUpdating = updatingVariant === variant.id;

                // Get main attribute for display
                const mainAttr =
                  variant.specifications && variant.specifications.length > 0
                    ? variant.specifications[0]
                    : null;

                return (
                  <Card
                    key={variant.id}
                    className={cn(
                      'group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white',
                      isDeleting && 'opacity-50 pointer-events-none',
                      variant.status === EBookVariantStatus.archived &&
                      'opacity-75',
                    )}
                  >
                    <div className='relative'>
                      <div className='aspect-video overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100'>
                        {variant.image?.url ? (
                          <Image
                            src={variant.image.url}
                            alt={variant.name ?? 'Variant Image'}
                            width={400}
                            height={225}
                            onError={(e) => {
                              console.error(
                                'Variant image failed to load:',
                                variant.image?.url,
                              );
                              e.currentTarget.style.display = 'none';
                            }}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <Package className='h-16 w-16 text-slate-300' />
                          </div>
                        )}
                      </div>
                      <div className='absolute top-3 right-3'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='outline'
                              size='sm'
                              className='h-9 w-9 p-0'
                              disabled={isDeleting || isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <MoreHorizontal className='h-4 w-4' />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' className='w-48'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setVariant(variant)}
                              disabled={isDeleting || isUpdating}
                            >
                              <Edit className='h-4 w-4 mr-2' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {variant.status !==
                              EBookVariantStatus.active && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      variant.id,
                                      EBookVariantStatus.active,
                                    )
                                  }
                                  disabled={isDeleting || isUpdating}
                                >
                                  <Check className='h-4 w-4 mr-2 text-green-600' />
                                  Activate
                                </DropdownMenuItem>
                              )}
                            {variant.status !==
                              EBookVariantStatus.archived && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(
                                      variant.id,
                                      EBookVariantStatus.archived,
                                    )
                                  }
                                  disabled={isDeleting || isUpdating}
                                >
                                  <Archive className='h-4 w-4 mr-2 text-yellow-600' />
                                  Archive
                                </DropdownMenuItem>
                              )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className='text-red-600 focus:text-red-600'
                                  disabled={isDeleting || isUpdating}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className='h-4 w-4 mr-2 text-red-600' />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Variant
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {variant.name ?? 'Variant'}"? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteVariant(variant.id)
                                    }
                                    className='bg-red-600 hover:bg-red-700'
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className='absolute top-3 left-3 flex flex-col gap-2'>
                        {variant.status === EBookVariantStatus.archived && (
                          <Badge
                            variant='destructive'
                            className='bg-white/90 text-destructive backdrop-blur-sm text-xs'
                          >
                            Archived
                          </Badge>
                        )}
                        {variant.status === EBookVariantStatus.active && (
                          <Badge
                            variant='secondary'
                            className='bg-white/90 text-green-600 backdrop-blur-sm text-xs'
                          >
                            Active
                          </Badge>
                        )}
                        {variant.status === EBookVariantStatus.draft && (
                          <Badge
                            variant='secondary'
                            className='bg-white/90 text-yellow-600 backdrop-blur-sm text-xs'
                          >
                            Draft
                          </Badge>
                        )}
                        {stats.isOutOfStock && (
                          <Badge
                            variant='destructive'
                            className='bg-red-500 text-white backdrop-blur-sm text-xs'
                          >
                            Out of Stock
                          </Badge>
                        )}
                        {stats.isLowStock && !stats.isOutOfStock && (
                          <Badge
                            variant='secondary'
                            className='bg-orange-500 text-white backdrop-blur-sm text-xs'
                          >
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className='p-6 space-y-4'>
                      <div className='space-y-3'>
                        <div>
                          <h3 className='font-semibold text-slate-900 line-clamp-2 leading-tight text-lg'>
                            {variant.name ?? 'Variant'}
                          </h3>
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {variant.specifications &&
                              variant.specifications.map((specification, index) => (
                                <Badge
                                  key={index}
                                  variant='outline'
                                  className='text-xs'
                                >
                                  {specification.name}: {specification.value}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        {/* Variant Stats */}
                        <div className='grid grid-cols-2 gap-4 py-3'>
                          <div className='flex items-center gap-2'>
                            <DollarSign className='h-4 w-4 text-green-600' />
                            <span className='text-sm font-medium'>
                              ${variant.price}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Package className='h-4 w-4 text-blue-600' />
                            <span className='text-sm font-medium'>
                              {variant.quantity ?? 0} in stock
                            </span>
                          </div>
                          {stats.hasSales && (
                            <div className='flex items-center gap-2 col-span-2'>
                              <TrendingUp className='h-4 w-4 text-purple-600' />
                              <span className='text-sm font-medium'>
                                {variant.saleCount} sales
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-16'>
              <div className='w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Package className='h-12 w-12 text-slate-400' />
              </div>
              <h3 className='text-xl font-semibold text-slate-900 mb-2'>
                No variants yet
              </h3>
              <p className='text-slate-600 mb-6 max-w-md mx-auto'>
                Create book variants to offer different options like size,
                color, or style.
              </p>
              <CreateVariantDialog
                storeId={storeId}
                bookId={bookId}
                bookPrice={bookPrice}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!variant} onOpenChange={() => setVariant(null)}>
        <DialogContent className='w-full max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
          </DialogHeader>
          <ScrollArea className='h-[calc(100vh-10rem)]'>
            <div className='px-3 space-y-2'>
              {variant ? (
                <VariantForm
                  storeId={storeId}
                  bookId={bookId}
                  bookPrice={bookPrice}
                  variant={variant}
                />
              ) : (
                <div className='text-center py-16'>
                  <Loader2 className='h-12 w-12 text-slate-400 animate-spin mx-auto mb-6' />
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
