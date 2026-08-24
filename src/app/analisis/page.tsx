import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { WorkspaceShell } from "@/components/dashboard/WorkspaceShell";
import { getAnalyticsForCurrentUser } from "@/data/analytics";

export default async function AnalysisPage({ searchParams }: { searchParams: Promise<{ periodo?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const months = (await searchParams).periodo === "12" ? 12 : 6;
  const data = await getAnalyticsForCurrentUser(months);
  return <WorkspaceShell userName={session.user.name ?? null}><header><div><small>HISTORIAL REAL</small><h1>Análisis financiero</h1><p>Comprende cómo evolucionan tus ingresos, gastos y ahorro.</p></div></header><AnalyticsDashboard data={data} months={months} /></WorkspaceShell>;
}
