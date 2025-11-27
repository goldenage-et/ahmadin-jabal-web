'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TUserBasic, TUserQueryFilter } from '@repo/common';
import { QueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  ChevronDown,
  Eye,
  Filter,
  Mail,
  Phone,
  Shield,
  ToggleLeft,
  ToggleRight,
  User,
  XCircle,
  XCircle as XCircleIcon
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';

interface UsersDataTableProps {
  data: TUserBasic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: TUserQueryFilter;
  onView: (user: TUserBasic) => void;
  onFiltersChange: (filters: Partial<TUserQueryFilter>) => void;
  queryClient: QueryClient;
  isDataLoading?: boolean;
}

export function UsersDataTable({
  data,
  total,
  page,
  limit,
  totalPages,
  filters,
  onView,
  onFiltersChange,
  queryClient,
  isDataLoading = false,
}: UsersDataTableProps) {
  // Ensure filters has the correct type with defaults
  const typedFilters: TUserQueryFilter = {
    ...filters,
    page: filters.page || 1,
    limit: filters.limit || 10,
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
  };

  // Check if any filters are applied (excluding default pagination and sorting)
  const hasActiveFilters = !!(
    typedFilters.search ||
    typedFilters.active !== undefined ||
    typedFilters.roles
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    phone: false,
    emailVerified: false,
    systemOwner: false,
    createdAt: false,
    updatedAt: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const handleToggleStatus = async (
    userId: string,
    userName: string,
    currentStatus: boolean,
  ) => {
    try {
      setIsLoading(true);
      // await toggleUserStatus(userId, { active: !currentStatus });

      await queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(
        `User ${userName} ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      );
    } catch (error: any) {
      toast.error(error?.details?.message || 'Failed to toggle user status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (columnId: string) => {
    const currentSortBy = typedFilters.sortBy || 'createdAt';
    const currentSortOrder = typedFilters.sortOrder || 'desc';

    let newSortBy = columnId as
      | 'firstName'
      | 'email'
      | 'roles'
      | 'active'
      | 'createdAt';
    let newSortOrder: 'asc' | 'desc' = 'asc';

    // If clicking the same column, toggle sort order
    if (currentSortBy === columnId) {
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    }

    onFiltersChange({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  const columns: ColumnDef<TUserBasic>[] = [
    {
      accessorKey: 'firstName',
      header: ({ column }) => (
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none'
          onClick={() => handleSort(column.id)}
        >
          Name
          {typedFilters.sortBy === column.id &&
            (typedFilters.sortOrder === 'asc' ? (
              <ArrowUp className='h-3 w-3 text-blue-600' />
            ) : (
              <ArrowDown className='h-3 w-3 text-blue-600' />
            ))}
          {typedFilters.sortBy !== column.id && (
            <ArrowUpDown className='h-3 w-3 text-gray-400' />
          )}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-100'>
              <User className='w-4 h-4 text-gray-600' />
            </div>
            <div>
              <div className='font-medium'>
                {user.firstName} {user.middleName} {user.lastName}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none'
          onClick={() => handleSort(column.id)}
        >
          Email
          {typedFilters.sortBy === column.id &&
            (typedFilters.sortOrder === 'asc' ? (
              <ArrowUp className='h-3 w-3 text-blue-600' />
            ) : (
              <ArrowDown className='h-3 w-3 text-blue-600' />
            ))}
          {typedFilters.sortBy !== column.id && (
            <ArrowUpDown className='h-3 w-3 text-gray-400' />
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Mail className='w-4 h-4 text-muted-foreground' />
          <span>{row.getValue('email')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return phone ? (
          <div className='flex items-center gap-2'>
            <Phone className='w-4 h-4 text-muted-foreground' />
            <span>{phone}</span>
          </div>
        ) : (
          <span className='text-muted-foreground'>-</span>
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none'
          onClick={() => handleSort(column.id)}
        >
          Role
          {typedFilters.sortBy === column.id &&
            (typedFilters.sortOrder === 'asc' ? (
              <ArrowUp className='h-3 w-3 text-blue-600' />
            ) : (
              <ArrowDown className='h-3 w-3 text-blue-600' />
            ))}
          {typedFilters.sortBy !== column.id && (
            <ArrowUpDown className='h-3 w-3 text-gray-400' />
          )}
        </div>
      ),
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant='secondary' className='capitalize'>
            <Shield className='w-3 h-3 mr-1' />
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none'
          onClick={() => handleSort(column.id)}
        >
          Status
          {typedFilters.sortBy === column.id &&
            (typedFilters.sortOrder === 'asc' ? (
              <ArrowUp className='h-3 w-3 text-blue-600' />
            ) : (
              <ArrowDown className='h-3 w-3 text-blue-600' />
            ))}
          {typedFilters.sortBy !== column.id && (
            <ArrowUpDown className='h-3 w-3 text-gray-400' />
          )}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('active') as boolean;
        return (
          <div className='flex items-center gap-2'>
            {isActive ? (
              <CheckCircle className='w-4 h-4 text-green-600' />
            ) : (
              <XCircle className='w-4 h-4 text-red-600' />
            )}
            <Badge variant={isActive ? 'default' : 'destructive'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'emailVerified',
      header: 'Email Verified',
      cell: ({ row }) => {
        const verified = row.getValue('emailVerified') as boolean;
        return (
          <div className='flex items-center gap-2'>
            {verified ? (
              <CheckCircle className='w-4 h-4 text-green-600' />
            ) : (
              <XCircle className='w-4 h-4 text-red-600' />
            )}
            <Badge variant={verified ? 'default' : 'secondary'}>
              {verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'systemOwner',
      header: 'System Owner',
      cell: ({ row }) => {
        const isOwner = row.getValue('systemOwner') as boolean;
        return isOwner ? (
          <Badge
            variant='outline'
            className='text-orange-600 border-orange-200'
          >
            <Shield className='w-3 h-3 mr-1' />
            Owner
          </Badge>
        ) : (
          <span className='text-muted-foreground'>-</span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div
          className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none'
          onClick={() => handleSort(column.id)}
        >
          Created At
          {typedFilters.sortBy === column.id &&
            (typedFilters.sortOrder === 'asc' ? (
              <ArrowUp className='h-3 w-3 text-blue-600' />
            ) : (
              <ArrowDown className='h-3 w-3 text-blue-600' />
            ))}
          {typedFilters.sortBy !== column.id && (
            <ArrowUpDown className='h-3 w-3 text-gray-400' />
          )}
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return date ? (
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm'>
              {format(new Date(date), 'MMM dd, yyyy')}
            </span>
          </div>
        ) : (
          <span className='text-muted-foreground'>-</span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onView(user)}
              className='h-8 w-8 p-0'
            >
              <Eye className='h-4 w-4' />
              <span className='sr-only'>View user details</span>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                handleToggleStatus(
                  user.id,
                  `${user.firstName} ${user.lastName}`,
                  user.active,
                )
              }
              disabled={isLoading}
              className='h-8 w-8 p-0'
            >
              {user.active ? (
                <ToggleRight className='h-4 w-4 text-green-600' />
              ) : (
                <ToggleLeft className='h-4 w-4 text-gray-400' />
              )}
              <span className='sr-only'>
                {user.active ? 'Deactivate user' : 'Activate user'}
              </span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full'>
      {/* Search and Results Summary */}
      <div className='flex items-center justify-between p-4 border rounded-lg bg-gray-50'>
        <div className='flex items-center gap-4'>
          {/* Search Input */}
          <div className='min-w-[300px]'>
            <Input
              placeholder='Search users...'
              value={typedFilters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className='w-full'
            />
          </div>
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                onFiltersChange({
                  search: '',
                  active: undefined,
                  roles: [],
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                })
              }
              className='flex items-center gap-2'
            >
              <XCircleIcon className='h-4 w-4' />
              Clear
            </Button>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-muted-foreground'>
            Showing {data.length} of {total} users (Page {page} of {totalPages})
          </div>
          {hasActiveFilters && (
            <div className='text-sm text-blue-600 font-medium'>
              {data.length === 0
                ? 'No results found'
                : `${data.length} result${data.length === 1 ? '' : 's'} found`}
            </div>
          )}
        </div>
      </div>

      {/* Table Controls */}
      <div className='flex items-center py-4 gap-4'>
        <div className='flex items-center gap-2 ml-auto'>
          {/* Filters Dropdown */}
          <DropdownMenu
            open={filtersModalOpen}
            onOpenChange={setFiltersModalOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex items-center gap-2'>
                <Filter className='h-4 w-4' />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant='secondary'
                    className='ml-1 h-5 w-5 rounded-full p-0 text-xs'
                  >
                    !
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80 p-4'>
              <div className='space-y-4'>
                <div className='space-y-3'>
                  {/* Status Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Status</label>
                    <Select
                      value={
                        typedFilters.active !== undefined
                          ? typedFilters.active.toString()
                          : 'all'
                      }
                      onValueChange={(value) =>
                        onFiltersChange({
                          active:
                            value === 'all' ? undefined : value === 'true',
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='All Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='true'>Active</SelectItem>
                        <SelectItem value='false'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role Filter */}
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Role</label>
                    {/* <Select
                      value={typedFilters.roles}
                      onValueChange={(value) =>
                        onFiltersChange({
                          roles: value === 'all' ? undefined : (value as any),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='All Roles' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Roles</SelectItem>
                        <SelectItem value='user'>User</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='superadmin'>Super Admin</SelectItem>
                      </SelectContent>
                    </Select> */}
                    {typedFilters.roles?.map((role) => (
                      <Badge key={role} variant='secondary' className='capitalize'>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className='flex justify-end pt-3 border-t'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        onFiltersChange({
                          search: '',
                          active: undefined,
                          roles: [],
                          sortBy: 'createdAt',
                          sortOrder: 'desc',
                        });
                        setFiltersModalOpen(false);
                      }}
                      className='flex items-center gap-2'
                    >
                      <XCircleIcon className='h-4 w-4' />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Columns Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                Columns <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
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
            {isDataLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center text-muted-foreground'
                >
                  <div className='flex items-center justify-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900'></div>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
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
                  className='h-24 text-center text-muted-foreground'
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-2 py-4'>
          <div className='flex items-center gap-2'>
            <p className='text-sm text-muted-foreground'>
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, total)} of {total} users
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onFiltersChange({ page: page - 1 })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => onFiltersChange({ page: pageNum })}
                    className='w-8 h-8 p-0'
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onFiltersChange({ page: page + 1 })}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
