'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, FileText, Upload, X } from 'lucide-react';
import { ReactNode, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

export interface DataImportProps {
    type: 'csv';
    schema: z.ZodSchema<any>;
    onLoad: (data: any[]) => void;
    onError?: (error: string) => void;
    maxFileSize?: number; // in MB
    acceptedFileTypes?: string[];
    placeholder?: string;
    description?: string;
    sampleData?: any[];
    showSampleDownload?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    sampleDataName?: string;
}

interface ParsedData {
    data: any[];
    errors: string[];
    warnings: string[];
}

export function DataImport({
    type,
    schema,
    onLoad,
    onError,
    maxFileSize = 5,
    acceptedFileTypes = ['.csv'],
    placeholder = 'Choose file to import',
    description = 'Upload a file to import data',
    sampleData,
    showSampleDownload = true,
    children,
    className = '',
    disabled = false,
    sampleDataName = 'sample-data.csv',
}: DataImportProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        resolver: zodResolver(schema as any),
        defaultValues: {},
    });

    const parseCSV = async (csvContent: string): Promise<ParsedData> => {
        const lines = csvContent.split('\n').filter(line => line.trim());
        const data: any[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];

        if (lines.length === 0) {
            errors.push('CSV file is empty');
            return { data, errors, warnings };
        }

        // For large files, process in chunks to avoid webpack cache serialization issues
        const CHUNK_SIZE = 100; // Process 100 rows at a time
        const isLargeFile = lines.length > CHUNK_SIZE;

        if (isLargeFile) {
            console.warn(`Large CSV file detected (${lines.length} rows). Processing in chunks of ${CHUNK_SIZE} to optimize performance.`);
        }

        // Detect header row
        const firstLine = lines[0].toLowerCase();
        const hasHeader = firstLine.includes('email') ||
            firstLine.includes('name') ||
            firstLine.includes('id') ||
            firstLine.includes('address');

        const startIndex = hasHeader ? 1 : 0;

        if (hasHeader && lines.length === 1) {
            warnings.push('CSV file only contains header row');
        }

        // Parse data rows
        const dataRows = lines.slice(startIndex);

        if (isLargeFile) {
            // Process in chunks for large files to reduce memory pressure
            for (let i = 0; i < dataRows.length; i += CHUNK_SIZE) {
                const chunk = dataRows.slice(i, i + CHUNK_SIZE);

                chunk.forEach((line, chunkIndex) => {
                    if (!line.trim()) return;

                    const globalIndex = i + chunkIndex;
                    processRow(line, globalIndex, firstLine, data, errors);
                });

                // Allow event loop to process other tasks between chunks
                if (i + CHUNK_SIZE < dataRows.length) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        } else {
            // Process all rows at once for small files
            dataRows.forEach((line, index) => {
                if (!line.trim()) return;
                processRow(line, index, firstLine, data, errors);
            });
        }

        return { data, errors, warnings };
    };

    const processRow = (line: string, index: number, firstLine: string, data: any[], errors: string[]) => {
        try {
            // Handle CSV parsing with quoted values
            const values = parseCSVLine(line);

            // Create object from CSV row
            const rowData = createRowObject(values, firstLine);

            // Validate with schema
            const validationResult = schema.safeParse(rowData);

            if (validationResult.success) {
                data.push(validationResult.data);
            } else {
                const errorMessages = validationResult.error['errors']
                    .map(err => `${err.path.join('.')}: ${err.message}`)
                    .join(', ');
                errors.push(`Row ${index + 1}: ${errorMessages}`);
            }
        } catch (error) {
            errors.push(`Row ${index + 1}: Failed to parse - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const parseCSVLine = (line: string): string[] => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    };

    const createRowObject = (values: string[], headerLine: string): any => {
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        const obj: any = {};

        values.forEach((value, index) => {
            const key = headers[index] || `column_${index}`;
            obj[key] = value;
        });

        return obj;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (!uploadedFile) return;

        // Reset state
        setErrors([]);
        setWarnings([]);
        setParsedData([]);

        // Validate file type
        const fileExtension = uploadedFile.name.toLowerCase().split('.').pop();
        if (!acceptedFileTypes.some(type => uploadedFile.name.toLowerCase().endsWith(type.replace('.', '')))) {
            const error = `Invalid file type. Please upload a ${acceptedFileTypes.join(', ')} file.`;
            setErrors([error]);
            onError?.(error);
            return;
        }

        // Validate file size
        const fileSizeMB = uploadedFile.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
            const error = `File size must be less than ${maxFileSize}MB`;
            setErrors([error]);
            onError?.(error);
            return;
        }

        setFile(uploadedFile);
        setIsLoading(true);

        try {
            // Read file content
            const csvContent = await readFileAsText(uploadedFile);

            // Parse CSV
            const result = await parseCSV(csvContent);

            setErrors(result.errors);
            setWarnings(result.warnings);
            setParsedData(result.data);

            if (result.data.length > 0) {
                toast.success(`Successfully parsed ${result.data.length} records from CSV`);
                onLoad(result.data);
            }

            if (result.errors.length > 0) {
                toast.error(`Found ${result.errors.length} errors while parsing CSV`);
                onError?.(result.errors.join('; '));
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
            setErrors([errorMessage]);
            onError?.(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                // For large files, process in chunks to avoid webpack cache issues
                if (result.length > 100000) { // ~100KB threshold
                    console.warn('Large file detected, processing in chunks to optimize webpack cache');
                }
                resolve(result);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    };

    const downloadSample = () => {
        if (!sampleData || sampleData.length === 0) return;

        const headers = Object.keys(sampleData[0]);
        const csvContent = [
            headers.join(','),
            ...sampleData.map(row =>
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = sampleDataName || 'sample-data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const clearFile = () => {
        setFile(null);
        setErrors([]);
        setWarnings([]);
        setParsedData([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">{description}</p>
                    {showSampleDownload && sampleData && sampleData.length > 0 && (
                        <p className="text-xs text-gray-500">
                            Download sample template to see the expected format
                        </p>
                    )}
                    <div className="mt-4 space-y-2">
                        <div className="flex gap-2 justify-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={acceptedFileTypes.join(',')}
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={disabled}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled || isLoading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {placeholder}
                            </Button>
                            {showSampleDownload && sampleData && sampleData.length > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={downloadSample}
                                    className="text-blue-600 hover:text-blue-700"
                                    disabled={disabled}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Download Sample
                                </Button>
                            )}
                        </div>
                        {file && (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <FileText className="h-4 w-4" />
                                {file.name}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFile}
                                    className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Parsing file...
                </div>
            )}

            {/* Success Summary */}
            {parsedData.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    <CheckCircle className="h-4 w-4" />
                    Successfully parsed {parsedData.length} valid records
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-1">
                    {warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {warning}
                        </div>
                    ))}
                </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
                <div className="space-y-1">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Content */}
            {children && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}
