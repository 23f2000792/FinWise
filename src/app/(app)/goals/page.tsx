'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { FinancialGoal } from '@/lib/types';
import { AddGoalForm } from '@/components/goals/add-goal-form';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

function GoalCard({
  goal,
  onEdit,
}: {
  goal: FinancialGoal & { id: string };
  onEdit: (goal: FinancialGoal & { id: string }) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: userProfile?.data()?.currency || 'INR',
    }).format(amount);
  };

  const handleDelete = async () => {
    try {
      if (!user) throw new Error('User not found');
      await deleteDoc(doc(db, 'users', user.uid, 'goals', goal.id));
      toast({
        title: 'Goal Deleted',
        description: `The goal "${goal.goalName}" has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Goal',
        description: error.message,
      });
    }
  };

  const progress =
    goal.targetAmount > 0
      ? (goal.currentAmount / goal.targetAmount) * 100
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{goal.goalName}</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your goal: "{goal.goalName}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span className="text-muted-foreground">
              / {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress.toFixed(0)}% Complete</span>
            <span>
              Deadline: {format(goal.deadline.toDate(), 'dd MMM, yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoalsPage() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<
    (FinancialGoal & { id: string }) | null
  >(null);

  const [goalsSnapshot, loadingGoals] = useCollection(
    user ? collection(db, 'users', user.uid, 'goals') : null
  );

  const handleEdit = (goal: FinancialGoal & { id: string }) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  const goals =
    goalsSnapshot?.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as FinancialGoal & { id: string })
    ) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Goals"
        description="Set and track your financial goals to stay motivated."
      >
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle />
          Add Goal
        </Button>
      </PageHeader>

      <AddGoalForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        goal={editingGoal}
      />

      <div>
        {loadingGoals ? (
          <p>Loading goals...</p>
        ) : goals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't set any financial goals yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
