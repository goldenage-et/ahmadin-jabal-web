'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { cn } from '@/lib/utils';
import {
  Upload,
  Download,
  Copy,
  Trash2,
  Archive,
  Edit,
  Tag,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  FileText,
  Database,
  Settings,
  Loader2,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface BulkOperationsProps {
  selectedItems: string[];
  onOperationComplete: () => void;
  className?: string;
}

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'edit' | 'export' | 'import' | 'manage';
  requiresConfirmation?: boolean;
  destructive?: boolean;
}

const bulkOperations: BulkOperation[] = [
  {
    id: 'export-csv',
    name: 'Export to CSV',
    description: 'Export selected books to a CSV file',
    icon: Download,
    category: 'export',
  },
  {
    id: 'export-json',
    name: 'Export to JSON',
    description: 'Export selected books to a JSON file',
    icon: Download,
    category: 'export',
  },
  {
    id: 'duplicate',
    name: 'Duplicate Books',
    description: 'Create copies of selected books',
    icon: Copy,
    category: 'edit',
  },
  {
    id: 'archive',
    name: 'Archive Books',
    description: 'Move selected books to archive',
    icon: Archive,
    category: 'manage',
    requiresConfirmation: true,
  },
  {
    id: 'delete',
    name: 'Delete Books',
    description: 'Permanently delete selected books',
    icon: Trash2,
    category: 'manage',
    requiresConfirmation: true,
    destructive: true,
  },
  {
    id: 'update-status',
    name: 'Update Status',
    description: 'Change status of selected books',
    icon: Settings,
    category: 'edit',
  },
  {
    id: 'update-category',
    name: 'Update Category',
    description: 'Change category of selected books',
    icon: Tag,
    category: 'edit',
  },
  {
    id: 'update-price',
    name: 'Update Price',
    description: 'Modify prices of selected books',
    icon: DollarSign,
    category: 'edit',
  },
  {
    id: 'update-inventory',
    name: 'Update Inventory',
    description: 'Modify inventory levels of selected books',
    icon: Package,
    category: 'edit',
  },
];

