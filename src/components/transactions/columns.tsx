
"use client";

import type { Transaction } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuth } from "@/hooks/use-auth";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CurrencyFormatter = ({ amount }: { amount: number }) => {
  const { user } = useAuth();
  const [userProfile] = useDocument(user ? doc(db, "users", user.uid) : null);

  const currency = userProfile?.data()?.currency || "INR";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getColumns = (
  onEdit: (transaction: Transaction & { id: string }) => void,
  onDelete: (transactionId: string) => void
): ColumnDef<Transaction & { id: string }>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4">{format(row.original.date.toDate(), "dd MMM, yyyy")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={row.original.type === "income" ? "secondary" : "outline"}
        className={cn(
          'text-center',
          row.original.type === "income" &&
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
          row.original.type === "expense" &&
            "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
        )}
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "text-right font-medium pr-4",
          row.original.type === "income" ? "text-emerald-600" : "text-red-600"
        )}
      >
        {row.original.type === "income" ? "+" : "-"}
        <CurrencyFormatter amount={row.original.amount} />
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <div className="hidden sm:table-cell truncate max-w-[150px]">{row.original.note}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(transaction)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(transaction.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
