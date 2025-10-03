'use client';

import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, getYear, getMonth, isSameYear } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

interface YearlyOverviewChartProps {
  transactions: Transaction[];
  year: number;
}

export function YearlyOverviewChart({
  transactions,
  year,
}: YearlyOverviewChartProps) {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const currency = userProfile?.data()?.currency || 'INR';

  const { chartData, chartConfig } = useMemo(() => {
    const data = Array.from({ length: 12 }).map((_, index) => ({
      month: format(new Date(year, index), 'MMM'),
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      const transactionDate = t.date.toDate();
      if (isSameYear(transactionDate, new Date(year, 0))) {
        const month = getMonth(transactionDate);
        if (t.type === 'income') {
          data[month].income += t.amount;
        } else {
          data[month].expense += t.amount;
        }
      }
    });

    return {
      chartData: data,
      chartConfig: {
        income: {
          label: 'Income',
          color: 'hsl(var(--chart-2))',
        },
        expense: {
          label: 'Expense',
          color: 'hsl(var(--chart-5))',
        },
      },
    };
  }, [transactions, year]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Overview - {year}</CardTitle>
        <CardDescription>
          Total income vs. expenses for each month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: currency,
                  notation: 'compact',
                }).format(value)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) =>
                    `${name}: ${new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: currency,
                    }).format(value as number)}`
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
