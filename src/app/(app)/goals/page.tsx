import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Goals"
        description="Set and track your financial goals to stay motivated."
      >
        <Button>
          <PlusCircle />
          Add Goal
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
            <CardTitle>Your Goals</CardTitle>
            <CardDescription>A list of your financial goals and their progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Financial goal tracking components will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
