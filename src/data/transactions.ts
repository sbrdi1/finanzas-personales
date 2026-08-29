import "server-only";

import { Currency as PrismaCurrency, TransactionKind as PrismaTransactionKind } from "@prisma/client";

import { auth } from "@/auth";
import { expenseCategories, incomeCategory } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import type { Transaction } from "@/types/transaction";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user.id;
}

async function ensureDefaults(userId: string) {
  await prisma.$transaction([
    prisma.financialAccount.upsert({
      where: { userId_name: { userId, name: "Cuenta principal" } },
      update: {},
      create: { userId, name: "Cuenta principal", type: "CHECKING", currency: "CLP" },
    }),
    prisma.category.upsert({
      where: { userId_name_kind: { userId, name: incomeCategory, kind: "INCOME" } },
      update: {},
      create: { userId, name: incomeCategory, color: "#20bf9f", kind: "INCOME" },
    }),
    ...expenseCategories.map((category) => prisma.category.upsert({
      where: { userId_name_kind: { userId, name: category.name, kind: "EXPENSE" } },
      update: { color: category.color },
      create: { userId, name: category.name, color: category.color, kind: "EXPENSE" },
    })),
  ]);
}

export async function getTransactionsForCurrentUser(): Promise<Transaction[]> {
  const userId = await requireUserId();
  await ensureDefaults(userId);
  const rows = await prisma.transaction.findMany({
    where: { userId },
    include: { category: { select: { name: true } } },
    orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category.name,
    amount: row.amount.toNumber(),
    currency: row.currency,
    kind: row.kind === "INCOME" ? "income" : "expense",
    date: row.occurredAt.toISOString().slice(0, 10),
  }));
}

type TransactionMutation = {
  name: string;
  amount: number;
  currency: "CLP" | "USD";
  kind: "income" | "expense";
  category: string;
  date: string;
};

async function mutationRelations(userId: string, input: TransactionMutation) {
  await ensureDefaults(userId);
  const kind: PrismaTransactionKind = input.kind === "income" ? "INCOME" : "EXPENSE";
  const categoryName = input.kind === "income" ? incomeCategory : input.category;
  const [account, category] = await Promise.all([
    prisma.financialAccount.findUnique({ where: { userId_name: { userId, name: "Cuenta principal" } }, select: { id: true } }),
    prisma.category.findUnique({ where: { userId_name_kind: { userId, name: categoryName, kind } }, select: { id: true } }),
  ]);
  if (!account || !category) throw new Error("No se pudo resolver la cuenta o categoría");
  return { accountId: account.id, categoryId: category.id, kind };
}

export async function createOwnedTransaction(input: TransactionMutation): Promise<void> {
  const userId = await requireUserId();
  const relations = await mutationRelations(userId, input);
  await prisma.transaction.create({
    data: {
      userId,
      ...relations,
      name: input.name,
      amount: input.amount,
      currency: input.currency as PrismaCurrency,
      occurredAt: new Date(`${input.date}T00:00:00.000Z`),
    },
  });
}

export async function updateOwnedTransaction(id: string, input: TransactionMutation): Promise<void> {
  const userId = await requireUserId();
  const relations = await mutationRelations(userId, input);
  const result = await prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      ...relations,
      name: input.name,
      amount: input.amount,
      currency: input.currency as PrismaCurrency,
      occurredAt: new Date(`${input.date}T00:00:00.000Z`),
    },
  });
  if (result.count !== 1) throw new Error("Movimiento no encontrado");
}

export async function deleteOwnedTransaction(id: string): Promise<void> {
  const userId = await requireUserId();
  const result = await prisma.transaction.deleteMany({ where: { id, userId } });
  if (result.count !== 1) throw new Error("Movimiento no encontrado");
}
