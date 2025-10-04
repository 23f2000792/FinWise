
'use client';

import { useAuth } from '@/hooks/use-auth';
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
import { AddBudgetForm } from '@/components/budgets/add-budget-form';
import { useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Progress } from '@/components/ui/progress';
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
import type { Budget, Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { useDocument } from 'react-firebase-hooks/firestore';

function BudgetCard({
  budget,
  onEdit,
}: {
  budget: Budget & { id: string };
  onEdit: (budget: Budget & { id: string }) => void;
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
      await deleteDoc(doc(db, 'users', user.uid, 'budgets', budget.id));
      toast({
        title: 'Budget Deleted',
        description: `The budget for ${budget.category} has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Deleting Budget',
        description: error.message,
      });
    }
  };

  const progress =
    budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{budget.category}</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
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
                  your budget for {budget.category}.
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
            <span>{formatCurrency(budget.spent)}</span>
            <span className="text-muted-foreground">
              / {formatCurrency(budget.limit)}
            </span>
          </div>
          <Progress value={progress} />
          <div className="text-right text-sm text-muted-foreground">
            {progress.toFixed(0)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BudgetsPage() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<
    (Budget & { id: string }) | null
  >(null);

  const [budgetsSnapshot, loadingBudgets] = useCollection(
    user ? collection(db, 'users', user.uid, 'budgets') : null
  );

  const [transactionsSnapshot] = useCollection(
    user ? collection(db, 'users', user.uid, 'transactions') : null
  );

  const handleEdit = (budget: Budget & { id: string }) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const budgetsWithSpent = budgetsSnapshot?.docs.map((doc) => {
    const budget = { id: doc.id, ...doc.data() } as Budget & { id: string };
    const currentMonthStr = format(new Date(), 'yyyy-MM');

    const spent =
      transactionsSnapshot?.docs
        .map((t) => t.data() as Transaction)
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.category === budget.category &&
            format(t.date.toDate(), 'yyyy-MM') === currentMonthStr
        )
        .reduce((acc, t) => acc + t.amount, 0) || 0;

    return { ...budget, spent };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Create and track your monthly budgets."
      >
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle />
          Add Budget
        </Button>
      </PageHeader>

      <AddBudgetForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        budget={editingBudget}
      />

      <div>
        {loadingBudgets ? (
          <p>Loading budgets...</p>
        ) : budgetsWithSpent && budgetsWithSpent.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgetsWithSpent.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven't created any budgets yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
