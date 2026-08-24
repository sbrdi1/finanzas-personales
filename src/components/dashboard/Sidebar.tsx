export function Sidebar() {
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
        <div><i aria-hidden="true">FL</i><p><b>Finanzas locales</b><small>Datos en este navegador</small></p></div>
      </div>
    </aside>
  );
}
