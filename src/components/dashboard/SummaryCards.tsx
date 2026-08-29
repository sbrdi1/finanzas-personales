import type { FinancialTotals } from "@/lib/finance";
import { percentageChange } from "@/lib/finance";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import type { Currency } from "@/types/transaction";

type SummaryCardsProps = {
  current: FinancialTotals;
  previous: FinancialTotals;
  currency: Currency;
};

function Comparison({ current, previous }: { current: number; previous: number }) {
  const change = percentageChange(current, previous);
  if (change === null) return <small>{formatPercentage(change)}</small>;
  const trend = change >= 0 ? "up" : "down";
  return <small className={trend}>{change >= 0 ? "↑" : "↓"} {formatPercentage(change)} <em>vs. mes anterior</em></small>;
}

export function SummaryCards({ current, previous, currency }: SummaryCardsProps) {
  return (
    <section className="summary" aria-label="Resumen financiero">
      <article className="balance">
        <div><span>Ahorro del mes</span><i aria-hidden="true">◇</i></div>
        <strong>{formatCurrency(current.balance, currency)}</strong>
        <small>Ingresos menos gastos</small>
      </article>
      <article>
        <div><span>Ingresos</span><i className="green" aria-hidden="true">↑</i></div>
        <strong>{formatCurrency(current.income, currency)}</strong>
        <Comparison current={current.income} previous={previous.income} />
      </article>
      <article>
        <div><span>Gastos</span><i className="red" aria-hidden="true">↓</i></div>
        <strong>{formatCurrency(current.expense, currency)}</strong>
        <Comparison current={current.expense} previous={previous.expense} />
      </article>
    </section>
  );
}
