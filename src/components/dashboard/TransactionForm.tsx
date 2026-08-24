"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { expenseCategoryNames, incomeCategory } from "@/lib/categories";
import { toIsoDate } from "@/lib/formatters";
import { transactionFormSchema, type TransactionFormInput, type TransactionFormValues } from "@/lib/transaction-schema";
import type { Transaction } from "@/types/transaction";

type TransactionFormProps = {
  transaction: Transaction | null;
  onCancel: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  serverError: string | null;
};

export function TransactionForm({ transaction, onCancel, onSubmit, serverError }: TransactionFormProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      name: transaction?.name ?? "",
      amount: transaction?.amount ?? undefined,
      kind: transaction?.kind ?? "expense",
      category: transaction?.category ?? expenseCategoryNames[0],
      date: transaction?.date ?? toIsoDate(new Date()),
    },
  });
  const kind = useWatch({ control, name: "kind" });

  useEffect(() => {
    setValue("category", kind === "income" ? incomeCategory : transaction?.kind === "expense" ? transaction.category : expenseCategoryNames[0], { shouldValidate: true });
  }, [kind, setValue, transaction]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled])"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="backdrop" onMouseDown={onCancel}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-title"><div><small>{transaction ? "EDITAR" : "REGISTRAR"}</small><h2 id="modalTitle">{transaction ? "Editar movimiento" : "Nuevo movimiento"}</h2></div><button onClick={onCancel} aria-label="Cerrar">×</button></div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="switch"><legend className="sr-only">Tipo de movimiento</legend><label><input type="radio" value="expense" {...register("kind")} /><span>Gasto</span></label><label><input type="radio" value="income" {...register("kind")} /><span>Ingreso</span></label></fieldset>
          <label>Descripción<input {...register("name")} autoFocus placeholder="Ej. Compra supermercado" aria-invalid={Boolean(errors.name)} />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
          <label>Monto (CLP)<input {...register("amount", { valueAsNumber: true })} type="number" min="1" inputMode="numeric" placeholder="0" aria-invalid={Boolean(errors.amount)} />{errors.amount && <span className="field-error">{errors.amount.message}</span>}</label>
          {kind === "expense" && <label>Categoría<select {...register("category")} aria-invalid={Boolean(errors.category)}>{expenseCategoryNames.map((category) => <option key={category}>{category}</option>)}</select>{errors.category && <span className="field-error">{errors.category.message}</span>}</label>}
          <label>Fecha<input {...register("date")} type="date" aria-invalid={Boolean(errors.date)} />{errors.date && <span className="field-error">{errors.date.message}</span>}</label>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          <button className="primary save" disabled={isSubmitting}>{transaction ? "Guardar cambios" : "Guardar movimiento"}</button>
        </form>
      </div>
    </div>
  );
}
