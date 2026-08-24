import assert from "node:assert/strict";
import test from "node:test";

import { budgetFormSchema } from "./budget-schema";
import { savingGoalFormSchema } from "./saving-goal-schema";

test("rechaza presupuestos con mes o monto inválido", () => {
  assert.equal(budgetFormSchema.safeParse({ categoryId: "invalid", month: "2026-13", amount: 0 }).success, false);
});

test("rechaza ahorro superior al objetivo", () => {
  assert.equal(savingGoalFormSchema.safeParse({ name: "Viaje", targetAmount: 100, savedAmount: 101, targetDate: "" }).success, false);
});
