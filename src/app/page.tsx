"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Movement = { id: string; name: string; category: string; amount: number; kind: "income" | "expense"; date: string };

const seed: Movement[] = [
  { id: "1", name: "Sueldo mensual", category: "Ingresos", amount: 1450000, kind: "income", date: "2026-08-21" },
  { id: "2", name: "Supermercado", category: "Alimentación", amount: 84590, kind: "expense", date: "2026-08-20" },
  { id: "3", name: "Plan de internet", category: "Servicios", amount: 24990, kind: "expense", date: "2026-08-18" },
  { id: "4", name: "Trabajo freelance", category: "Ingresos", amount: 280000, kind: "income", date: "2026-08-16" },
  { id: "5", name: "Transporte", category: "Transporte", amount: 36500, kind: "expense", date: "2026-08-14" },
  { id: "6", name: "Cena con amigos", category: "Ocio", amount: 42900, kind: "expense", date: "2026-08-12" },
];

const categories = ["Alimentación", "Servicios", "Transporte", "Vivienda", "Salud", "Ocio", "Educación", "Otros"];
const colors: Record<string, string> = { Alimentación: "#6c5ce7", Servicios: "#20bf9f", Transporte: "#ffb84d", Vivienda: "#4386f5", Salud: "#ff6680", Ocio: "#a867dd", Educación: "#39afd0", Otros: "#8992a5" };
const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const dateFormat = new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short" });
const storageKey = "finova-movements";

