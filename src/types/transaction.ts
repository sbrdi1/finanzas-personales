export type TransactionKind = "income" | "expense";

export type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  kind: TransactionKind;
  date: string;
};

export type TransactionFilters = {
  search: string;
  kind: TransactionKind | "all";
  category: string;
  date: string;
};
