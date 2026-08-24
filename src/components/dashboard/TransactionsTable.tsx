import { categoryColors } from "@/lib/categories";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { Transaction } from "@/types/transaction";

type TransactionsTableProps = {
  transactions: Transaction[];
  isLoaded: boolean;
  onAdd: (trigger: HTMLButtonElement) => void;
  onEdit: (transaction: Transaction, trigger: HTMLButtonElement) => void;
  onDelete: (id: string) => void;
};

export function TransactionsTable({ transactions, isLoaded, onAdd, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <section className="panel movements" id="movimientos">
      <div className="title">
        <div><h2>Movimientos</h2><p>Todos tus ingresos y gastos</p></div>
        <button className="link" onClick={(event) => onAdd(event.currentTarget)}>Agregar</button>
      </div>
      {!isLoaded ? <div className="empty"><span>Cargando movimientos…</span></div> : transactions.length === 0 ? (
        <div className="empty"><b>Aún no tienes movimientos</b><span>Agrega tu primer ingreso o gasto para comenzar.</span><button className="primary" onClick={(event) => onAdd(event.currentTarget)}>Nuevo movimiento</button></div>
      ) : (
        <div className="table"><table><thead><tr><th>Descripción</th><th>Categoría</th><th>Fecha</th><th>Monto</th><th>Acciones</th></tr></thead><tbody>{transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td><i className={`movement-icon ${transaction.kind}`} aria-hidden="true">{transaction.kind === "income" ? "↑" : "↓"}</i><b>{transaction.name}</b></td>
            <td><span className="tag"><i style={{ background: transaction.kind === "income" ? "#20bf9f" : categoryColors[transaction.category] }} />{transaction.category}</span></td>
            <td>{formatShortDate(transaction.date)}</td>
            <td className={transaction.kind}>{transaction.kind === "income" ? "+" : "−"}{formatCurrency(transaction.amount)}</td>
            <td><div className="row-actions"><button onClick={(event) => onEdit(transaction, event.currentTarget)} aria-label={`Editar ${transaction.name}`}>Editar</button><button className="trash" onClick={() => onDelete(transaction.id)} aria-label={`Eliminar ${transaction.name}`}>×</button></div></td>
          </tr>
        ))}</tbody></table></div>
      )}
    </section>
  );
}
