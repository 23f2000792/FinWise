import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function AiInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span>💡</span>
            <span>You've spent 20% more on 'Food' this month. Consider dining in more often.</span>
          </li>
          <li className="flex items-start gap-2">
            <span>💡</span>
            <span>Your savings rate is 15%. Great job! You are on track for your goals.</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
