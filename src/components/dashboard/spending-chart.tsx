"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const chartData = [
  { name: "Food", value: 850.75, fill: "hsl(var(--chart-1))" },
  { name: "Rent", value: 1200.0, fill: "hsl(var(--chart-2))" },
  { name: "Transport", value: 350.5, fill: "hsl(var(--chart-3))" },
  { name: "Entertainment", value: 420.0, fill: "hsl(var(--chart-4))" },
  { name: "Utilities", value: 275.25, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  Food: {
    label: "Food",
    color: "hsl(var(--chart-1))",
  },
  Rent: {
    label: "Rent",
    color: "hsl(var(--chart-2))",
  },
  Transport: {
    label: "Transport",
    color: "hsl(var(--chart-3))",
  },
  Entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  Utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-5))",
  },
};

export function SpendingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
