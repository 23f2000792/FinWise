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
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subMonths, getMonth, getYear } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';

interface IncomeExpenseLineChartProps {
  transactions: Transaction[];
}

export function IncomeExpenseLineChart({
  transactions,
}: IncomeExpenseLineChartProps) {
    const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const currency = userProfile?.data()?.currency || 'INR';

  const { chartData, chartConfig } = useMemo(() => {
    const now = new Date();
    const data = Array.from({ length: 12 }).map((_, i) => {
      const d = subMonths(now, 11 - i);
      return {
        month: format(d, 'MMM'),
        year: getYear(d),
        monthNum: getMonth(d),
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((t) => {
      const transactionDate = t.date.toDate();
      const month = getMonth(transactionDate);
      const year = getYear(transactionDate);

      const dataPoint = data.find(
        (d) => d.monthNum === month && d.year === year
      );

      if (dataPoint) {
        if (t.type === 'income') {
          dataPoint.income += t.amount;
        } else {
          dataPoint.expense += t.amount;
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
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense Trend</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
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
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
