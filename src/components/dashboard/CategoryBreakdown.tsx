import { categoryColors } from "@/lib/categories";
import type { CategoryTotal } from "@/lib/finance";
import { formatCurrency } from "@/lib/formatters";

type CategoryBreakdownProps = {
  breakdown: CategoryTotal[];
  totalExpense: number;
};

export function CategoryBreakdown({ breakdown, totalExpense }: CategoryBreakdownProps) {
  const gradient = breakdown.length
    ? `conic-gradient(${breakdown.map((item, index) => {
      const from = breakdown.slice(0, index).reduce((sum, current) => sum + current.amount, 0) / totalExpense * 100;
      return `${categoryColors[item.category]} ${from}% ${from + item.amount / totalExpense * 100}%`;
    }).join(",")})`
    : "#edf0f5";

  return (
    <article className="panel" id="presupuestos">
      <div className="title"><div><h2>Gastos por categoría</h2><p>Distribución del mes actual</p></div></div>
      {breakdown.length ? (
        <div className="category">
          <div className="donut" style={{ background: gradient }}><div><span>Total gastos</span><b>{formatCurrency(totalExpense)}</b></div></div>
          <div className="legend">{breakdown.slice(0, 5).map((item) => <div key={item.category}><i style={{ background: categoryColors[item.category] }} /><span>{item.category}</span><b>{formatCurrency(item.amount)}</b></div>)}</div>
        </div>
      ) : <div className="empty compact"><b>Sin gastos este mes</b><span>Registra un gasto para ver su distribución.</span></div>}
    </article>
  );
}
