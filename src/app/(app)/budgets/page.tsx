import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Create and track your monthly budgets."
      >
        <Button>
          <PlusCircle />
          Add Budget
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Your Budgets</CardTitle>
            <CardDescription>Your monthly budgets for different categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Budget tracking components will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
