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
import { MonthSelector } from "@/components/dashboard/MonthSelector";
import { calculateCategoryBreakdown, calculateTotals, filterTransactions, previousMonth, transactionsForMonth } from "@/lib/finance";
import { formatMonth } from "@/lib/formatters";
import type { TransactionFormValues } from "@/lib/transaction-schema";
import type { Transaction, TransactionFilters } from "@/types/transaction";

const initialFilters: TransactionFilters = { search: "", kind: "all", category: "", date: "" };

type DashboardProps = {
  initialTransactions: Transaction[];
  userName: string | null;
  selectedMonth: string;
  movementsOnly?: boolean;
};

export function Dashboard({ initialTransactions, userName, selectedMonth, movementsOnly = false }: DashboardProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const openerRef = useRef<HTMLElement | null>(null);
  const today = useMemo(() => new Date(`${selectedMonth}-01T12:00:00`), [selectedMonth]);

  const currentTransactions = useMemo(() => transactionsForMonth(initialTransactions, today), [initialTransactions, today]);
  const previousTransactions = useMemo(() => transactionsForMonth(initialTransactions, previousMonth(today)), [initialTransactions, today]);
  const currentTotals = useMemo(() => calculateTotals(currentTransactions), [currentTransactions]);
  const previousTotals = useMemo(() => calculateTotals(previousTransactions), [previousTransactions]);
  const breakdown = useMemo(() => calculateCategoryBreakdown(currentTransactions), [currentTransactions]);
  const filteredTransactions = useMemo(() => filterTransactions(initialTransactions, filters), [filters, initialTransactions]);

  const openCreateForm = useCallback((trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setActionError(null);
    setActionSuccess(null);
    setEditingTransaction(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((transaction: Transaction, trigger: HTMLButtonElement) => {
    openerRef.current = trigger;
    setActionError(null);
    setActionSuccess(null);
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
    setActionSuccess(editingTransaction ? "Movimiento actualizado." : "Movimiento creado.");
    startTransition(() => router.refresh());
  }

  function removeTransaction(id: string) {
    const transaction = initialTransactions.find((item) => item.id === id);
    if (!window.confirm(`¿Eliminar ${transaction ? `“${transaction.name}”` : "este movimiento"}? Esta acción no se puede deshacer.`)) return;
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const result = await deleteTransactionAction(id);
      if (!result.success) setActionError(result.error);
      else { setActionSuccess("Movimiento eliminado."); router.refresh(); }
    });
  }

  return (
    <div className="shell" aria-busy={isPending}>
      <Sidebar userName={userName} />
      <main id="resumen">
        <DashboardHeader date={today} userName={userName} onAdd={openCreateForm} />
        {actionError && <div className="action-error" role="alert">{actionError}</div>}
        {actionSuccess && <div className="notice success" role="status">{actionSuccess}</div>}
        {!movementsOnly && <><div className="dashboard-period"><MonthSelector month={selectedMonth} /><span>Comparación contra el mes anterior</span></div><SummaryCards current={currentTotals} previous={previousTotals} />
        <section className="panels">
          <CashFlowChart totals={currentTotals} periodLabel={formatMonth(today)} />
          <CategoryBreakdown breakdown={breakdown} totalExpense={currentTotals.expense} />
        </section></>}
        <TransactionsTable transactions={filteredTransactions} totalCount={initialTransactions.length} filters={filters} onFiltersChange={setFilters} isLoaded onAdd={openCreateForm} onEdit={openEditForm} onDelete={removeTransaction} />
        <footer>Finova · Tus finanzas, más claras.</footer>
      </main>
      {isFormOpen && <TransactionForm transaction={editingTransaction} serverError={actionError} onCancel={closeForm} onSubmit={saveTransaction} />}
    </div>
  );
}
