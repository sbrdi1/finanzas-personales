import assert from "node:assert/strict";
import test from "node:test";

import { calculateTotals, percentageChange, previousMonth, transactionsForCurrency, transactionsForMonth } from "./finance";
import { formatCurrency } from "./formatters";
import type { Transaction } from "../types/transaction";

const transactions: Transaction[] = [
  { id: "1", name: "Sueldo", category: "Ingresos", amount: 100_000, currency: "CLP", kind: "income", date: "2026-08-05" },
  { id: "2", name: "Comida", category: "Alimentación", amount: 25_000, currency: "CLP", kind: "expense", date: "2026-08-06" },
  { id: "3", name: "Sueldo anterior", category: "Ingresos", amount: 80_000, currency: "CLP", kind: "income", date: "2026-07-05" },
  { id: "4", name: "Ingreso USD", category: "Ingresos", amount: 100, currency: "USD", kind: "income", date: "2026-08-07" },
  { id: "5", name: "Gasto USD", category: "Alimentación", amount: 25.5, currency: "USD", kind: "expense", date: "2026-08-08" },
];

test("calcula totales reales del mes seleccionado", () => {
  const totals = calculateTotals(transactionsForCurrency(transactionsForMonth(transactions, new Date(2026, 7, 1)), "CLP"));
  assert.deepEqual(totals, { income: 100_000, expense: 25_000, balance: 75_000 });
});

test("calcula variación y mes anterior", () => {
  assert.equal(percentageChange(100_000, 80_000), 25);
  assert.equal(previousMonth(new Date(2026, 0, 1)).getMonth(), 11);
});

test("mantiene los totales CLP y USD completamente separados", () => {
  const august = transactionsForMonth(transactions, new Date(2026, 7, 1));
  assert.deepEqual(calculateTotals(transactionsForCurrency(august, "CLP")), { income: 100_000, expense: 25_000, balance: 75_000 });
  assert.deepEqual(calculateTotals(transactionsForCurrency(august, "USD")), { income: 100, expense: 25.5, balance: 74.5 });
});

test("USD no afecta presupuestos CLP", () => {
  const clpSpending = transactionsForCurrency(transactions, "CLP").filter((transaction) => transaction.kind === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);
  assert.equal(clpSpending, 25_000);
});

test("formatea CLP y USD con símbolos y decimales correctos", () => {
  assert.equal(formatCurrency(18_000, "CLP"), "$18.000");
  assert.equal(formatCurrency(25.5, "USD"), "US$25.50");
});
