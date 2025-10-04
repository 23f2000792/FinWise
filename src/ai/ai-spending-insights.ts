'use server';
/**
 * @fileOverview An AI agent for providing spending insights.
 *
 * - getSpendingInsights - A function that analyzes transactions and provides insights.
 * - SpendingInsightsInput - The input type for the getSpendingInsights function.
 * - SpendingInsightsOutput - The return type for the getSpendingInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Transaction } from '@/lib/types';

// Convert Transaction type to a Zod schema for validation
const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  date: z.any().describe('Should be a Firestore Timestamp'),
  note: z.string().optional(),
  createdAt: z.any().describe('Should be a Firestore Timestamp'),
});

const SpendingInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema),
  name: z.string(),
});
export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

const SpendingInsightsOutputSchema = z.object({
  insights: z
    .array(
      z.object({
        emoji: z.string().describe('An emoji that represents the insight.'),
        title: z.string().describe('A short, catchy title for the insight.'),
        description: z
          .string()
          .describe(
            'A concise, one-sentence description of the insight, mentioning specific numbers and categories.'
          ),
      })
    )
    .describe('A list of 2-3 personalized, actionable financial insights.'),
  greeting: z
    .string()
    .describe(
      'A friendly, one-sentence greeting that feels personal to the user.'
    ),
});
export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

export async function getSpendingInsights(
  input: SpendingInsightsInput
): Promise<SpendingInsightsOutput> {
  return getSpendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSpendingInsightsPrompt',
  input: { schema: SpendingInsightsInputSchema },
  output: { schema: SpendingInsightsOutputSchema },
  prompt: `You are a friendly and insightful financial assistant for an app called FinWise. Your goal is to provide personalized and actionable insights to users based on their recent transactions.

Analyze the provided JSON data of the user's transactions. The user's name is {{name}}.

Based on the data, generate a concise, friendly, and encouraging analysis.

Your response must be in JSON format and include:
1.  A short, personalized 'greeting' for the user.
2.  A list of 2-3 'insights'. Each insight should be an object with:
    - 'emoji': A relevant emoji.
    - 'title': A short, catchy title (e.g., "Top Spending Category," "Income Boost").
    - 'description': A single sentence summarizing the key finding. Be specific and use data (e.g., "You spent $250 on Food this month," "Your income increased by 20%").

Here is the user's transaction data:
\`\`\`json
{{{transactions}}}
\`\`\`

Provide only the JSON output.`,
});

const getSpendingInsightsFlow = ai.defineFlow(
  {
    name: 'getSpendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      ...input,
      // @ts-ignore
      transactions: JSON.stringify(input.transactions),
    });
    return output!;
  }
);
