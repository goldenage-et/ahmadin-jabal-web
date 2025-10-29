import { getBankAccounts } from '@/actions/bank-account.action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { BankAccountsList } from './bank-accounts-list';
import { AddBankAccountDialog } from './add-bank-account-dialog';
import { getAuth } from '@/actions/auth.action';
import { redirect } from 'next/navigation';

export default async function BankAccountsPage() {
    const { member } = await getAuth();

    if (!member) {
        redirect('/');
    }

    const bankAccounts = await getBankAccounts();
    const accounts = Array.isArray(bankAccounts) ? bankAccounts : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500/5 via-orange-500/3 to-transparent">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                    <Building2 className="h-6 w-6 text-orange-500" />
                                </div>
                                Bank Accounts
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Manage your store's bank accounts for receiving payments
                            </CardDescription>
                        </div>
                        <AddBankAccountDialog />
                    </div>
                </CardHeader>
            </Card>

            {/* Bank Accounts List */}
            <BankAccountsList initialBankAccounts={accounts} />
        </div>
    );
}
