import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { AiInsights } from "@/components/dashboard/ai-insights";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Here’s a snapshot of your financial health."
      >
        <Button>
          <PlusCircle />
          Add Transaction
        </Button>
      </PageHeader>
      <div className="grid gap-6">
        <OverviewCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div className="space-y-6">
            <GoalsOverview />
            <AiInsights />
          </div>
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
}
