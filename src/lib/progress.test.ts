import assert from "node:assert/strict";
import test from "node:test";

import { budgetMetrics, budgetStatus, savingGoalPercentage } from "./progress";

test("calcula avance y restante del presupuesto", () => {
  assert.deepEqual(budgetMetrics(100_000, 82_000), { remaining: 18_000, percentage: 82 });
  assert.equal(budgetStatus(79.9), "safe");
  assert.equal(budgetStatus(80), "warning");
  assert.equal(budgetStatus(100), "over");
});

test("calcula progreso de meta de ahorro", () => {
  assert.equal(savingGoalPercentage(500_000, 125_000), 25);
});
