'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  Star,
  Eye,
  Edit,
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

interface BooksTableProps {
  books: TBookBasic[];
  categories: TCategoryBasic[];
  selectedBooks: string[];
  setSelectedBooks: React.Dispatch<React.SetStateAction<string[]>>;
}

export function BooksTable({
  books,
  categories,
  selectedBooks,
  setSelectedBooks,
}: BooksTableProps) {
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
        return 'bg-green-100 text-green-800';
      case EBookStatus.draft:
        return 'bg-gray-100 text-gray-800';
      case EBookStatus.archived:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryStatus = (book: TBookBasic) => {
    if (!book.inventoryQuantity) return 'unlimited';
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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>
                <Checkbox
                  checked={selectedBooks.length === books.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='w-12'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const inventoryStatus = getInventoryStatus(book);
              const category = categories.find(
                (c) => c.id === book.categoryId,
              );
              return (
                <TableRow key={book.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBooks.includes(book.id)}
                      onCheckedChange={() => handleSelectBook(book.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 rounded-md overflow-hidden bg-gray-100'>
                        {book.images && book.images.length > 0 ? (
                          <img
                            src={getBookImageUrl(book)}
                            alt={book.title}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center'>
                            <Package className='h-6 w-6 text-gray-400' />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className='font-medium'>{book.title}</div>
                        {book.featured && (
                          <Badge variant='secondary' className='text-xs'>
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{category?.name || 'No Category'}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>${book.price}</div>
                      <div className='text-sm text-muted-foreground'>
                        Purchase Price: ${book.purchasePrice}
                      </div>
                      {/* {book.compareAtPrice && (
                        <div className='text-sm text-muted-foreground line-through'>
                          ${book.compareAtPrice}
                        </div>
                      )} */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={getInventoryColor(inventoryStatus)}>
                      {inventoryStatus === 'unlimited'
                        ? 'Unlimited'
                        : inventoryStatus === 'out-of-stock'
                          ? 'Out of Stock'
                          : inventoryStatus === 'low-stock'
                            ? 'Low Stock'
                            : `${book.inventoryQuantity} units`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <Star className='h-3 w-3 text-yellow-400 fill-current mr-1' />
                      <span>{book.rating}</span>
                      <span className='text-muted-foreground ml-1'>
                        ({book.reviewCount})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(book.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/books/${book.id}`}>
                            <Eye className='h-4 w-4 mr-2' />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/books/${book.id}/edit`}>
                            <Edit className='h-4 w-4 mr-2' />
                            Edit
                          </Link>
                        </DropdownMenuItem>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

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
