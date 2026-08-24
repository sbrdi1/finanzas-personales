import { logout } from "@/app/actions/auth";

export function Sidebar({ userName }: { userName: string | null }) {
  return (
    <aside>
      <div className="logo"><b>F</b><strong>Finova</strong></div>
      <nav aria-label="Navegación principal">
        <a className="active" href="#resumen"><span aria-hidden="true">⌂</span>Resumen</a>
        <a href="#movimientos"><span aria-hidden="true">⇄</span>Movimientos</a>
        <a href="#presupuestos"><span aria-hidden="true">▣</span>Presupuestos</a>
        <a href="#analisis"><span aria-hidden="true">⌁</span>Análisis</a>
      </nav>
      <div className="account">
        <div><i aria-hidden="true">{userName?.slice(0, 2).toLocaleUpperCase("es-CL") || "FN"}</i><p><b>{userName || "Cuenta personal"}</b><small>Sesión protegida</small></p></div>
        <form action={logout}><button type="submit" className="logout-button">Cerrar sesión</button></form>
      </div>
    </aside>
  );
}
