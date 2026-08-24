import { z } from "zod";

import { expenseCategoryNames } from "@/lib/categories";

export const transactionFormSchema = z
  .object({
    name: z.string().trim().min(2, "Ingresa al menos 2 caracteres").max(80, "Máximo 80 caracteres"),
    amount: z.coerce.number().positive("El monto debe ser mayor que cero").max(999_999_999, "El monto es demasiado alto"),
    kind: z.enum(["income", "expense"]),
    category: z.string(),
    date: z.iso.date("Ingresa una fecha válida"),
  })
  .superRefine((value, context) => {
    if (value.kind === "expense" && !expenseCategoryNames.some((category) => category === value.category)) {
      context.addIssue({
        code: "custom",
        path: ["category"],
        message: "Selecciona una categoría válida",
      });
    }
  });

export const storedTransactionSchema = transactionFormSchema.extend({
  id: z.string().min(1),
});

export const storedTransactionsSchema = z.array(storedTransactionSchema);

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type TransactionFormInput = z.input<typeof transactionFormSchema>;
