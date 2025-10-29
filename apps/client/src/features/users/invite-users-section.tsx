'use client';

import { inviteUsers } from '@/actions/users.action';
import { DataImport } from '@/components/data-import';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { EUserRole } from '@repo/common';
import { Mail, Plus, Send, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const inviteSchema = z.object({
    emails: z.array(z.email('Invalid email address')).min(1, 'At least one email is required'),
    roles: z.array(z.enum(EUserRole))
});

type InviteFormData = z.infer<typeof inviteSchema>;

// Schema for CSV import validation
const emailImportSchema = z.object({
    email: z.email('Invalid email address'),
});

type EmailImportData = z.infer<typeof emailImportSchema>;

export function InviteUsersSection() {
    const { mutate, isLoading } = useApiMutation();
    const [emailInput, setEmailInput] = useState('');
    const [importMode, setImportMode] = useState<'manual' | 'csv'>('manual');
    const router = useRouter();

    const form = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            emails: [],
            roles: [EUserRole.user],
        },
    });

    const emails = form.watch('emails');

    const handleCSVImport = (importedData: EmailImportData[]) => {
        const importedEmails = importedData.map(item => item.email);
        const existingEmails = form.getValues('emails');
        const newEmails = importedEmails.filter(email => !existingEmails.includes(email));

        form.setValue('emails', [...existingEmails, ...newEmails]);

        toast.success(`Successfully imported ${newEmails.length} email addresses from CSV`);
    };

    const addEmail = () => {
        if (emailInput.trim() && !emails.includes(emailInput.trim())) {
            form.setValue('emails', [...emails, emailInput.trim()]);
            setEmailInput('');
        }
    };

    const clearAllEmails = () => {
        form.setValue('emails', []);
    };

    const removeEmail = (emailToRemove: string) => {
        form.setValue('emails', emails.filter(email => email !== emailToRemove));
    };

    // Sample data for CSV template
    const sampleEmailData = [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' },
        { email: 'user3@example.com' }
    ];


    const onSubmit = async (data: InviteFormData) => {
        mutate(() => inviteUsers(data), {
            successMessage: `Successfully invited ${data.emails.length} user(s)`,
            errorMessage: 'Failed to send invitations',
        });
    };

    const roles = [
        { value: EUserRole.user, label: 'User' },
        { value: EUserRole.admin, label: 'Admin' },
        { value: EUserRole.superAdmin, label: 'Super Admin' },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Invite System Users
                </CardTitle>
                <CardDescription>
                    Send invitations to new users to join the system
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Import Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={importMode === 'manual' ? 'default' : 'outline'}
                                onClick={() => setImportMode('manual')}
                                className="flex-1"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Manual Entry
                            </Button>
                            <Button
                                type="button"
                                variant={importMode === 'csv' ? 'default' : 'outline'}
                                onClick={() => setImportMode('csv')}
                                className="flex-1"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                CSV Import
                            </Button>
                        </div>
                        {importMode === 'manual' && (
                            <div className="space-y-4">
                                <FormLabel>Email Addresses</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addEmail();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addEmail}
                                        size="icon"
                                        disabled={!emailInput.trim() || emails.includes(emailInput.trim())}
                                        className="border border-border h-9"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                            </div>
                        )}


                        {importMode === 'csv' && (
                            <div className="space-y-4">
                                <FormLabel>Upload CSV File</FormLabel>
                                <DataImport
                                    type="csv"
                                    schema={emailImportSchema}
                                    onLoad={handleCSVImport}
                                    description="Upload a CSV file with email addresses"
                                    placeholder="Choose CSV file"
                                    sampleData={sampleEmailData}
                                    showSampleDownload={true}
                                    maxFileSize={5}
                                    acceptedFileTypes={['.csv']}
                                    sampleDataName={`invite-users-sample.csv`}
                                />
                            </div>
                        )}

                        {/* Email Tags Display */}
                        {emails.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Selected Email Addresses ({emails.length})</FormLabel>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllEmails}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Clear All
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded-md p-3">
                                    {emails.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                                        >
                                            <span>{email}</span>
                                            <Button
                                                type="button"
                                                variant={'ghost'}
                                                size="icon"
                                                onClick={() => removeEmail(email)}
                                                className="h-5 w-5 p-0 hover:bg-primary/20"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="emails"
                            render={() => (
                                <FormItem>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Role Selection */}
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Role</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(field.value.includes(value as EUserRole) ? field.value.filter((role) => role !== value as EUserRole) : [...field.value, value as EUserRole])}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {field.value.map((role) => (
                                        <div key={role}>
                                            {role}
                                        </div>
                                    ))}
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading || emails.length === 0}>
                                <Send className="h-4 w-4 mr-2" />
                                {isLoading ? 'Sending...' : `Send ${emails.length} Invitation${emails.length !== 1 ? 's' : ''}`}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
