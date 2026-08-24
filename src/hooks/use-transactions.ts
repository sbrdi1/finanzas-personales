"use client";

import { useCallback, useEffect, useState } from "react";

import { storedTransactionsSchema } from "@/lib/transaction-schema";
import type { Transaction } from "@/types/transaction";

const storageKey = "finova-movements";

function readTransactions(): Transaction[] {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];
    const result = storedTransactionsSchema.safeParse(JSON.parse(saved));
    if (result.success) return result.data;
    localStorage.removeItem(storageKey);
  } catch {
    localStorage.removeItem(storageKey);
  }
  return [];
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTransactions(readTransactions());
      setIsLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [isLoaded, transactions]);

  const createTransaction = useCallback((transaction: Transaction) => {
    setTransactions((current) => [transaction, ...current]);
  }, []);

  const updateTransaction = useCallback((transaction: Transaction) => {
    setTransactions((current) => current.map((item) => (item.id === transaction.id ? transaction : item)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }, []);

  return { transactions, isLoaded, createTransaction, updateTransaction, deleteTransaction };
}
