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
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { CalendarIcon, Loader2 } from 'lucide-react';
import type { FinancialGoal } from '@/lib/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const goalFormSchema = z.object({
  goalName: z
    .string()
    .min(2, { message: 'Goal name must be at least 2 characters.' }),
  targetAmount: z.coerce
    .number()
    .positive({ message: 'Target amount must be a positive number.' }),
  currentAmount: z.coerce
    .number()
    .min(0, { message: 'Current amount cannot be negative.' }),
  deadline: z.date({ required_error: 'Please select a deadline.' }),
});

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: (FinancialGoal & { id: string }) | null;
}

export function AddGoalForm({ isOpen, onClose, goal }: AddGoalFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof goalFormSchema>>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalName: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date(),
    },
  });

  useEffect(() => {
    if (goal) {
      form.reset({
        goalName: goal.goalName,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline.toDate(),
      });
    } else {
      form.reset({
        goalName: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date(),
      });
    }
  }, [goal, form, isOpen]);

  async function onSubmit(values: z.infer<typeof goalFormSchema>) {
    if (!user) return;
    setIsSubmitting(true);

    const goalData = {
      ...values,
      deadline: Timestamp.fromDate(values.deadline),
    };

    try {
      if (goal) {
        // Update existing goal
        const goalDocRef = doc(db, 'users', user.uid, 'goals', goal.id);
        await updateDoc(goalDocRef, goalData);
        toast({
          title: 'Goal Updated',
          description: `Your goal "${values.goalName}" has been updated.`,
        });
      } else {
        // Add new goal
        await addDoc(collection(db, 'users', user.uid, 'goals'), {
          ...goalData,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        toast({
          title: 'Goal Created',
          description: `Your new goal "${values.goalName}" has been set.`,
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
          <DialogTitle>{goal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
          <DialogDescription>
            Set a financial goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="goalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Save for a new car" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 20000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount Saved</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                {goal ? 'Save Changes' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
