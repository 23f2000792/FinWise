

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import type { Transaction } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getYear, getMonth, format } from 'date-fns';
import { YearlyOverviewChart } from '@/components/analytics/yearly-overview-chart';
import { MonthlyCategoryChart } from '@/components/analytics/monthly-category-chart';
import { IncomeExpenseLineChart } from '@/components/analytics/income-expense-line-chart';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [transactionsSnapshot, loadingTransactions] = useCollection(
    user ? collection(db, 'users', user.uid, 'transactions') : null
  );

  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));

  const transactions =
    transactionsSnapshot?.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transaction & { id: string })
    ) || [];

  const availableYears = Array.from(
    new Set(transactions.map((t) => getYear(t.date.toDate())))
  ).sort((a, b) => b - a);

  if (loadingTransactions) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Visualize your financial data with charts."
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {format(new Date(0, index), 'MMMM')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {transactions.length > 0 ? (
        <div className="space-y-6">
          <YearlyOverviewChart
            transactions={transactions}
            year={selectedYear}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MonthlyCategoryChart
              transactions={transactions}
              year={selectedYear}
              month={selectedMonth}
            />
            <IncomeExpenseLineChart transactions={transactions} />
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Not enough transaction data to generate analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
