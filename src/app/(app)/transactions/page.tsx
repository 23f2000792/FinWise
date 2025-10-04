
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useMemo } from "react";
import { AddTransactionForm } from "@/components/transactions/add-transaction-form";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/lib/types";
import { DataTable } from "@/components/transactions/data-table";
import { getColumns } from "@/components/transactions/columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    (Transaction & { id: string }) | null
  >(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<
    string | null
  >(null);

  const [snapshot, loading] = useCollection(
    user ? collection(db, "users", user.uid, "transactions") : null
  );

  const transactions =
    snapshot?.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transaction & { id: string })
    ) || [];

  const handleEdit = (transaction: Transaction & { id: string }) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    setDeletingTransactionId(transactionId);
  };

  const confirmDelete = async () => {
    if (!user || !deletingTransactionId) return;
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "transactions", deletingTransactionId)
      );
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been successfully deleted.",
      });
      setDeletingTransactionId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDelete), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Manage your income and expenses."
      >
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle />
          Add Transaction
        </Button>
      </PageHeader>

      <AddTransactionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        transaction={editingTransaction}
      />

      <AlertDialog
        open={!!deletingTransactionId}
        onOpenChange={() => setDeletingTransactionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            A list of all your recorded transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <DataTable columns={columns} data={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
