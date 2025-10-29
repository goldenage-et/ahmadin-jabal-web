'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TCategory } from '@repo/common';
import { Pencil, Trash2 } from 'lucide-react';

type CategoriesTableProps = {
  categories: TCategory[];
  onEdit: (category: TCategory) => void;
  onDelete?: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
};

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  isLoading,
  isError,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='rounded-md border border-destructive bg-destructive/10 p-4 text-destructive'>
        <p>Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className='rounded-md border p-8 text-center'>
        <p className='text-muted-foreground'>
          No categories found. Create your first category to get started.
        </p>
      </div>
    );
  }

  // Helper function to find parent category name
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return '-';
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead className='w-[100px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className='font-medium'>{category.name}</TableCell>
              <TableCell className='text-muted-foreground line-clamp-1'>
                {category.description || '-'}
              </TableCell>
              <TableCell>{getParentName(category.parentId)}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className='h-4 w-4' />
                    <span className='sr-only'>Edit</span>
                  </Button>
                  {onDelete && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(category.id)}
                      className='text-destructive hover:text-destructive/90'
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
