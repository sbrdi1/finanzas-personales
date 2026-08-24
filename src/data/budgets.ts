import "server-only";

import { auth } from "@/auth";
import { expenseCategories } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { budgetMetrics } from "@/lib/progress";
import type { BudgetFormValues } from "@/lib/budget-schema";
import type { BudgetProgress, ExpenseCategory } from "@/types/budget";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user.id;
}

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, monthNumber - 1, 1)),
    end: new Date(Date.UTC(year, monthNumber, 1)),
  };
}

async function ensureExpenseCategories(userId: string) {
  await prisma.$transaction(expenseCategories.map((category) => prisma.category.upsert({
    where: { userId_name_kind: { userId, name: category.name, kind: "EXPENSE" } },
    update: { color: category.color },
    create: { userId, name: category.name, color: category.color, kind: "EXPENSE" },
  })));
}

export async function getBudgetPageData(month: string): Promise<{ budgets: BudgetProgress[]; categories: ExpenseCategory[] }> {
  const userId = await requireUserId();
  await ensureExpenseCategories(userId);
  const { start, end } = monthRange(month);
  const [budgets, categories, spending] = await Promise.all([
    prisma.budget.findMany({
      where: { userId, month: start },
      include: { category: { select: { name: true, color: true } } },
      orderBy: { category: { name: "asc" } },
    }),
    prisma.category.findMany({ where: { userId, kind: "EXPENSE" }, select: { id: true, name: true, color: true }, orderBy: { name: "asc" } }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, kind: "EXPENSE", occurredAt: { gte: start, lt: end } },
      _sum: { amount: true },
    }),
  ]);
  const spentByCategory = new Map(spending.map((item) => [item.categoryId, item._sum.amount?.toNumber() ?? 0]));
  return {
    categories,
    budgets: budgets.map((budget) => {
      const amount = budget.amount.toNumber();
      const spent = spentByCategory.get(budget.categoryId) ?? 0;
      const metrics = budgetMetrics(amount, spent);
      return {
        id: budget.id,
        categoryId: budget.categoryId,
        category: budget.category.name,
        color: budget.category.color,
        month,
        amount,
        spent,
        ...metrics,
      };
    }),
  };
}

async function assertOwnedExpenseCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId, kind: "EXPENSE" }, select: { id: true } });
  if (!category) throw new Error("Categoría no encontrada");
}

export async function createOwnedBudget(input: BudgetFormValues) {
  const userId = await requireUserId();
  await assertOwnedExpenseCategory(userId, input.categoryId);
  await prisma.budget.create({ data: { userId, categoryId: input.categoryId, month: monthRange(input.month).start, amount: input.amount } });
}

export async function updateOwnedBudget(id: string, input: BudgetFormValues) {
  const userId = await requireUserId();
  await assertOwnedExpenseCategory(userId, input.categoryId);
  const result = await prisma.budget.updateMany({ where: { id, userId }, data: { categoryId: input.categoryId, month: monthRange(input.month).start, amount: input.amount } });
  if (result.count !== 1) throw new Error("Presupuesto no encontrado");
}

export async function deleteOwnedBudget(id: string) {
  const userId = await requireUserId();
  const result = await prisma.budget.deleteMany({ where: { id, userId } });
  if (result.count !== 1) throw new Error("Presupuesto no encontrado");
}
