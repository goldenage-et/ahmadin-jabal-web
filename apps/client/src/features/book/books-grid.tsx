'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Package,
  Star,
  Eye,
  MoreHorizontal,
  Copy,
  Archive,
  Trash2,
  Loader2,
} from 'lucide-react';
import { TBookBasic, TCategoryBasic, EBookStatus } from '@repo/common';
import { format } from 'date-fns';
import Link from 'next/link';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { deleteBook } from '@/actions/book.action';
import { toast } from 'sonner';
import Image from 'next/image';
interface BooksGridProps {
  books: TBookBasic[];
  categories: TCategoryBasic[];
  selectedBooks: string[];
  setSelectedBooks: React.Dispatch<React.SetStateAction<string[]>>;
}

export function BooksGrid({
  books,
  categories,
  selectedBooks,
  setSelectedBooks,
}: BooksGridProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const { mutate: deleteBookMutation, isLoading: isDeleting } =
    useApiMutation();

  const handleSelectBook = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  const handleSelectAll = () => {
    if (selectedBooks.length === books.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(books.map((p) => p.id));
    }
  };

  const handleDeleteBook = (bookId: string) => {
    setBookToDelete(bookId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!bookToDelete) return;

    deleteBookMutation(async () => deleteBook(bookToDelete), {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setBookToDelete(null);
        toast.success('Book deleted successfully');
        // Refresh the page to update the data
        window.location.reload();
      },
      onError: (error) => {
        console.error('Failed to delete book:', error);
        toast.error('Failed to delete book');
      },
    });
  };

  const getStatusColor = (status: EBookStatus) => {
    switch (status) {
      case EBookStatus.active:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case EBookStatus.draft:
        return 'bg-muted text-muted-foreground';
      case EBookStatus.archived:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInventoryStatus = (book: TBookBasic) => {
    if (book.inventoryQuantity === 0) return 'out-of-stock';
    if (
      (book.inventoryQuantity || 0) <=
      (book.inventoryLowStockThreshold || 0)
    )
      return 'low-stock';
    return 'in-stock';
  };

  const getInventoryColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'text-green-600';
      case 'low-stock':
        return 'text-orange-600';
      case 'out-of-stock':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };


  const getBookImageUrl = (book: TBookBasic) => {
    if (!book.images || book.images.length === 0) return undefined;
    const img = book.images.find((img) => img.isMain) || book.images[0];
    if (typeof img === 'string') return img;
    if (img && typeof img === 'object' && 'url' in img) return img.url;
    return undefined;
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {books.map((book) => {
          const inventoryStatus = getInventoryStatus(book);
          const category = categories.find((c) => c.id === book.categoryId);

          return (
            <Card
              key={book.id}
              className='overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 group'
            >
              <div className='relative'>
                <div className='aspect-3/4 overflow-hidden bg-muted relative'>
                  {book.images && book.images.length > 0 ? (
                    <Image
                      src={getBookImageUrl(book) || '/placeholder-book.jpg'}
                      alt={book.title || 'Book Image'}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Package className='h-12 w-12 text-muted-foreground' />
                    </div>
                  )}
                </div>
                <div className='absolute top-3 left-3 flex gap-1'>
                  <Badge
                    className={`${getStatusColor(book.status)} text-xs font-medium`}
                  >
                    {book.status}
                  </Badge>
                  {book.featured && (
                    <Badge variant='secondary' className='text-xs font-medium'>
                      Featured
                    </Badge>
                  )}
                </div>
                <div className='absolute top-3 right-3'>
                  <Checkbox
                    checked={selectedBooks.includes(book.id)}
                    onCheckedChange={() => handleSelectBook(book.id)}
                    className='bg-white/90 backdrop-blur-sm'
                  />
                </div>
              </div>
              <CardContent className='p-5'>
                <div className='space-y-3'>
                  <div>
                    <h3 className='font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight'>
                      <Link href={`/admin/books/${book.id}`}>
                        {book.title}
                      </Link>
                    </h3>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xl font-bold text-foreground'>
                      ETB {(book.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span
                      className={`font-medium ${getInventoryColor(inventoryStatus)}`}
                    >
                      {inventoryStatus === 'out-of-stock'
                        ? 'Out of Stock'
                        : inventoryStatus === 'low-stock'
                          ? 'Low Stock'
                          : 'In Stock'}
                    </span>
                    <div className='flex items-center'>
                      <Star className='h-3 w-3 text-yellow-400 fill-current mr-1' />
                      <span className='text-muted-foreground'>{book.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{category?.name || 'No Category'}</span>
                    <span>{format(new Date(book.createdAt), 'MMM dd')}</span>
                  </div>
                </div>
                <div className='flex gap-2 mt-5'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 h-8 text-xs'
                    asChild
                  >
                    <Link href={`/admin/books/${book.id}`}>
                      <Eye className='h-3 w-3 mr-1' />
                      View
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='h-8 w-8 p-0'
                      >
                        <MoreHorizontal className='h-3 w-3' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Copy className='h-4 w-4 mr-2' />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className='h-4 w-4 mr-2' />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