export default function BulkOperations({
  selectedItems,
  onOperationComplete,
  className,
}: BulkOperationsProps) {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [operationData, setOperationData] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: executeOperation } = useApiMutation();

  const handleOperation = (operationId: string) => {
    const operation = bulkOperations.find((op) => op.id === operationId);
    if (!operation) return;

    setActiveOperation(operationId);
    setOperationData({});
    setIsDialogOpen(true);
  };

  const executeBulkOperation = async (operationId: string, data: any) => {
    setIsProcessing(true);

    try {
      // Simulate API call based on operation type
      switch (operationId) {
        case 'export-csv':
          await exportToCSV(selectedItems);
          break;
        case 'export-json':
          await exportToJSON(selectedItems);
          break;
        case 'duplicate':
          await duplicateBooks(selectedItems, data);
          break;
        case 'archive':
          await archiveBooks(selectedItems);
          break;
        case 'delete':
          await deleteBooks(selectedItems);
          break;
        case 'update-status':
          await updateBookStatus(selectedItems, data.status);
          break;
        case 'update-category':
          await updateBookCategory(selectedItems, data.categoryId);
          break;
        case 'update-price':
          await updateBookPrice(selectedItems, data);
          break;
        case 'update-inventory':
          await updateBookInventory(selectedItems, data);
          break;
        default:
          throw new Error('Unknown operation');
      }

      onOperationComplete();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock API functions - replace with actual API calls
  const exportToCSV = async (itemIds: string[]) => {
    // Simulate CSV export
    const csvContent = `ID,Name,Price,Status\n${itemIds.map((id) => `${id},Book ${id},$29.99,Active`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `books-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = async (itemIds: string[]) => {
    // Simulate JSON export
    const jsonData = itemIds.map((id) => ({
      id,
      name: `Book ${id}`,
      price: 29.99,
      status: 'Active',
    }));
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `books-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const duplicateBooks = async (itemIds: string[], data: any) => {
    // Simulate book duplication
    console.log('Duplicating books:', itemIds, data);
  };

  const archiveBooks = async (itemIds: string[]) => {
    // Simulate book archiving
    console.log('Archiving books:', itemIds);
  };

  const deleteBooks = async (itemIds: string[]) => {
    // Simulate book deletion
    console.log('Deleting books:', itemIds);
  };

  const updateBookStatus = async (itemIds: string[], status: string) => {
    // Simulate status update
    console.log('Updating status:', itemIds, status);
  };

  const updateBookCategory = async (
    itemIds: string[],
    categoryId: string,
  ) => {
    // Simulate category update
    console.log('Updating category:', itemIds, categoryId);
  };

  const updateBookPrice = async (itemIds: string[], data: any) => {
    // Simulate price update
    console.log('Updating price:', itemIds, data);
  };

  const updateBookInventory = async (itemIds: string[], data: any) => {
    // Simulate inventory update
    console.log('Updating inventory:', itemIds, data);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.type === 'application/json') {
          const data = JSON.parse(content);
          console.log('Imported JSON data:', data);
        } else if (file.type === 'text/csv') {
          console.log('Imported CSV data:', content);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderOperationDialog = () => {
    if (!activeOperation) return null;

    const operation = bulkOperations.find((op) => op.id === activeOperation);
    if (!operation) return null;

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <operation.icon className='h-5 w-5' />
              {operation.name}
            </DialogTitle>
            <DialogDescription>{operation.description}</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='p-3 bg-blue-50 rounded-lg'>
              <p className='text-sm text-blue-800'>
                This operation will affect{' '}
                <strong>{selectedItems.length}</strong> selected items.
              </p>
            </div>

            {operation.id === 'update-status' && (
              <div>
                <Label htmlFor='status'>New Status</Label>
                <Select
                  onValueChange={(value) =>
                    setOperationData({ ...operationData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {operation.id === 'update-category' && (
              <div>
                <Label htmlFor='category'>New Category</Label>
                <Select
                  onValueChange={(value) =>
                    setOperationData({ ...operationData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='electronics'>Electronics</SelectItem>
                    <SelectItem value='clothing'>Clothing</SelectItem>
                    <SelectItem value='accessories'>Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {operation.id === 'update-price' && (
              <div className='space-y-3'>
                <div>
                  <Label htmlFor='price-type'>Price Update Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setOperationData({ ...operationData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='set'>
                        Set to specific amount
                      </SelectItem>
                      <SelectItem value='increase'>
                        Increase by amount
                      </SelectItem>
                      <SelectItem value='decrease'>
                        Decrease by amount
                      </SelectItem>
                      <SelectItem value='percentage'>
                        Change by percentage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='price-value'>Value</Label>
                  <Input
                    id='price-value'
                    type='number'
                    step='0.01'
                    placeholder='Enter value'
                    onChange={(e) =>
                      setOperationData({
                        ...operationData,
                        value: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}

            {operation.id === 'update-inventory' && (
              <div className='space-y-3'>
                <div>
                  <Label htmlFor='inventory-type'>Inventory Update Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setOperationData({ ...operationData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='set'>
                        Set to specific amount
                      </SelectItem>
                      <SelectItem value='increase'>
                        Increase by amount
                      </SelectItem>
                      <SelectItem value='decrease'>
                        Decrease by amount
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='inventory-value'>Value</Label>
                  <Input
                    id='inventory-value'
                    type='number'
                    placeholder='Enter value'
                    onChange={(e) =>
                      setOperationData({
                        ...operationData,
                        value: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}

            {operation.id === 'duplicate' && (
              <div>
                <Label htmlFor='duplicate-count'>Number of copies</Label>
                <Input
                  id='duplicate-count'
                  type='number'
                  min='1'
                  max='10'
                  defaultValue='1'
                  onChange={(e) =>
                    setOperationData({
                      ...operationData,
                      count: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            )}

            {operation.requiresConfirmation && (
              <div className='p-3 bg-red-50 rounded-lg'>
                <div className='flex items-center gap-2 text-red-800'>
                  <AlertTriangle className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    This action cannot be undone
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                executeBulkOperation(activeOperation, operationData)
              }
              disabled={isProcessing}
              className={cn(
                operation.destructive && 'bg-red-600 hover:bg-red-700',
              )}
            >
              {isProcessing ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <operation.icon className='h-4 w-4 mr-2' />
                  {operation.name}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const groupedOperations = bulkOperations.reduce(
    (acc, operation) => {
      if (!acc[operation.category]) {
        acc[operation.category] = [];
      }
      acc[operation.category].push(operation);
      return acc;
    },
    {} as Record<string, BulkOperation[]>,
  );

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Bulk Operations
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Perform actions on {selectedItems.length} selected items
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='edit' className='space-y-4'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='edit'>Edit</TabsTrigger>
              <TabsTrigger value='export'>Export</TabsTrigger>
              <TabsTrigger value='import'>Import</TabsTrigger>
              <TabsTrigger value='manage'>Manage</TabsTrigger>
            </TabsList>

            <TabsContent value='edit' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {groupedOperations.edit?.map((operation) => (
                  <Card
                    key={operation.id}
                    className='cursor-pointer hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-blue-100 rounded-lg'>
                          <operation.icon className='h-5 w-5 text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-medium'>{operation.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {operation.description}
                          </p>
                        </div>
                        <Button
                          size='sm'
                          onClick={() => handleOperation(operation.id)}
                        >
                          Execute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='export' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {groupedOperations.export?.map((operation) => (
                  <Card
                    key={operation.id}
                    className='cursor-pointer hover:shadow-md transition-shadow'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-green-100 rounded-lg'>
                          <operation.icon className='h-5 w-5 text-green-600' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-medium'>{operation.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {operation.description}
                          </p>
                        </div>
                        <Button
                          size='sm'
                          onClick={() => handleOperation(operation.id)}
                        >
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='import' className='space-y-4'>
              <Card>
                <CardContent className='p-6'>
                  <div className='text-center space-y-4'>
                    <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center'>
                      <Upload className='h-8 w-8 text-gray-400' />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold'>Import Books</h3>
                      <p className='text-muted-foreground'>
                        Upload a CSV or JSON file to import books
                      </p>
                    </div>
                    <div className='flex gap-2 justify-center'>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      >
                        <Upload className='h-4 w-4 mr-2' />
                        Choose File
                      </Button>
                      <Button variant='outline'>
                        <FileText className='h-4 w-4 mr-2' />
                        Download Template
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='.csv,.json'
                      onChange={handleFileImport}
                      className='hidden'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Supports CSV and JSON formats • Max 10MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='manage' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {groupedOperations.manage?.map((operation) => (
                  <Card
                    key={operation.id}
                    className={cn(
                      'cursor-pointer hover:shadow-md transition-shadow',
                      operation.destructive && 'border-red-200',
                    )}
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            operation.destructive
                              ? 'bg-red-100'
                              : 'bg-orange-100',
                          )}
                        >
                          <operation.icon
                            className={cn(
                              'h-5 w-5',
                              operation.destructive
                                ? 'text-red-600'
                                : 'text-orange-600',
                            )}
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-medium'>{operation.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {operation.description}
                          </p>
                        </div>
                        <Button
                          size='sm'
                          variant={
                            operation.destructive ? 'destructive' : 'default'
                          }
                          onClick={() => handleOperation(operation.id)}
                        >
                          Execute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {renderOperationDialog()}
    </div>
  );
}
