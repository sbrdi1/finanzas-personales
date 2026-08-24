export type BudgetProgress = {
  id: string;
  categoryId: string;
  category: string;
  color: string;
  month: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
};

export type ExpenseCategory = { id: string; name: string; color: string };
