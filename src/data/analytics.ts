import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { AnalyticsData, MonthlyPoint } from "@/types/analytics";
import type { Currency } from "@/types/transaction";

export async function getAnalyticsForCurrentUser(months: 6 | 12, currency: Currency): Promise<AnalyticsData> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months + 1, 1));
  const rows = await prisma.transaction.findMany({
    where: { userId: session.user.id, currency, occurredAt: { gte: start } },
    select: { amount: true, kind: true, occurredAt: true, category: { select: { name: true, color: true } } },
    orderBy: { occurredAt: "asc" },
  });
  const monthMap = new Map<string, MonthlyPoint>();
  for (let offset = months - 1; offset >= 0; offset--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    const key = date.toISOString().slice(0, 7);
    monthMap.set(key, { month: key, income: 0, expense: 0, balance: 0, savingRate: null });
  }
  const categories = new Map<string, { category: string; color: string; amount: number }>();
  rows.forEach((row) => {
    const key = row.occurredAt.toISOString().slice(0, 7);
    const point = monthMap.get(key);
    if (!point) return;
    const amount = row.amount.toNumber();
    if (row.kind === "INCOME") point.income += amount;
    else {
      point.expense += amount;
      const current = categories.get(row.category.name);
      categories.set(row.category.name, { category: row.category.name, color: row.category.color, amount: (current?.amount ?? 0) + amount });
    }
  });
  const series = Array.from(monthMap.values()).map((point) => ({ ...point, balance: point.income - point.expense, savingRate: point.income ? ((point.income - point.expense) / point.income) * 100 : null }));
  return { series, categories: Array.from(categories.values()).sort((a, b) => b.amount - a.amount).slice(0, 6) };
}