function readMovements(): Movement[] | null {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as Movement[]) : null;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export default function Home() {
  const [items, setItems] = useState<Movement[]>(seed);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Movement["kind"]>("expense");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readMovements();
      if (saved) setItems(saved);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, loaded]);

  const totals = useMemo(() => {
    const income = items.filter(x => x.kind === "income").reduce((s, x) => s + x.amount, 0);
    const expense = items.filter(x => x.kind === "expense").reduce((s, x) => s + x.amount, 0);
    return { income, expense, balance: income - expense };
  }, [items]);

  const breakdown = useMemo(() => categories.map(category => ({ category, amount: items.filter(x => x.kind === "expense" && x.category === category).reduce((s, x) => s + x.amount, 0) })).filter(x => x.amount).sort((a, b) => b.amount - a.amount), [items]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setItems(current => [{
      id: crypto.randomUUID(), name: String(data.get("name")), amount: Number(data.get("amount")), kind,
      category: kind === "income" ? "Ingresos" : String(data.get("category")), date: String(data.get("date")),
    }, ...current]);
    setOpen(false);
  }

  const max = Math.max(totals.income, totals.expense, 1);
  const gradient = breakdown.length ? `conic-gradient(${breakdown.map((x, i) => {
    const from = breakdown.slice(0, i).reduce((s, y) => s + y.amount, 0) / totals.expense * 100;
    return `${colors[x.category]} ${from}% ${from + x.amount / totals.expense * 100}%`;
  }).join(",")})` : "#edf0f5";

  return <div className="shell">
    <aside>
      <div className="logo"><b>F</b><strong>Finova</strong></div>
      <nav>
        <a className="active" href="#resumen"><span>⌂</span>Resumen</a>
        <a href="#movimientos"><span>⇄</span>Movimientos</a>
        <a href="#presupuestos"><span>▣</span>Presupuestos</a>
        <a href="#analisis"><span>⌁</span>Análisis</a>
      </nav>
      <div className="account"><a href="#config"><span>⚙</span>Configuración</a><div><i>SB</i><p><b>Sebastián</b><small>Cuenta personal</small></p></div></div>
    </aside>

    <main id="resumen">
      <header><div><small>DOMINGO, 23 DE AGOSTO</small><h1>Hola, Sebastián <span>👋</span></h1><p>Este es el estado de tus finanzas este mes.</p></div><button className="primary" onClick={() => setOpen(true)}><b>＋</b> Nuevo movimiento</button></header>

      <section className="summary" aria-label="Resumen financiero">
        <article className="balance"><div><span>Balance disponible</span><i>▱</i></div><strong>{currency.format(totals.balance)}</strong><small>Actualizado ahora</small></article>
        <article><div><span>Ingresos</span><i className="green">↑</i></div><strong>{currency.format(totals.income)}</strong><small className="up">↑ 8,4% <em>vs. mes anterior</em></small></article>
        <article><div><span>Gastos</span><i className="red">↓</i></div><strong>{currency.format(totals.expense)}</strong><small className="down">↓ 3,1% <em>vs. mes anterior</em></small></article>
      </section>

      <section className="panels" id="analisis">
        <article className="panel flow"><div className="title"><div><h2>Flujo de dinero</h2><p>Ingresos y gastos del mes</p></div><button>Agosto 2026⌄</button></div>
          <div className="chart"><div className="axis"><span>{currency.format(max)}</span><span>{currency.format(max / 2)}</span><span>$0</span></div><div className="plot"><div className="barset"><i className="income" style={{ height: `${totals.income / max * 100}%` }}/><span>Ingresos</span></div><div className="barset"><i className="expense" style={{ height: `${Math.max(8, totals.expense / max * 100)}%` }}/><span>Gastos</span></div><div className="saving"><span>Balance del mes</span><b>{currency.format(totals.balance)}</b><small>Has ahorrado {totals.income ? Math.round(totals.balance / totals.income * 100) : 0}% de tus ingresos</small></div></div></div>
        </article>
        <article className="panel" id="presupuestos"><div className="title"><div><h2>Gastos por categoría</h2><p>Distribución durante agosto</p></div><button className="link">Ver detalle</button></div>
          <div className="category"><div className="donut" style={{ background: gradient }}><div><span>Total gastos</span><b>{currency.format(totals.expense)}</b></div></div><div className="legend">{breakdown.slice(0, 5).map(x => <div key={x.category}><i style={{ background: colors[x.category] }}/><span>{x.category}</span><b>{currency.format(x.amount)}</b></div>)}</div></div>
        </article>
      </section>

      <section className="panel movements" id="movimientos"><div className="title"><div><h2>Movimientos recientes</h2><p>Tus últimas transacciones</p></div><button className="link" onClick={() => setOpen(true)}>Agregar</button></div>
        <div className="table"><table><thead><tr><th>Descripción</th><th>Categoría</th><th>Fecha</th><th>Monto</th><th aria-label="Acciones"/></tr></thead><tbody>{items.slice(0, 7).map(x => <tr key={x.id}><td><i className={`movement-icon ${x.kind}`}>{x.kind === "income" ? "↑" : "↓"}</i><b>{x.name}</b></td><td><span className="tag"><i style={{ background: x.kind === "income" ? "#20bf9f" : colors[x.category] }}/>{x.category}</span></td><td>{dateFormat.format(new Date(`${x.date}T12:00:00`))}</td><td className={x.kind}>{x.kind === "income" ? "+" : "−"}{currency.format(x.amount)}</td><td><button className="trash" onClick={() => setItems(v => v.filter(y => y.id !== x.id))} aria-label={`Eliminar ${x.name}`}>×</button></td></tr>)}</tbody></table></div>
      </section>
      <footer>Finova · Tus finanzas, más claras.</footer>
    </main>

    {open && <div className="backdrop" onMouseDown={() => setOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onMouseDown={e => e.stopPropagation()}><div className="modal-title"><div><small>REGISTRAR</small><h2 id="modalTitle">Nuevo movimiento</h2></div><button onClick={() => setOpen(false)} aria-label="Cerrar">×</button></div><div className="switch"><button className={kind === "expense" ? "selected" : ""} onClick={() => setKind("expense")}>Gasto</button><button className={kind === "income" ? "selected" : ""} onClick={() => setKind("income")}>Ingreso</button></div><form onSubmit={submit}><label>Descripción<input name="name" required autoFocus placeholder="Ej. Compra supermercado"/></label><label>Monto (CLP)<input name="amount" type="number" min="1" required placeholder="0"/></label>{kind === "expense" && <label>Categoría<select name="category">{categories.map(x => <option key={x}>{x}</option>)}</select></label>}<label>Fecha<input name="date" type="date" defaultValue="2026-08-23" required/></label><button className="primary save">Guardar movimiento</button></form></div></div>}
  </div>;
}
