'use client';

import { deleteBankAccount } from '@/actions/bank-account.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { TBankAccount } from '@repo/common';
import { Building2, Edit, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { EditBankAccountDialog } from './edit-bank-account-dialog';

interface BankAccountsListProps {
    initialBankAccounts: TBankAccount[];
}

export function BankAccountsList({ initialBankAccounts }: BankAccountsListProps) {
    const router = useRouter();
    const { mutate, isLoading } = useApiMutation();
    const [editingAccount, setEditingAccount] = useState<TBankAccount | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEdit = (account: TBankAccount) => {
        setEditingAccount(account);
        setIsEditDialogOpen(true);
    };

    const handleCloseEdit = () => {
        setIsEditDialogOpen(false);
        setEditingAccount(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this bank account?')) {
            mutate(() => deleteBankAccount(id), {
                onSuccess: () => {
                    toast.success('Bank account deleted successfully');
                    router.refresh();
                },
                onError: () => {
                    toast.error('Failed to delete bank account');
                },
            });
        }
    };

    if (initialBankAccounts.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Bank Accounts</h3>
                        <p className="text-muted-foreground mb-4">
                            You haven't added any bank accounts yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="grid gap-4">
                        {initialBankAccounts.map((account) => (
                            <Card key={account.id} className="border border-border/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-blue-500/10">
                                                <Building2 className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-lg">
                                                    {account.accountName}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {account.bankName}
                                                </p>
                                                <p className="text-sm font-mono">
                                                    {account.accountNumber}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Bank Code: {account.bankCode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-blue-500/10 text-blue-500"
                                                onClick={() => handleEdit(account)}
                                                disabled={isLoading}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(account.id)}
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <EditBankAccountDialog
                account={editingAccount}
                isOpen={isEditDialogOpen}
                onClose={handleCloseEdit}
            />
        </>
    );
}


