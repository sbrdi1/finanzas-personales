import { expenseCategoryNames, incomeCategory } from "@/lib/categories";
import type { TransactionFilters as Filters } from "@/types/transaction";

type TransactionFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  const hasFilters = Boolean(filters.search || filters.kind !== "all" || filters.category || filters.date);
  function update<Key extends keyof Filters>(key: Key, value: Filters[Key]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="filters" aria-label="Filtros de movimientos">
      <label className="search-field"><span className="sr-only">Buscar por descripción</span><input type="search" value={filters.search} onChange={(event) => update("search", event.target.value)} placeholder="Buscar movimiento…" /></label>
      <label><span className="sr-only">Filtrar por tipo</span><select value={filters.kind} onChange={(event) => update("kind", event.target.value as Filters["kind"])}><option value="all">Todos los tipos</option><option value="income">Ingresos</option><option value="expense">Gastos</option></select></label>
      <label><span className="sr-only">Filtrar por categoría</span><select value={filters.category} onChange={(event) => update("category", event.target.value)}><option value="">Todas las categorías</option><option value={incomeCategory}>{incomeCategory}</option>{expenseCategoryNames.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label><span className="sr-only">Filtrar por fecha</span><input type="date" value={filters.date} onChange={(event) => update("date", event.target.value)} /></label>
      {hasFilters && <button type="button" onClick={() => onChange({ search: "", kind: "all", category: "", date: "" })}>Limpiar</button>}
    </div>
  );
}
