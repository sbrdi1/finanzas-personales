"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

export function Sidebar({ userName }: { userName: string | null }) {
  const pathname = usePathname();
  const links = [
    { href: "/", icon: "⌂", label: "Resumen" },
    { href: "/movimientos", icon: "⇄", label: "Movimientos" },
    { href: "/presupuestos", icon: "▣", label: "Presupuestos" },
    { href: "/analisis", icon: "⌁", label: "Análisis" },
  ];
  return (
    <aside>
      <div className="logo"><b>F</b><strong>Finova</strong></div>
      <nav aria-label="Navegación principal">
        {links.map((link) => <Link key={link.href} className={pathname === link.href ? "active" : undefined} href={link.href}><span aria-hidden="true">{link.icon}</span>{link.label}</Link>)}
      </nav>
      <div className="account">
        <div><i aria-hidden="true">{userName?.slice(0, 2).toLocaleUpperCase("es-CL") || "FN"}</i><p><b>{userName || "Cuenta personal"}</b><small>Sesión protegida</small></p></div>
        <form action={logout}><button type="submit" className="logout-button">Cerrar sesión</button></form>
      </div>
    </aside>
  );
}
