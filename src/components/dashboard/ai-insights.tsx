'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Transaction } from '@/lib/types';
import { getSpendingInsights } from '@/ai/ai-spending-insights';
import { useAuth } from '@/hooks/use-auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

interface AiInsightsProps {
  transactions: Transaction[];
}

export function AiInsights({ transactions }: AiInsightsProps) {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, 'users', user.uid) : null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      if (!user || !userProfile || transactions.length === 0) {
        setLoading(false);
        return;
      };
      
      setLoading(true);
      try {
        const simplifiedTransactions = transactions.map(t => ({
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: format(t.date.toDate(), 'yyyy-MM-dd'),
            note: t.note,
        }));

        const result = await getSpendingInsights({
          userId: user.uid,
          transactions: simplifiedTransactions,
          currency: userProfile.data()?.currency || 'INR',
        });
        setInsights(result.insights);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        setInsights(['Could not load insights at the moment.']);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [transactions, user, userProfile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating insights...</span>
          </div>
        ) : insights.length > 0 ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>💡</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Not enough transaction data to generate insights.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
