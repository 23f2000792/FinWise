import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { placeholderTransactions } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function RecentTransactions() {
  const transactions = placeholderTransactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Here are the latest transactions from your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
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
                      transaction.type === "income" ? "secondary" : "outline"
                    }
                    className={cn(
                      transaction.type === "income" &&
                        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
                      transaction.type === "expense" &&
                        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    )}
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {format(transaction.date.toDate(), "dd MMM, yyyy")}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium",
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-red-600"
                  )}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
