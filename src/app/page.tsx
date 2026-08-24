"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { useTransactions } from "@/hooks/use-transactions";
import { calculateCategoryBreakdown, calculateTotals, previousMonth, transactionsForMonth } from "@/lib/finance";
import { formatMonth } from "@/lib/formatters";
import type { TransactionFormValues } from "@/lib/transaction-schema";
import type { Transaction } from "@/types/transaction";

export default function Home() {
  const { transactions, isLoaded, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const today = useMemo(() => new Date(), []);

  const currentTransactions = useMemo(() => transactionsForMonth(transactions, today), [today, transactions]);
  const previousTransactions = useMemo(() => transactionsForMonth(transactions, previousMonth(today)), [today, transactions]);
  const currentTotals = useMemo(() => calculateTotals(currentTransactions), [currentTransactions]);
  const previousTotals = useMemo(() => calculateTotals(previousTransactions), [previousTransactions]);
  const breakdown = useMemo(() => calculateCategoryBreakdown(currentTransactions), [currentTransactions]);

  const openCreateForm = useCallback((trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setEditingTransaction(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((transaction: Transaction, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  function saveTransaction(values: TransactionFormValues) {
    const transaction: Transaction = {
      ...values,
      category: values.kind === "income" ? "Ingresos" : values.category,
      id: editingTransaction?.id ?? crypto.randomUUID(),
    };
    if (editingTransaction) updateTransaction(transaction);
    else createTransaction(transaction);
    closeForm();
  }

  return (
    <div className="shell">
      <Sidebar />
      <main id="resumen">
        <DashboardHeader date={today} onAdd={openCreateForm} />
        <SummaryCards current={currentTotals} previous={previousTotals} />
        <section className="panels" id="analisis">
          <CashFlowChart totals={currentTotals} periodLabel={formatMonth(today)} />
          <CategoryBreakdown breakdown={breakdown} totalExpense={currentTotals.expense} />
        </section>
        <TransactionsTable transactions={transactions} isLoaded={isLoaded} onAdd={openCreateForm} onEdit={openEditForm} onDelete={deleteTransaction} />
        <footer>Finova · Tus finanzas, más claras.</footer>
      </main>
      {isFormOpen && <TransactionForm transaction={editingTransaction} onCancel={closeForm} onSubmit={saveTransaction} />}
    </div>
  );
}
