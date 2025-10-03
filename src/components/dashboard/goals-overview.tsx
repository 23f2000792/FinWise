'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { format } from 'date-fns';
import type { FinancialGoal } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '../ui/button';
import Link from 'next/link';

interface GoalsOverviewProps {
  goal: (FinancialGoal & { id: string }) | null;
}

export function GoalsOverview({ goal }: GoalsOverviewProps) {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: userProfile?.data()?.currency || 'INR',
    }).format(amount);
  };

  if (!goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Financial Goal
          </CardTitle>
          <CardDescription>
            You haven't set any financial goals yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/goals">Set a Goal</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progress =
    goal.targetAmount > 0
      ? (goal.currentAmount / goal.targetAmount) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Financial Goal
        </CardTitle>
        <CardDescription>
          Your progress towards your latest financial goal.
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
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Deadline: {format(goal.deadline.toDate(), 'dd MMM, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
