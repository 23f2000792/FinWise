
'use client';

import { useAuth } from '@/hooks/use-auth';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import type { Transaction } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { getSpendingInsights, SpendingInsightsInput } from '@/ai/ai-spending-insights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import React from 'react';

export function AiInsights() {
  const { user } = useAuth();
  const [transactionsSnapshot, loadingTransactions] = useCollection(
    user ? collection(db, 'users', user.uid, 'transactions') : null
  );
  const [insights, setInsights] = React.useState<any>(null);
  const [loadingInsights, setLoadingInsights] = React.useState(true);

  React.useEffect(() => {
    async function fetchInsights() {
      if (user && transactionsSnapshot) {
        const transactions = transactionsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Transaction[];
        
        if (transactions.length > 0) {
          try {
            setLoadingInsights(true);
            const input: SpendingInsightsInput = {
              transactions: transactions.map(t => ({
                ...t,
                date: t.date.toDate().toISOString(),
                createdAt: t.createdAt.toDate().toISOString(),
              })),
              name: user.displayName || 'there',
            };
            const result = await getSpendingInsights(input);
            setInsights(result);
          } catch (error) {
            console.error("Error fetching AI insights:", error);
            setInsights(null);
          } finally {
            setLoadingInsights(false);
          }
        } else {
          setInsights(null);
          setLoadingInsights(false);
        }
      }
    }
    fetchInsights();
  }, [user, transactionsSnapshot]);

  if (loadingTransactions || loadingInsights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-center h-24">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
           </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Not enough data for insights.</p>
           </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
       <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>{insights.greeting}</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {insights.insights.map((insight: any, index: number) => (
            <div key={index} className="flex items-start gap-4">
              <div className="text-3xl">{insight.emoji}</div>
              <div>
                <p className="font-semibold">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


