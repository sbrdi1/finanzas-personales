import "server-only";

import { auth } from "@/auth";
import type { SavingGoalFormValues } from "@/lib/saving-goal-schema";
import { prisma } from "@/lib/prisma";
import { savingGoalPercentage } from "@/lib/progress";
import type { SavingGoal } from "@/types/saving-goal";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");
  return session.user.id;
}

export async function getSavingGoalsForCurrentUser(): Promise<SavingGoal[]> {
  const userId = await requireUserId();
  const rows = await prisma.savingGoal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return rows.map((row) => {
    const targetAmount = row.targetAmount.toNumber();
    const savedAmount = row.savedAmount.toNumber();
    return {
      id: row.id,
      name: row.name,
      targetAmount,
      savedAmount,
      targetDate: row.targetDate?.toISOString().slice(0, 10) ?? null,
      percentage: savingGoalPercentage(targetAmount, savedAmount),
    };
  });
}

export async function createOwnedSavingGoal(input: SavingGoalFormValues) {
  const userId = await requireUserId();
  await prisma.savingGoal.create({ data: { userId, name: input.name, targetAmount: input.targetAmount, savedAmount: input.savedAmount, targetDate: input.targetDate ? new Date(`${input.targetDate}T00:00:00.000Z`) : null } });
}

export async function updateOwnedSavingGoal(id: string, input: SavingGoalFormValues) {
  const userId = await requireUserId();
  const result = await prisma.savingGoal.updateMany({ where: { id, userId }, data: { name: input.name, targetAmount: input.targetAmount, savedAmount: input.savedAmount, targetDate: input.targetDate ? new Date(`${input.targetDate}T00:00:00.000Z`) : null } });
  if (result.count !== 1) throw new Error("Meta no encontrada");
}

export async function deleteOwnedSavingGoal(id: string) {
  const userId = await requireUserId();
  const result = await prisma.savingGoal.deleteMany({ where: { id, userId } });
  if (result.count !== 1) throw new Error("Meta no encontrada");
}
