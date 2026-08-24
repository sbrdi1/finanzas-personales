export function budgetMetrics(amount: number, spent: number) {
  return { remaining: amount - spent, percentage: amount > 0 ? (spent / amount) * 100 : 0 };
}

export function budgetStatus(percentage: number): "safe" | "warning" | "over" {
  if (percentage >= 100) return "over";
  if (percentage >= 80) return "warning";
  return "safe";
}

export function savingGoalPercentage(targetAmount: number, savedAmount: number) {
  return targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
}
