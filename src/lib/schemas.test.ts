import assert from "node:assert/strict";
import test from "node:test";

import { budgetFormSchema } from "./budget-schema";
import { savingGoalFormSchema } from "./saving-goal-schema";
import { transactionFormSchema } from "./transaction-schema";

test("rechaza presupuestos con mes o monto inválido", () => {
  assert.equal(budgetFormSchema.safeParse({ categoryId: "invalid", month: "2026-13", amount: 0 }).success, false);
});

test("rechaza ahorro superior al objetivo", () => {
  assert.equal(savingGoalFormSchema.safeParse({ name: "Viaje", targetAmount: 100, savedAmount: 101, targetDate: "" }).success, false);
});

const transactionInput = { name: "Sueldo", amount: 1000, kind: "income", category: "Ingresos", date: "2026-08-29" };

test("crea movimientos CLP por defecto y acepta creación USD", () => {
  assert.equal(transactionFormSchema.parse(transactionInput).currency, "CLP");
  assert.equal(transactionFormSchema.parse({ ...transactionInput, currency: "USD" }).currency, "USD");
});

test("permite editar la moneda de un movimiento", () => {
  const existing = transactionFormSchema.parse({ ...transactionInput, currency: "CLP" });
  const edited = transactionFormSchema.parse({ ...existing, currency: "USD" });
  assert.equal(edited.currency, "USD");
});
