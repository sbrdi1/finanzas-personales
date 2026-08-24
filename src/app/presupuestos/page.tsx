import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BudgetWorkspace } from "@/components/budgets/BudgetWorkspace";
import { WorkspaceShell } from "@/components/dashboard/WorkspaceShell";
import { getBudgetPageData } from "@/data/budgets";
import { getSavingGoalsForCurrentUser } from "@/data/saving-goals";
import { monthSchema } from "@/lib/budget-schema";
import { formatMonth } from "@/lib/formatters";

function currentMonth() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; }

export default async function BudgetsPage({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const requested = (await searchParams).mes;
  const month = monthSchema.safeParse(requested).success ? requested! : currentMonth();
  const [{ budgets, categories }, goals] = await Promise.all([getBudgetPageData(month), getSavingGoalsForCurrentUser()]);
  const date = new Date(`${month}-01T12:00:00`);
  return <WorkspaceShell userName={session.user.name ?? null}>
    <header><div><small>PLANIFICACIÓN FINANCIERA</small><h1>Presupuestos y metas</h1><p>Control para {formatMonth(date)} basado en tus movimientos reales.</p></div></header>
    <BudgetWorkspace budgets={budgets} categories={categories} goals={goals} month={month} />
  </WorkspaceShell>;
}
