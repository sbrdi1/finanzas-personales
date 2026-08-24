import { formatLongDate } from "@/lib/formatters";

type DashboardHeaderProps = {
  date: Date;
  onAdd: (trigger: HTMLButtonElement) => void;
};

export function DashboardHeader({ date, onAdd }: DashboardHeaderProps) {
  return (
    <header>
      <div>
        <small>{formatLongDate(date).toLocaleUpperCase("es-CL")}</small>
        <h1>Resumen financiero</h1>
        <p>Este es el estado real de tus finanzas del mes.</p>
      </div>
      <button className="primary" onClick={(event) => onAdd(event.currentTarget)}>
        <b aria-hidden="true">＋</b> Nuevo movimiento
      </button>
    </header>
  );
}
