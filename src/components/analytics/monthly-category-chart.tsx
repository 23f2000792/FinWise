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
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, getYear, getMonth, isSameMonth, isSameYear } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

interface MonthlyCategoryChartProps {
  transactions: Transaction[];
  year: number;
  month: number;
}

export function MonthlyCategoryChart({
  transactions,
  year,
  month,
}: MonthlyCategoryChartProps) {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const currency = userProfile?.data()?.currency || 'INR';
  
  const chartData = useMemo(() => {
    const targetDate = new Date(year, month);
    const expensesThisMonth = transactions.filter(
      (t) =>
        t.type === 'expense' &&
        isSameMonth(t.date.toDate(), targetDate) &&
        isSameYear(t.date.toDate(), targetDate)
    );

    const spendingByCategory = expensesThisMonth.reduce(
      (acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    return Object.entries(spendingByCategory)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, year, month]);

  const chartConfig = {
    value: {
      label: 'Spending',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          For {format(new Date(year, month), 'MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 10, right: 30 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <XAxis dataKey="value" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: currency,
                      }).format(value as number)
                    }
                    hideLabel
                  />
                }
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={5}>
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No expense data for this month.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
