'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Transaction } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: userProfile?.data()?.currency || 'INR',
    }).format(amount);
  };
  
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a,b) => b.date.toMillis() - a.date.toMillis()).slice(0, 5);
  }, [transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Here are the latest transactions from your account.
          </CardDescription>
        </div>
        <Button variant="link" asChild>
          <Link href="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="font-medium">{transaction.category}</div>
                  {transaction.note && (
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.note}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant={
                      transaction.type === 'income' ? 'secondary' : 'outline'
                    }
                    className={cn(
                      transaction.type === 'income' &&
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
                      transaction.type === 'expense' &&
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    )}
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(transaction.date.toDate(), 'dd MMM, yyyy')}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    transaction.type === 'income'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
          <div className="flex h-[150px] items-center justify-center">
            <p className="text-muted-foreground">No transactions recorded yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
