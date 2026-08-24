"use client";

import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createTransactionAction, deleteTransactionAction, updateTransactionAction } from "@/app/actions/transactions";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";
import { calculateCategoryBreakdown, calculateTotals, filterTransactions, previousMonth, transactionsForMonth } from "@/lib/finance";
import { formatMonth } from "@/lib/formatters";
import type { TransactionFormValues } from "@/lib/transaction-schema";
import type { Transaction, TransactionFilters } from "@/types/transaction";

const initialFilters: TransactionFilters = { search: "", kind: "all", category: "", date: "" };

type DashboardProps = {
  initialTransactions: Transaction[];
  userName: string | null;
};

export function Dashboard({ initialTransactions, userName }: DashboardProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const openerRef = useRef<HTMLElement | null>(null);
  const today = useMemo(() => new Date(), []);

  const currentTransactions = useMemo(() => transactionsForMonth(initialTransactions, today), [initialTransactions, today]);
  const previousTransactions = useMemo(() => transactionsForMonth(initialTransactions, previousMonth(today)), [initialTransactions, today]);
  const currentTotals = useMemo(() => calculateTotals(currentTransactions), [currentTransactions]);
  const previousTotals = useMemo(() => calculateTotals(previousTransactions), [previousTransactions]);
  const breakdown = useMemo(() => calculateCategoryBreakdown(currentTransactions), [currentTransactions]);
  const filteredTransactions = useMemo(() => filterTransactions(initialTransactions, filters), [filters, initialTransactions]);

  const openCreateForm = useCallback((trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setActionError(null);
    setEditingTransaction(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((transaction: Transaction, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setActionError(null);
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  async function saveTransaction(values: TransactionFormValues) {
    const result = editingTransaction
      ? await updateTransactionAction(editingTransaction.id, values)
      : await createTransactionAction(values);
    if (!result.success) {
      setActionError(result.error);
      return;
    }
    closeForm();
    startTransition(() => router.refresh());
  }

  function removeTransaction(id: string) {
    setActionError(null);
    startTransition(async () => {
      const result = await deleteTransactionAction(id);
      if (!result.success) setActionError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="shell" aria-busy={isPending}>
      <Sidebar userName={userName} />
      <main id="resumen">
        <DashboardHeader date={today} userName={userName} onAdd={openCreateForm} />
        {actionError && <div className="action-error" role="alert">{actionError}</div>}
        <SummaryCards current={currentTotals} previous={previousTotals} />
        <section className="panels" id="analisis">
          <CashFlowChart totals={currentTotals} periodLabel={formatMonth(today)} />
          <CategoryBreakdown breakdown={breakdown} totalExpense={currentTotals.expense} />
        </section>
        <TransactionsTable transactions={filteredTransactions} totalCount={initialTransactions.length} filters={filters} onFiltersChange={setFilters} isLoaded onAdd={openCreateForm} onEdit={openEditForm} onDelete={removeTransaction} />
        <footer>Finova · Tus finanzas, más claras.</footer>
      </main>
      {isFormOpen && <TransactionForm transaction={editingTransaction} serverError={actionError} onCancel={closeForm} onSubmit={saveTransaction} />}
    </div>
  );
}
