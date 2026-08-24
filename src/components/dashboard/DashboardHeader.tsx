import { formatLongDate } from "@/lib/formatters";

type DashboardHeaderProps = {
  date: Date;
  userName: string | null;
  onAdd: (trigger: HTMLButtonElement) => void;
};

export function DashboardHeader({ date, userName, onAdd }: DashboardHeaderProps) {
  const firstName = userName?.trim().split(/\s+/)[0];
  return (
    <header>
      <div>
        <small>{formatLongDate(date).toLocaleUpperCase("es-CL")}</small>
        <h1>{firstName ? `Hola, ${firstName}` : "Resumen financiero"}</h1>
        <p>Este es el estado real de tus finanzas del mes.</p>
      </div>
      <button className="primary" onClick={(event) => onAdd(event.currentTarget)}>
        <b aria-hidden="true">＋</b> Nuevo movimiento
      </button>
    </header>
  );
}
