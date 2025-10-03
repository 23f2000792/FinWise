'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { GoalsOverview } from '@/components/dashboard/goals-overview';
import { AiInsights } from '@/components/dashboard/ai-insights';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AddTransactionForm } from '@/components/transactions/add-transaction-form';
import { useState } from 'react';
import type { Transaction, FinancialGoal } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [transactionsSnapshot, loadingTransactions] = useCollection(
    user ? collection(db, 'users', user.uid, 'transactions') : null
  );
  const [goalsSnapshot, loadingGoals] = useCollection(
    user ? query(collection(db, 'users', user.uid, 'goals'), orderBy('createdAt', 'desc'), limit(1)) : null
  );

  const transactions = transactionsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction & { id: string })) || [];
  const goal = goalsSnapshot?.docs[0] ? { id: goalsSnapshot.docs[0].id, ...goalsSnapshot.docs[0].data() } as FinancialGoal & { id: string } : null;

  const loading = loadingTransactions || loadingGoals;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Here’s a snapshot of your financial health."
      >
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle />
          Add Transaction
        </Button>
      </PageHeader>

      <AddTransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      <div className="grid gap-6">
        <OverviewCards transactions={transactions} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart transactions={transactions} />
          </div>
          <div className="space-y-6">
            <GoalsOverview goal={goal} />
            <AiInsights transactions={transactions} />
          </div>
        </div>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}
