import Link from "next/link";

import { formatCurrency } from "@/lib/formatters";
import type { AnalyticsData } from "@/types/analytics";

const monthLabel = new Intl.DateTimeFormat("es-CL", { month: "short", year: "2-digit", timeZone: "UTC" });

export function AnalyticsDashboard({ data, months }: { data: AnalyticsData; months: 6 | 12 }) {
  const max = Math.max(1, ...data.series.flatMap((point) => [point.income, point.expense]));
  const latest = data.series.at(-1)!;
  return <>
    <div className="range-switch" aria-label="Rango de análisis"><Link className={months === 6 ? "active" : undefined} href="/analisis?periodo=6">6 meses</Link><Link className={months === 12 ? "active" : undefined} href="/analisis?periodo=12">12 meses</Link></div>
    <section className="summary analysis-summary">
      <article><div><span>Ingresos del mes</span></div><strong>{formatCurrency(latest.income)}</strong></article>
      <article><div><span>Gastos del mes</span></div><strong>{formatCurrency(latest.expense)}</strong></article>
      <article className="balance"><div><span>Ahorro del mes</span></div><strong>{formatCurrency(latest.balance)}</strong><small>{latest.savingRate === null ? "Sin ingresos" : `Tasa de ahorro: ${latest.savingRate.toLocaleString("es-CL", { maximumFractionDigits: 1 })}%`}</small></article>
    </section>
    <section className="panel historical-chart">
      <div className="title"><div><h2>Evolución mensual</h2><p>Ingresos, gastos y balance con datos reales</p></div></div>
      {data.series.every((point) => point.income === 0 && point.expense === 0) ? <div className="empty"><b>Sin datos para analizar</b><span>Agrega movimientos para construir tu historial.</span></div> : <div className="history-bars">{data.series.map((point) => <div className="history-month" key={point.month} title={`Balance: ${formatCurrency(point.balance)}`}><div className="history-columns"><i className="income" style={{ height: `${Math.max(point.income ? 4 : 0, point.income / max * 100)}%` }} /><i className="expense" style={{ height: `${Math.max(point.expense ? 4 : 0, point.expense / max * 100)}%` }} /></div><span>{monthLabel.format(new Date(`${point.month}-01T00:00:00Z`))}</span><small className={point.balance >= 0 ? "positive" : "negative"}>{formatCurrency(point.balance)}</small></div>)}</div>}
      <div className="chart-legend"><span><i className="income" />Ingresos</span><span><i className="expense" />Gastos</span></div>
    </section>
    <section className="panel analysis-categories">
      <div className="title"><div><h2>Principales categorías de gasto</h2><p>Acumulado de los últimos {months} meses</p></div></div>
      {data.categories.length === 0 ? <div className="empty compact"><b>Sin gastos registrados</b></div> : <div className="ranking">{data.categories.map((item, index) => <div key={item.category}><b>{index + 1}</b><i style={{ background: item.color }} /><span>{item.category}</span><strong>{formatCurrency(item.amount)}</strong></div>)}</div>}
    </section>
  </>;
}
