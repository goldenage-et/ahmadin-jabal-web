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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TBookSpecification,
  TUpdateBookSpecification,
  ZUpdateBookSpecification,
} from '@repo/common';
import { Edit, MoreHorizontal, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  deleteBookSpecification,
  updateBookSpecification,
} from '../actions/book.action';
import { CreateSpecificationDialog } from './create-specification';
import UpdateSpecificationForm from './edit-specification-form';

interface SpecificationsManagementProps {
  bookId: string;
  specifications: TBookSpecification[];
  className?: string;
  title?: string;
  onSpecificationUpdate?: () => void;
}

export default function SpecificationsManagement({
  bookId,
  specifications,
  className,
  title,
  onSpecificationUpdate,
}: SpecificationsManagementProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSpecification, setEditingSpecification] =
    useState<TBookSpecification | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specificationToDelete, setSpecificationToDelete] = useState<
    string | null
  >(null);

  const { mutate: updateMutation, isLoading: isUpdating } = useApiMutation();
  const { mutate: deleteMutation, isLoading: isDeleting } = useApiMutation();

  const editForm = useForm<TUpdateBookSpecification>({
    resolver: zodResolver(ZUpdateBookSpecification) as any,
    defaultValues: {
      name: '',
      value: '',
    },
  });

  const handleEditSpecification = (specification: TBookSpecification) => {
    setEditingSpecification(specification);
    editForm.reset({
      name: specification.name,
      value: specification.value,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSpecification = (data: TUpdateBookSpecification) => {
    if (!editingSpecification) return;

    updateMutation(
      async () =>
        updateBookSpecification(bookId, editingSpecification.id, data),
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingSpecification(null);
          editForm.reset();
          if (onSpecificationUpdate) onSpecificationUpdate();
        },
        onError: (error) => {
          console.error('Failed to update specification:', error);
        },
        successMessage: 'Specification updated successfully',
        errorMessage: 'Failed to update specification',
      },
    );
  };

  const handleDeleteSpecification = (specificationId: string) => {
    setSpecificationToDelete(specificationId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!specificationToDelete) return;

    deleteMutation(
      async () => deleteBookSpecification(bookId, specificationToDelete),
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSpecificationToDelete(null);
          if (onSpecificationUpdate) onSpecificationUpdate();
        },
        onError: (error) => {
          console.error('Failed to delete specification:', error);
        },
        successMessage: 'Specification deleted successfully',
        errorMessage: 'Failed to delete specification',
      },
    );
  };

  return (
    <div className='space-y-6'>
      <Card className={cn('p-6 space-y-2', className)}>
        <CardHeader className='p-0'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg font-semibold'>
              {title || `Book Specifications (${specifications.length})`}
            </CardTitle>
            <CreateSpecificationDialog bookId={bookId} />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {specifications.length > 0 ? (
            <Table>
              <TableBody className='border-t border-slate-200'>
                {specifications.map((specification) => {
                  return (
                    <TableRow key={specification.id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Tag className='h-4 w-4 text-muted-foreground' />
                          <span className='font-medium'>
                            {specification.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm'>{specification.value}</span>
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
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditSpecification(specification)
                              }
                            >
                              <Edit className='h-4 w-4 mr-2' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-red-600'
                              onClick={() =>
                                handleDeleteSpecification(specification.id)
                              }
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
          ) : (
            <div className='text-center py-8'>
              <Tag className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold'>No specifications yet</h3>
              <p className='text-muted-foreground mb-4'>
                Add specifications to provide detailed book specifications.
              </p>
              <CreateSpecificationDialog bookId={bookId} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Specification Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Edit Specification</DialogTitle>
            <DialogDescription>
              Update the specification information and settings.
            </DialogDescription>
          </DialogHeader>
          {editingSpecification && (
            <UpdateSpecificationForm
              specificationId={editingSpecification.id}
              specification={editingSpecification}
              bookId={bookId}
              onCancel={() => setIsEditDialogOpen(false)}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Specification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this specification? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700'
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
