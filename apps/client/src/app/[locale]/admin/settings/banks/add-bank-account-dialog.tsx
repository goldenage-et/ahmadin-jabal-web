'use client';

import { createBankAccount } from '@/actions/bank-account.action';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { BANK_ACCOUNT, TCreateBankAccount, ZCreateBankAccount } from '@repo/common';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function AddBankAccountDialog() {
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<TCreateBankAccount>({
        resolver: zodResolver(ZCreateBankAccount),
        defaultValues: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            bankCode: '',
        },
    });

    const handleBankSelect = (bankCode: string) => {
        const selectedBank = BANK_ACCOUNT.find(bank => bank.code === bankCode);
        if (selectedBank) {
            form.setValue('bankCode', selectedBank.code);
            form.setValue('bankName', selectedBank.name);
        }
    };

    const onSubmit = async (data: TCreateBankAccount) => {
        mutate(() => createBankAccount(data), {
            onSuccess: () => {
                toast.success('Bank account added successfully');
                form.reset();
                setIsDialogOpen(false);
                router.refresh();
            },
            onError: () => {
                toast.error('Failed to add bank account');
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank Account
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Bank Account</DialogTitle>
                    <DialogDescription>
                        Enter your bank account details. Select your bank from the list.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bank</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            handleBankSelect(value);
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your bank" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {BANK_ACCOUNT.map((bank) => (
                                                <SelectItem key={bank.code} value={bank.code}>
                                                    {bank.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter account holder name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter account number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add Bank Account'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}


