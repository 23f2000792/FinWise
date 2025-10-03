import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarURL?: string;
  createdAt: Timestamp;
  currency: "INR" | "USD" | "EUR"; // Example, can be extended
}

export interface FinancialGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Timestamp;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Timestamp;
  note?: string;
  createdAt: Timestamp;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  month: string; // e.g., "2025-10"
}
