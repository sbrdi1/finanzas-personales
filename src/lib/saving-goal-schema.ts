import { z } from "zod";

export const savingGoalFormSchema = z.object({
  name: z.string().trim().min(2, "Ingresa al menos 2 caracteres").max(80, "Máximo 80 caracteres"),
  targetAmount: z.coerce.number().positive("El monto objetivo debe ser mayor que cero").max(999_999_999),
  savedAmount: z.coerce.number().min(0, "El monto ahorrado no puede ser negativo").max(999_999_999),
  targetDate: z.union([z.literal(""), z.iso.date("Ingresa una fecha válida")]),
}).refine((value) => value.savedAmount <= value.targetAmount, {
  path: ["savedAmount"],
  message: "El monto ahorrado no puede superar el objetivo",
});

export type SavingGoalFormValues = z.infer<typeof savingGoalFormSchema>;
