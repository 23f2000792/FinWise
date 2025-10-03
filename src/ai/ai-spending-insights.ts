'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered insights and recommendations based on user spending habits.
 *
 * The flow analyzes user transaction data to identify spending patterns and areas for potential savings.
 * It uses a large language model (LLM) via Genkit prompts to generate personalized insights and recommendations.
 *
 * - `getSpendingInsights`: Asynchronous function to trigger the spending insights flow.
 * - `SpendingInsightsInput`: Input type definition for the `getSpendingInsights` function.
 * - `SpendingInsightsOutput`: Output type definition for the `getSpendingInsights` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the spending insights flow
const SpendingInsightsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  transactions: z.array(
    z.object({
      amount: z.number().describe('The transaction amount.'),
      type: z.string().describe('The transaction type (income or expense).'),
      category: z.string().describe('The transaction category (e.g., Food, Rent, Salary).'),
      date: z.string().describe('The transaction date (ISO format).'),
      note: z.string().optional().describe('Optional notes about the transaction.'),
    })
  ).describe('An array of user transactions.'),
  currency: z.string().describe('The user preferred currency'),
});

export type SpendingInsightsInput = z.infer<typeof SpendingInsightsInputSchema>;

// Define the output schema for the spending insights flow
const SpendingInsightsOutputSchema = z.object({
  insights: z.array(
    z.string().describe('AI-powered insights and recommendations for the user.')
  ).describe('An array of spending insights and recommendations.'),
});

export type SpendingInsightsOutput = z.infer<typeof SpendingInsightsOutputSchema>;

// Define the main function to trigger the spending insights flow
export async function getSpendingInsights(input: SpendingInsightsInput): Promise<SpendingInsightsOutput> {
  return spendingInsightsFlow(input);
}

// Define the prompt for generating spending insights
const spendingInsightsPrompt = ai.definePrompt({
  name: 'spendingInsightsPrompt',
  input: {schema: SpendingInsightsInputSchema},
  output: {schema: SpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor providing insights to users based on their spending habits.

  Analyze the following transaction data and provide personalized recommendations to help the user save money and improve their financial health.
  Pay attention to trends, categories where the user spends the most, and any potential areas for savings.
  Be specific and provide actionable advice. Mention the currency of the transactions, which is {{{currency}}}.

  Transactions:
  {{#each transactions}}
  - Amount: {{amount}}, Type: {{type}}, Category: {{category}}, Date: {{date}}, Note: {{note}}
  {{/each}}

  Insights:
  `, 
});

// Define the Genkit flow for generating spending insights
const spendingInsightsFlow = ai.defineFlow(
  {
    name: 'spendingInsightsFlow',
    inputSchema: SpendingInsightsInputSchema,
    outputSchema: SpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await spendingInsightsPrompt(input);
    return output!;
  }
);
