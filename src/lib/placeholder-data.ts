import { Timestamp } from "firebase/firestore";
import type { Transaction, FinancialGoal, Budget } from "./types";

export const placeholderTransactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    amount: 5000,
    type: "income",
    category: "Salary",
    date: Timestamp.fromDate(new Date("2024-07-25")),
    createdAt: Timestamp.now(),
  },
  {
    id: "2",
    userId: "1",
    amount: 75.5,
    type: "expense",
    category: "Food",
    note: "Lunch with colleagues",
    date: Timestamp.fromDate(new Date("2024-07-24")),
    createdAt: Timestamp.now(),
  },
  {
    id: "3",
    userId: "1",
    amount: 30,
    type: "expense",
    category: "Transport",
    date: Timestamp.fromDate(new Date("2024-07-24")),
    createdAt: Timestamp.now(),
  },
  {
    id: "4",
    userId: "1",
    amount: 200,
    type: "expense",
    category: "Entertainment",
    note: "Movie night",
    date: Timestamp.fromDate(new Date("2024-07-23")),
    createdAt: Timestamp.now(),
  },
  {
    id: "5",
    userId: "1",
    amount: 1200,
    type: "expense",
    category: "Rent",
    date: Timestamp.fromDate(new Date("2024-07-20")),
    createdAt: Timestamp.now(),
  },
];

export const placeholderGoal: FinancialGoal = {
  id: "g1",
  goalName: "Vacation to Japan",
  targetAmount: 3000,
  currentAmount: 1200,
  deadline: Timestamp.fromDate(new Date("2025-06-01")),
};

export const placeholderBudgets: Budget[] = [
    { id: 'b1', userId: '1', category: 'Food', limit: 400, spent: 280, month: '2024-07' },
    { id: 'b2', userId: '1', category: 'Transport', limit: 150, spent: 90, month: '2024-07' },
    { id: 'b3', userId: '1', category: 'Entertainment', limit: 200, spent: 210, month: '2024-07' },
    { id: 'b4', userId: '1', category: 'Utilities', limit: 100, spent: 75, month: '2024-07' },
];
