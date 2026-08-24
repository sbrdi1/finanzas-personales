import type { FinancialTotals } from "@/lib/finance";
import { formatCurrency } from "@/lib/formatters";

type CashFlowChartProps = {
  totals: FinancialTotals;
  periodLabel: string;
};

export function CashFlowChart({ totals, periodLabel }: CashFlowChartProps) {
  const max = Math.max(totals.income, totals.expense, 1);
  const savingRate = totals.income ? Math.round((totals.balance / totals.income) * 100) : null;

  return (
    <article className="panel flow">
      <div className="title">
        <div><h2>Flujo de dinero</h2><p>Ingresos y gastos del mes</p></div>
        <span className="period-label">{periodLabel}</span>
      </div>
      <div className="chart">
        <div className="axis"><span>{formatCurrency(max)}</span><span>{formatCurrency(max / 2)}</span><span>$0</span></div>
        <div className="plot">
          <div className="barset"><i className="income" style={{ height: `${(totals.income / max) * 100}%` }} /><span>Ingresos</span></div>
          <div className="barset"><i className="expense" style={{ height: `${totals.expense ? Math.max(8, (totals.expense / max) * 100) : 0}%` }} /><span>Gastos</span></div>
          <div className="saving">
            <span>Balance del mes</span><b>{formatCurrency(totals.balance)}</b>
            <small>{savingRate === null ? "Agrega un ingreso para calcular tu ahorro" : `Ahorro sobre ingresos: ${savingRate}%`}</small>
          </div>
        </div>
      </div>
    </article>
  );
}
