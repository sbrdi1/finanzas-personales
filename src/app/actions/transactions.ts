"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createOwnedTransaction, deleteOwnedTransaction, updateOwnedTransaction } from "@/data/transactions";
import { transactionFormSchema } from "@/lib/transaction-schema";

export type TransactionActionResult = { success: true } | { success: false; error: string };

function actionError(error: unknown): TransactionActionResult {
  console.error("Transaction action failed", error);
  return { success: false, error: "No pudimos guardar el cambio. Inténtalo nuevamente." };
}

export async function createTransactionAction(input: unknown): Promise<TransactionActionResult> {
  const parsed = transactionFormSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Los datos del movimiento no son válidos." };
  try {
    await createOwnedTransaction(parsed.data);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateTransactionAction(idInput: unknown, input: unknown): Promise<TransactionActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  const parsed = transactionFormSchema.safeParse(input);
  if (!id.success || !parsed.success) return { success: false, error: "Los datos del movimiento no son válidos." };
  try {
    await updateOwnedTransaction(id.data, parsed.data);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteTransactionAction(idInput: unknown): Promise<TransactionActionResult> {
  const id = z.string().cuid().safeParse(idInput);
  if (!id.success) return { success: false, error: "El identificador no es válido." };
  try {
    await deleteOwnedTransaction(id.data);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return actionError(error);
  }
}
