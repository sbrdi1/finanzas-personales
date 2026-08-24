"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createBudgetAction, deleteBudgetAction, updateBudgetAction } from "@/app/actions/budgets";
import { createSavingGoalAction, deleteSavingGoalAction, updateSavingGoalAction } from "@/app/actions/saving-goals";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import { budgetStatus } from "@/lib/progress";
import type { BudgetProgress, ExpenseCategory } from "@/types/budget";
import type { SavingGoal } from "@/types/saving-goal";

type Notice = { kind: "success" | "error"; text: string } | null;

export function BudgetWorkspace({ budgets, categories, goals, month }: { budgets: BudgetProgress[]; categories: ExpenseCategory[]; goals: SavingGoal[]; month: string }) {
  const router = useRouter();
  const [notice, setNotice] = useState<Notice>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetProgress | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [isPending, startTransition] = useTransition();

  function refreshWith(result: Awaited<ReturnType<typeof createBudgetAction>>) {
    setNotice(result.success ? { kind: "success", text: result.message } : { kind: "error", text: result.error });
    if (result.success) { setEditingBudget(null); setEditingGoal(null); startTransition(() => router.refresh()); }
  }

  async function saveBudget(formData: FormData) {
    const input = { categoryId: formData.get("categoryId"), month, amount: formData.get("amount") };
    refreshWith(editingBudget ? await updateBudgetAction(editingBudget.id, input) : await createBudgetAction(input));
  }

  async function saveGoal(formData: FormData) {
    const input = { name: formData.get("name"), targetAmount: formData.get("targetAmount"), savedAmount: formData.get("savedAmount"), targetDate: formData.get("targetDate") };
    refreshWith(editingGoal ? await updateSavingGoalAction(editingGoal.id, input) : await createSavingGoalAction(input));
  }

  async function removeBudget(budget: BudgetProgress) {
    if (!window.confirm(`¿Eliminar el presupuesto de ${budget.category}?`)) return;
    refreshWith(await deleteBudgetAction(budget.id));
  }

  async function removeGoal(goal: SavingGoal) {
    if (!window.confirm(`¿Eliminar la meta “${goal.name}”?`)) return;
    refreshWith(await deleteSavingGoalAction(goal.id));
  }

  return <div aria-busy={isPending}>
    {notice && <div className={`notice ${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>{notice.text}</div>}
    <section className="panel budget-toolbar">
      <div><h2>Periodo</h2><p>Los gastos se calculan con movimientos reales del mes.</p></div>
      <input aria-label="Mes de presupuestos" type="month" value={month} onChange={(event) => router.push(`/presupuestos?mes=${event.target.value}`)} />
    </section>

    <section className="budget-layout">
      <div className="panel">
        <div className="title"><div><h2>Presupuestos mensuales</h2><p>Límites por categoría de gasto</p></div></div>
        {budgets.length === 0 ? <div className="empty"><b>Sin presupuestos para este mes</b><span>Crea uno para controlar tus gastos.</span></div> : <div className="budget-list">{budgets.map((budget) => {
          const state = budgetStatus(budget.percentage);
          return <article className={`progress-card ${state}`} key={budget.id}>
            <div className="progress-heading"><span><i style={{ background: budget.color }} />{budget.category}</span><b>{Math.round(budget.percentage)}%</b></div>
            <div className="progress-track"><i style={{ width: `${Math.min(100, budget.percentage)}%` }} /></div>
            <dl><div><dt>Presupuesto</dt><dd>{formatCurrency(budget.amount)}</dd></div><div><dt>Gastado</dt><dd>{formatCurrency(budget.spent)}</dd></div><div><dt>{budget.remaining >= 0 ? "Restante" : "Excedido"}</dt><dd>{formatCurrency(Math.abs(budget.remaining))}</dd></div></dl>
            <div className="card-actions"><button onClick={() => setEditingBudget(budget)}>Editar</button><button className="danger" onClick={() => removeBudget(budget)}>Eliminar</button></div>
          </article>;
        })}</div>}
      </div>
      <form className="panel compact-form" action={saveBudget} key={editingBudget?.id ?? "new-budget"}>
        <div className="title"><div><h2>{editingBudget ? "Editar presupuesto" : "Nuevo presupuesto"}</h2><p>{month}</p></div></div>
        <label>Categoría<select name="categoryId" defaultValue={editingBudget?.categoryId} required>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
        <label>Monto máximo mensual<input name="amount" type="number" min="1" max="999999999" defaultValue={editingBudget?.amount} required /></label>
        <button className="primary" disabled={isPending}>{editingBudget ? "Guardar cambios" : "Crear presupuesto"}</button>
        {editingBudget && <button type="button" className="secondary" onClick={() => setEditingBudget(null)}>Cancelar</button>}
      </form>
    </section>

    <section className="budget-layout goals-section">
      <div className="panel">
        <div className="title"><div><h2>Metas de ahorro</h2><p>Objetivos separados de tus presupuestos</p></div></div>
        {goals.length === 0 ? <div className="empty"><b>Aún no tienes metas</b><span>Crea una meta para visualizar tu progreso.</span></div> : <div className="budget-list">{goals.map((goal) => <article className="progress-card goal" key={goal.id}>
          <div className="progress-heading"><span>{goal.name}</span><b>{Math.round(goal.percentage)}%</b></div>
          <div className="progress-track"><i style={{ width: `${Math.min(100, goal.percentage)}%` }} /></div>
          <dl><div><dt>Objetivo</dt><dd>{formatCurrency(goal.targetAmount)}</dd></div><div><dt>Ahorrado</dt><dd>{formatCurrency(goal.savedAmount)}</dd></div><div><dt>Fecha</dt><dd>{goal.targetDate ? formatShortDate(goal.targetDate) : "Sin fecha"}</dd></div></dl>
          <div className="card-actions"><button onClick={() => setEditingGoal(goal)}>Editar</button><button className="danger" onClick={() => removeGoal(goal)}>Eliminar</button></div>
        </article>)}</div>}
      </div>
      <form className="panel compact-form" action={saveGoal} key={editingGoal?.id ?? "new-goal"}>
        <div className="title"><div><h2>{editingGoal ? "Editar meta" : "Nueva meta"}</h2><p>Define un objetivo alcanzable</p></div></div>
        <label>Nombre<input name="name" maxLength={80} defaultValue={editingGoal?.name} required /></label>
        <label>Monto objetivo<input name="targetAmount" type="number" min="1" defaultValue={editingGoal?.targetAmount} required /></label>
        <label>Monto ahorrado<input name="savedAmount" type="number" min="0" defaultValue={editingGoal?.savedAmount ?? 0} required /></label>
        <label>Fecha objetivo (opcional)<input name="targetDate" type="date" defaultValue={editingGoal?.targetDate ?? ""} /></label>
        <button className="primary" disabled={isPending}>{editingGoal ? "Guardar cambios" : "Crear meta"}</button>
        {editingGoal && <button type="button" className="secondary" onClick={() => setEditingGoal(null)}>Cancelar</button>}
      </form>
    </section>
  </div>;
}
