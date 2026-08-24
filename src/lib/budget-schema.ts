import { z } from "zod";

export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Selecciona un mes válido");

export const budgetFormSchema = z.object({
  categoryId: z.string().cuid("Selecciona una categoría válida"),
  month: monthSchema,
  amount: z.coerce.number().positive("El monto debe ser mayor que cero").max(999_999_999, "El monto es demasiado alto"),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
