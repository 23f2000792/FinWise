'use client';

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
import { PieChart, Pie, Cell } from 'recharts';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';
import { format, startOfMonth, isWithinInterval } from 'date-fns';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);

    const expensesThisMonth = transactions.filter(
      (t) =>
        t.type === 'expense' &&
        isWithinInterval(t.date.toDate(), { start: startOfCurrentMonth, end: now })
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

    const chartData = Object.entries(spendingByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        fill: chartColors[index % chartColors.length],
      }))
      .sort((a, b) => b.value - a.value);

    const chartConfig = chartData.reduce(
      (acc, item) => {
        acc[item.name] = {
          label: item.name,
          color: item.fill,
        };
        return acc;
      },
      {} as any
    );

    return { chartData, chartConfig };
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category (This Month)</CardTitle>
        {chartData.length === 0 && (
          <CardDescription>
            No expenses recorded for this month.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No data to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
