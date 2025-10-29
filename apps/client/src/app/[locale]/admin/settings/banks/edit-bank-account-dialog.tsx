'use client';

import { updateBankAccount } from '@/actions/bank-account.action';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { BANK_ACCOUNT, TBankAccount, TUpdateBankAccount, ZUpdateBankAccount } from '@repo/common';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EditBankAccountDialogProps {
    account: TBankAccount | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditBankAccountDialog({ account, isOpen, onClose }: EditBankAccountDialogProps) {
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();

    const form = useForm<TUpdateBankAccount>({
        resolver: zodResolver(ZUpdateBankAccount),
        defaultValues: {
            accountName: '',
            accountNumber: '',
            bankName: '',
            bankCode: '',
        },
    });

    useEffect(() => {
        if (account) {
            form.reset({
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bankName: account.bankName,
                bankCode: account.bankCode,
            });
        }
    }, [account, form]);

    const handleBankSelect = (bankCode: string) => {
        const selectedBank = BANK_ACCOUNT.find(bank => bank.code === bankCode);
        if (selectedBank) {
            form.setValue('bankCode', selectedBank.code);
            form.setValue('bankName', selectedBank.name);
        }
    };

    const onSubmit = async (data: TUpdateBankAccount) => {
        if (!account) return;

        mutate(() => updateBankAccount(account.id, data), {
            onSuccess: () => {
                toast.success('Bank account updated successfully');
                form.reset();
                onClose();
                router.refresh();
            },
            onError: () => {
                toast.error('Failed to update bank account');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Bank Account</DialogTitle>
                    <DialogDescription>
                        Update your bank account details.
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
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Bank Account'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}


