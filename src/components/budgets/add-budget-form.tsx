'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Budget } from '@/lib/types';
import { format } from 'date-fns';

const budgetFormSchema = z.object({
  category: z
    .string()
    .min(2, { message: 'Category must be at least 2 characters.' }),
  limit: z.coerce.number().positive({ message: 'Limit must be a positive number.' }),
});

interface AddBudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: (Budget & { id: string }) | null;
}

export function AddBudgetForm({ isOpen, onClose, budget }: AddBudgetFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: '',
      limit: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        category: budget.category,
        limit: budget.limit,
      });
    } else {
      form.reset({
        category: '',
        limit: 0,
      });
    }
  }, [budget, form, isOpen]);

  async function onSubmit(values: z.infer<typeof budgetFormSchema>) {
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (budget) {
        // Update existing budget
        const budgetDocRef = doc(db, 'users', user.uid, 'budgets', budget.id);
        await updateDoc(budgetDocRef, {
          ...values,
        });
        toast({
          title: 'Budget Updated',
          description: `Your budget for ${values.category} has been updated.`,
        });
      } else {
        // Add new budget
        await addDoc(collection(db, 'users', user.uid, 'budgets'), {
          ...values,
          userId: user.uid,
          spent: 0,
          month: format(new Date(), 'yyyy-MM'),
          createdAt: serverTimestamp(),
        });
        toast({
          title: 'Budget Created',
          description: `Your new budget for ${values.category} has been created.`,
        });
      }
      onClose();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
          <DialogDescription>
            Create a monthly budget for a specific category to track your
            spending.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {budget ? 'Save Changes' : 'Create Budget'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
