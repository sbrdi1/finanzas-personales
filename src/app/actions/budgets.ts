"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createOwnedBudget, deleteOwnedBudget, updateOwnedBudget } from "@/data/budgets";
import { budgetFormSchema } from "@/lib/budget-schema";

export type BudgetActionResult = { success: true; message: string } | { success: false; error: string };

function failure(error: unknown): BudgetActionResult {
  console.error("Budget action failed", error);
  return { success: false, error: "No pudimos guardar el presupuesto. Revisa que la categoría no esté repetida para ese mes." };
}

export async function createBudgetAction(input: unknown): Promise<BudgetActionResult> {
  const parsed = budgetFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Los datos del presupuesto no son válidos." };
  try { await createOwnedBudget(parsed.data); revalidatePath("/presupuestos"); return { success: true, message: "Presupuesto creado." }; } catch (error) { return failure(error); }
}

export async function updateBudgetAction(idInput: unknown, input: unknown): Promise<BudgetActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  const parsed = budgetFormSchema.safeParse(input);
  if (!id.success || !parsed.success) return { success: false, error: "Los datos del presupuesto no son válidos." };
  try { await updateOwnedBudget(id.data, parsed.data); revalidatePath("/presupuestos"); return { success: true, message: "Presupuesto actualizado." }; } catch (error) { return failure(error); }
}

export async function deleteBudgetAction(idInput: unknown): Promise<BudgetActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  if (!id.success) return { success: false, error: "El identificador no es válido." };
  try { await deleteOwnedBudget(id.data); revalidatePath("/presupuestos"); return { success: true, message: "Presupuesto eliminado." }; } catch (error) { return failure(error); }
}
