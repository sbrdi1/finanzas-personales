import assert from "node:assert/strict";
import test from "node:test";

import { calculateTotals, percentageChange, previousMonth, transactionsForMonth } from "./finance";

const transactions = [
  { id: "1", name: "Sueldo", category: "Ingresos", amount: 100_000, kind: "income" as const, date: "2026-08-05" },
  { id: "2", name: "Comida", category: "Alimentación", amount: 25_000, kind: "expense" as const, date: "2026-08-06" },
  { id: "3", name: "Sueldo anterior", category: "Ingresos", amount: 80_000, kind: "income" as const, date: "2026-07-05" },
];

test("calcula totales reales del mes seleccionado", () => {
  const totals = calculateTotals(transactionsForMonth(transactions, new Date(2026, 7, 1)));
  assert.deepEqual(totals, { income: 100_000, expense: 25_000, balance: 75_000 });
});

test("calcula variación y mes anterior", () => {
  assert.equal(percentageChange(100_000, 80_000), 25);
  assert.equal(previousMonth(new Date(2026, 0, 1)).getMonth(), 11);
});
