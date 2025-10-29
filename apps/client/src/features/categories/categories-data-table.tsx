'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TCategory } from '@repo/common';
import { getImageUrl } from '@/lib/file-upload';

interface CategoriesDataTableProps {
  data: TCategory[];
  onEdit: (category: TCategory) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export function CategoriesDataTable({
  data,
  onEdit,
  onDelete,
  onBulkDelete,
}: CategoriesDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Helper function to find parent category name
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId) return 'Root Category';
    const parent = data.find((cat) => cat.id === parentId);
    return parent ? parent.name : 'Unknown Parent';
  };

  // Helper function to get category level (depth in hierarchy)
  const getCategoryLevel = (
    category: TCategory,
    visited = new Set<string>(),
    depth = 0,
  ): number => {
    if (!category.parentId) return 0;

    // Prevent infinite recursion
    if (visited.has(category.id) || depth > 10) return 0;

    visited.add(category.id);
    const parent = data.find((cat) => cat.id === category.parentId);
    return parent ? getCategoryLevel(parent, visited, depth + 1) + 1 : 0;
  };

  const columns: ColumnDef<TCategory>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-8 px-2 lg:px-3'
          >
            Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const level = getCategoryLevel(row.original);
        const category = row.original;
        return (
          <div className='flex items-center space-x-2'>
            <div
              className='w-2 h-2 rounded-full bg-primary'
              style={{ marginLeft: `${level * 16}px` }}
            />
            <div className='flex items-center space-x-2'>
              {category.iconName && (
                <div className='w-4 h-4 flex items-center justify-center'>
                  {(() => {
                    const IconComponent = (LucideIcons as any)[
                      category.iconName
                    ];
                    return IconComponent ? (
                      <IconComponent size={16} />
                    ) : (
                      <LucideIcons.Package size={16} />
                    );
                  })()}
                </div>
              )}
              <span className='font-medium'>{row.getValue('name')}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const image = row.getValue('image') as any;
        const imageUrl = image?.url || null;
        return (
          <div className='flex items-center justify-center'>
            {imageUrl ? (
              <img
                src={getImageUrl(imageUrl)}
                alt={image?.alt || row.original.name}
                className='w-12 h-12 object-cover rounded-md border'
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove(
                    'hidden',
                  );
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 flex items-center justify-center bg-muted rounded-md border ${imageUrl ? 'hidden' : ''}`}
            >
              <ImageIcon className='w-4 h-4 text-muted-foreground' />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'iconName',
      header: 'Icon',
      cell: ({ row }) => {
        const iconName = row.getValue('iconName') as string;
        return (
          <div className='flex items-center justify-center'>
            {iconName ? (
              <div className='w-8 h-8 flex items-center justify-center bg-muted rounded-md'>
                {(() => {
                  const IconComponent = (LucideIcons as any)[iconName];
                  return IconComponent ? (
                    <IconComponent size={20} />
                  ) : (
                    <LucideIcons.Package size={20} />
                  );
                })()}
              </div>
            ) : (
              <div className='w-8 h-8 flex items-center justify-center bg-muted rounded-md'>
                <LucideIcons.Package
                  size={16}
                  className='text-muted-foreground'
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'backgroundColor',
      header: 'Color',
      cell: ({ row }) => {
        const backgroundColor = row.getValue('backgroundColor') as string;
        return (
          <div className='flex items-center justify-center'>
            {backgroundColor ? (
              <div
                className='w-8 h-8 rounded-md border border-gray-300'
                style={{ backgroundColor }}
                title={backgroundColor}
              />
            ) : (
              <div className='w-8 h-8 flex items-center justify-center bg-muted rounded-md'>
                <Palette className='w-4 h-4 text-muted-foreground' />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return (
          <div className='max-w-[300px] truncate text-muted-foreground'>
            {description || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'parentId',
      header: 'Parent Category',
      cell: ({ row }) => {
        const parentId = row.getValue('parentId') as string | null;
        const parentName = getParentName(parentId);
        return (
          <Badge variant={parentId ? 'secondary' : 'default'}>
            {parentName}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-8 px-2 lg:px-3'
          >
            Created
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div className='text-sm'>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(category.id)}
              >
                Copy category ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(category.id)}
                className='text-destructive'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Empty state
  if (data.length === 0) {
    return (
      <div className='rounded-md border p-8 text-center'>
        <p className='text-muted-foreground'>
          No categories found. Create your first category to get started.
        </p>
      </div>
    );
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  return (
    <div className='w-full space-y-4'>
      {/* Toolbar */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <Input
            placeholder='Filter categories...'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
          {selectedIds.length > 0 && onBulkDelete && (
            <Button
              variant='destructive'
              size='sm'
              onClick={() => onBulkDelete(selectedIds)}
              className='h-8'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='ml-auto h-8'>
                <Eye className='mr-2 h-4 w-4' />
                View
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className='h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm'
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <ChevronDown className='h-4 w-4 rotate-90' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <ChevronDown className='h-4 w-4 rotate-90' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <ChevronDown className='h-4 w-4 -rotate-90' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <ChevronDown className='h-4 w-4 -rotate-90' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
