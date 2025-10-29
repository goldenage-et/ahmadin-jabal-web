'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Plus,
  Trash2,
  Edit,
  Copy,
  Eye,
  Package,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Grid3X3,
  Settings,
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface VariantOption {
  id: string;
  name: string;
  values: VariantValue[];
  displayType: 'swatch' | 'dropdown' | 'button';
  required: boolean;
}

interface VariantValue {
  id: string;
  name: string;
  color?: string;
  image?: string;
  priceModifier?: number;
}

interface VariantCombination {
  id: string;
  values: { [optionId: string]: string };
  price: number;
  sku: string;
  quantity: number;
  images: string[];
  enabled: boolean;
}

interface VariantMatrixProps {
  bookId: string;
  basePrice: number;
  onVariantsChange: (variants: VariantCombination[]) => void;
}

export default function VariantMatrix({
  bookId,
  basePrice,
  onVariantsChange,
}: VariantMatrixProps) {
  const [options, setOptions] = useState<VariantOption[]>([
    {
      id: 'color',
      name: 'Color',
      values: [
        { id: 'red', name: 'Red', color: '#ef4444' },
        { id: 'blue', name: 'Blue', color: '#3b82f6' },
        { id: 'green', name: 'Green', color: '#10b981' },
      ],
      displayType: 'swatch',
      required: true,
    },
    {
      id: 'size',
      name: 'Size',
      values: [
        { id: 'small', name: 'Small' },
        { id: 'medium', name: 'Medium' },
        { id: 'large', name: 'Large' },
      ],
      displayType: 'button',
      required: true,
    },
  ]);

  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [selectedCombinations, setSelectedCombinations] = useState<string[]>(
    [],
  );
  const [editingCombination, setEditingCombination] = useState<string | null>(
    null,
  );

  // Generate all possible combinations
  const generateCombinations = useMemo(() => {
    if (options.length === 0) return [];

    const generate = (
      optionIndex: number,
      currentValues: { [optionId: string]: string },
    ): VariantCombination[] => {
      if (optionIndex >= options.length) {
        const combinationId = Object.values(currentValues).join('-');
        const existingCombination = combinations.find(
          (c) => c.id === combinationId,
        );

        return [
          {
            id: combinationId,
            values: { ...currentValues },
            price: existingCombination?.price || basePrice,
            sku: existingCombination?.sku || `${bookId}-${combinationId}`,
            quantity: existingCombination?.quantity || 0,
            images: existingCombination?.images || [],
            enabled: existingCombination?.enabled ?? true,
          },
        ];
      }

      const option = options[optionIndex];
      const results: VariantCombination[] = [];

      for (const value of option.values) {
        const newValues = { ...currentValues, [option.id]: value.id };
        results.push(...generate(optionIndex + 1, newValues));
      }

      return results;
    };

    return generate(0, {});
  }, [options, combinations, basePrice, bookId]);

  // Update combinations when options change
  useState(() => {
    setCombinations(generateCombinations);
    onVariantsChange(generateCombinations);
  });

  const addOption = () => {
    const newOption: VariantOption = {
      id: `option-${Date.now()}`,
      name: 'New Option',
      values: [
        { id: 'value-1', name: 'Value 1' },
        { id: 'value-2', name: 'Value 2' },
      ],
      displayType: 'button',
      required: true,
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (optionId: string) => {
    setOptions(options.filter((opt) => opt.id !== optionId));
  };

  const addValue = (optionId: string) => {
    setOptions(
      options.map((option) => {
        if (option.id === optionId) {
          const newValue: VariantValue = {
            id: `value-${Date.now()}`,
            name: 'New Value',
          };
          return { ...option, values: [...option.values, newValue] };
        }
        return option;
      }),
    );
  };

  const removeValue = (optionId: string, valueId: string) => {
    setOptions(
      options.map((option) => {
        if (option.id === optionId) {
          return {
            ...option,
            values: option.values.filter((val) => val.id !== valueId),
          };
        }
        return option;
      }),
    );
  };

  const updateCombination = (
    combinationId: string,
    updates: Partial<VariantCombination>,
  ) => {
    setCombinations(
      combinations.map((combo) =>
        combo.id === combinationId ? { ...combo, ...updates } : combo,
      ),
    );
  };

  const handleSelectCombination = (combinationId: string) => {
    setSelectedCombinations((prev) =>
      prev.includes(combinationId)
        ? prev.filter((id) => id !== combinationId)
        : [...prev, combinationId],
    );
  };

  const handleSelectAll = () => {
    if (selectedCombinations.length === combinations.length) {
      setSelectedCombinations([]);
    } else {
      setSelectedCombinations(combinations.map((c) => c.id));
    }
  };

  const getCombinationDisplayName = (combination: VariantCombination) => {
    return Object.entries(combination.values)
      .map(([optionId, valueId]) => {
        const option = options.find((opt) => opt.id === optionId);
        const value = option?.values.find((val) => val.id === valueId);
        return value?.name || valueId;
      })
      .join(' / ');
  };

  const getInventoryStatus = (quantity: number) => {
    if (quantity === 0)
      return {
        status: 'out-of-stock',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      };
    if (quantity <= 10)
      return {
        status: 'low-stock',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      };
    return {
      status: 'in-stock',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  };

  return (
    <div className='space-y-6'>
      {/* Options Configuration */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='h-5 w-5' />
                Variant Options
              </CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Configure the options that create different variants (e.g.,
                Color, Size, Material)
              </p>
            </div>
            <Button onClick={addOption} size='sm'>
              <Plus className='h-4 w-4 mr-2' />
              Add Option
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {options.map((option, optionIndex) => (
              <Card key={option.id} className='border border-gray-200'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <Input
                        value={option.name}
                        onChange={(e) =>
                          setOptions(
                            options.map((opt) =>
                              opt.id === option.id
                                ? { ...opt, name: e.target.value }
                                : opt,
                            ),
                          )
                        }
                        className='font-medium'
                      />
                      <Select
                        value={option.displayType}
                        onValueChange={(
                          value: 'swatch' | 'dropdown' | 'button',
                        ) =>
                          setOptions(
                            options.map((opt) =>
                              opt.id === option.id
                                ? { ...opt, displayType: value }
                                : opt,
                            ),
                          )
                        }
                      >
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='swatch'>Swatch</SelectItem>
                          <SelectItem value='dropdown'>Dropdown</SelectItem>
                          <SelectItem value='button'>Button</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Checkbox
                        checked={option.required}
                        onCheckedChange={(checked) =>
                          setOptions(
                            options.map((opt) =>
                              opt.id === option.id
                                ? { ...opt, required: !!checked }
                                : opt,
                            ),
                          )
                        }
                      />
                      <Label className='text-sm'>Required</Label>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeOption(option.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm font-medium'>Values</Label>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => addValue(option.id)}
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        Add Value
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                      {option.values.map((value) => (
                        <div
                          key={value.id}
                          className='flex items-center gap-2 p-2 border rounded-lg'
                        >
                          {option.displayType === 'swatch' && value.color && (
                            <div
                              className='w-4 h-4 rounded-full border'
                              style={{ backgroundColor: value.color }}
                            />
                          )}
                          <Input
                            value={value.name}
                            onChange={(e) =>
                              setOptions(
                                options.map((opt) =>
                                  opt.id === option.id
                                    ? {
                                        ...opt,
                                        values: opt.values.map((val) =>
                                          val.id === value.id
                                            ? { ...val, name: e.target.value }
                                            : val,
                                        ),
                                      }
                                    : opt,
                                ),
                              )
                            }
                            className='flex-1 text-sm'
                          />
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => removeValue(option.id, value.id)}
                            className='text-red-600 hover:text-red-700 p-1'
                          >
                            <XCircle className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Variant Matrix */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Grid3X3 className='h-5 w-5' />
                Variant Matrix
              </CardTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                {combinations.length} possible combinations generated
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm'>
                <Copy className='h-4 w-4 mr-2' />
                Duplicate Selected
              </Button>
              <Button variant='outline' size='sm' className='text-red-600'>
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-96 w-full'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-12'>
                    <Checkbox
                      checked={
                        selectedCombinations.length === combinations.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='w-12'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {combinations.map((combination) => {
                  const inventoryStatus = getInventoryStatus(
                    combination.quantity,
                  );

                  return (
                    <TableRow
                      key={combination.id}
                      className={cn(!combination.enabled && 'opacity-50')}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCombinations.includes(
                            combination.id,
                          )}
                          onCheckedChange={() =>
                            handleSelectCombination(combination.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {Object.entries(combination.values).map(
                            ([optionId, valueId]) => {
                              const option = options.find(
                                (opt) => opt.id === optionId,
                              );
                              const value = option?.values.find(
                                (val) => val.id === valueId,
                              );

                              if (
                                option?.displayType === 'swatch' &&
                                value?.color
                              ) {
                                return (
                                  <div
                                    key={`${optionId}-${valueId}`}
                                    className='w-4 h-4 rounded-full border'
                                    style={{ backgroundColor: value.color }}
                                    title={value.name}
                                  />
                                );
                              }
                              return null;
                            },
                          )}
                          <span className='font-medium'>
                            {getCombinationDisplayName(combination)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          step='0.01'
                          value={combination.price}
                          onChange={(e) =>
                            updateCombination(combination.id, {
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className='w-20'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={combination.sku}
                          onChange={(e) =>
                            updateCombination(combination.id, {
                              sku: e.target.value,
                            })
                          }
                          className='w-32 font-mono text-sm'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={combination.quantity}
                          onChange={(e) =>
                            updateCombination(combination.id, {
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                          className='w-20'
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className={cn(
                            'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium',
                            inventoryStatus.bgColor,
                            inventoryStatus.color,
                          )}
                        >
                          {inventoryStatus.status === 'out-of-stock' ? (
                            <XCircle className='h-3 w-3' />
                          ) : inventoryStatus.status === 'low-stock' ? (
                            <AlertTriangle className='h-3 w-3' />
                          ) : (
                            <CheckCircle className='h-3 w-3' />
                          )}
                          {inventoryStatus.status === 'out-of-stock'
                            ? 'Out of Stock'
                            : inventoryStatus.status === 'low-stock'
                              ? 'Low Stock'
                              : 'In Stock'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              setEditingCombination(
                                editingCombination === combination.id
                                  ? null
                                  : combination.id,
                              )
                            }
                          >
                            <Edit className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              updateCombination(combination.id, {
                                enabled: !combination.enabled,
                              })
                            }
                          >
                            {combination.enabled ? (
                              <Eye className='h-3 w-3' />
                            ) : (
                              <Package className='h-3 w-3' />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {combinations.length}
              </div>
              <div className='text-sm text-muted-foreground'>
                Total Combinations
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {combinations.filter((c) => c.enabled).length}
              </div>
              <div className='text-sm text-muted-foreground'>Enabled</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {
                  combinations.filter((c) => c.quantity > 0 && c.quantity <= 10)
                    .length
                }
              </div>
              <div className='text-sm text-muted-foreground'>Low Stock</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {combinations.filter((c) => c.quantity === 0).length}
              </div>
              <div className='text-sm text-muted-foreground'>Out of Stock</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
