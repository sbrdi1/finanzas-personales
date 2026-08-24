"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createOwnedSavingGoal, deleteOwnedSavingGoal, updateOwnedSavingGoal } from "@/data/saving-goals";
import { savingGoalFormSchema } from "@/lib/saving-goal-schema";
type SavingGoalActionResult = { success: true; message: string } | { success: false; error: string };

function failure(error: unknown): SavingGoalActionResult {
  console.error("Saving goal action failed", error);
  return { success: false, error: "No pudimos guardar la meta. Inténtalo nuevamente." };
}

export async function createSavingGoalAction(input: unknown): Promise<SavingGoalActionResult> {
  const parsed = savingGoalFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Los datos de la meta no son válidos." };
  try { await createOwnedSavingGoal(parsed.data); revalidatePath("/presupuestos"); return { success: true, message: "Meta creada." }; } catch (error) { return failure(error); }
}

export async function updateSavingGoalAction(idInput: unknown, input: unknown): Promise<SavingGoalActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  const parsed = savingGoalFormSchema.safeParse(input);
  if (!id.success || !parsed.success) return { success: false, error: "Los datos de la meta no son válidos." };
  try { await updateOwnedSavingGoal(id.data, parsed.data); revalidatePath("/presupuestos"); return { success: true, message: "Meta actualizada." }; } catch (error) { return failure(error); }
}

export async function deleteSavingGoalAction(idInput: unknown): Promise<SavingGoalActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  if (!id.success) return { success: false, error: "El identificador no es válido." };
  try { await deleteOwnedSavingGoal(id.data); revalidatePath("/presupuestos"); return { success: true, message: "Meta eliminada." }; } catch (error) { return failure(error); }
}
