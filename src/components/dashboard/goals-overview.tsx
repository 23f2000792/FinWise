import { placeholderGoal } from "@/lib/placeholder-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { format } from "date-fns";

export function GoalsOverview() {
  const goal = placeholderGoal;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Financial Goal
        </CardTitle>
        <CardDescription>
          Your progress towards your current financial goal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>{goal.goalName}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(goal.currentAmount)} saved</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <p className="text-center text-xs text-muted-foreground pt-2">
            Deadline: {format(goal.deadline.toDate(), "dd MMM, yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
