import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage your income and expenses."
      >
        <Button>
          <PlusCircle />
          Add Transaction
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>A list of all your recorded transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Transaction data will be displayed here in a table.</p>
        </CardContent>
      </Card>
    </div>
  );
}
