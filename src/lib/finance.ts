import type { Currency, Transaction, TransactionFilters, TransactionKind } from "@/types/transaction";

export type FinancialTotals = {
  income: number;
  expense: number;
  balance: number;
};

export type CategoryTotal = {
  category: string;
  amount: number;
};

export function calculateTotals(transactions: readonly Transaction[]): FinancialTotals {
  return transactions.reduce<FinancialTotals>(
    (totals, transaction) => {
      if (transaction.kind === "income") totals.income += transaction.amount;
      else totals.expense += transaction.amount;
      totals.balance = totals.income - totals.expense;
      return totals;
    },
    { income: 0, expense: 0, balance: 0 },
  );
}

export function transactionsForCurrency(
  transactions: readonly Transaction[],
  currency: Currency,
): Transaction[] {
  return transactions.filter((transaction) => transaction.currency === currency);
}

export function calculateCategoryBreakdown(
  transactions: readonly Transaction[],
): CategoryTotal[] {
  const totals = new Map<string, number>();
  transactions.forEach((transaction) => {
    if (transaction.kind === "expense") {
      totals.set(transaction.category, (totals.get(transaction.category) ?? 0) + transaction.amount);
    }
  });

  return Array.from(totals, ([category, amount]) => ({ category, amount })).sort(
    (a, b) => b.amount - a.amount,
  );
}

export function percentageChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function transactionsForMonth(
  transactions: readonly Transaction[],
  date: Date,
): Transaction[] {
  const prefix = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return transactions.filter((transaction) => transaction.date.startsWith(prefix));
}

export function previousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function filterTransactions(
  transactions: readonly Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const query = filters.search.trim().toLocaleLowerCase("es-CL");
  return transactions.filter((transaction) => {
    const matchesSearch = !query || transaction.name.toLocaleLowerCase("es-CL").includes(query);
    const matchesKind = filters.kind === "all" || transaction.kind === filters.kind;
    const matchesCategory = !filters.category || transaction.category === filters.category;
    const matchesDate = !filters.date || transaction.date === filters.date;
    const matchesCurrency = !filters.currency || transaction.currency === filters.currency;
    return matchesSearch && matchesKind && matchesCategory && matchesDate && matchesCurrency;
  });
}

export function transactionKindLabel(kind: TransactionKind): string {
  return kind === "income" ? "Ingreso" : "Gasto";
}
