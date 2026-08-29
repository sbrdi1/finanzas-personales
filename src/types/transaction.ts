export type TransactionKind = "income" | "expense";
export type Currency = "CLP" | "USD";

export type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: Currency;
  kind: TransactionKind;
  date: string;
};

export type TransactionFilters = {
  search: string;
  kind: TransactionKind | "all";
  category: string;
  date: string;
  currency: Currency | "";
};
