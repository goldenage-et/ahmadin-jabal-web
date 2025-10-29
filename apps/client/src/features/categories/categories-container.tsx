'use client';

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/actions/categories.action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TCategory, TCreateCategory, TUpdateCategory } from '@repo/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { CategoriesDataTable } from './categories-data-table';
import { CategoryModal } from './category-modal';

type TCategoriesContainerProps = {
  categories: TCategory[];
};

export function CategoriesContainer({ categories }: TCategoriesContainerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(
    null,
  );
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{
    isOpen: boolean;
    ids: string[];
  }>({ isOpen: false, ids: [] });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: TCreateCategory) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      setIsModalOpen(false);
      // Small delay to ensure server has processed the changes
      setTimeout(() => router.refresh(), 100);
    },
    onError: (error: any) => {
      // Handle API error response structure
      const errorMessage =
        error?.details?.message ||
        error?.message ||
        'Failed to create category';
      toast.error(errorMessage);
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TUpdateCategory }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      setIsModalOpen(false);
      setEditingCategory(null);
      // Small delay to ensure server has processed the changes
      setTimeout(() => router.refresh(), 100);
    },
    onError: (error: any) => {
      // Handle API error response structure
      const errorMessage =
        error?.details?.message ||
        error?.message ||
        'Failed to update category';
      toast.error(errorMessage);
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
      // Small delay to ensure server has processed the changes
      setTimeout(() => router.refresh(), 100);
    },
    onError: (error: any) => {
      // Handle API error response structure
      const errorMessage =
        error?.details?.message ||
        error?.message ||
        'Failed to delete category';
      toast.error(errorMessage);
    },
  });

  // Bulk delete categories mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map((id) => deleteCategory(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(
        `${bulkDeleteDialog.ids.length} categories deleted successfully`,
      );
      setBulkDeleteDialog({ isOpen: false, ids: [] });
      // Small delay to ensure server has processed the changes
      setTimeout(() => router.refresh(), 100);
    },
    onError: (error: any) => {
      // Handle API error response structure
      const errorMessage =
        error?.details?.message ||
        error?.message ||
        'Failed to delete categories';
      toast.error(errorMessage);
    },
  });

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setBulkDeleteDialog({ isOpen: true, ids });
  };

  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(bulkDeleteDialog.ids);
  };

  const handleSubmit = (data: TCreateCategory | TUpdateCategory) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data as TCreateCategory);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon');
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    toast.info('Import functionality coming soon');
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>Categories</h2>
          <p className='text-sm text-muted-foreground'>
            Manage your book categories and their hierarchy
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm' onClick={handleImport}>
            <Upload className='mr-2 h-4 w-4' />
            Import
          </Button>
          <Button variant='outline' size='sm' onClick={handleExport}>
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Category
          </Button>
        </div>
      </div>

      <CategoriesDataTable
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingCategory || undefined}
        categories={categories}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialog.isOpen}
        onOpenChange={(open) => setBulkDeleteDialog({ isOpen: open, ids: [] })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Categories</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {bulkDeleteDialog.ids.length}{' '}
              categories? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setBulkDeleteDialog({ isOpen: false, ids: [] })}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
