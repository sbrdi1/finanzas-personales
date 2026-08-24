"use client";

import { useRouter } from "next/navigation";

export function MonthSelector({ month, path = "/" }: { month: string; path?: string }) {
  const router = useRouter();
  return <label className="month-selector"><span className="sr-only">Seleccionar mes</span><input type="month" value={month} onChange={(event) => router.push(`${path}?mes=${event.target.value}`)} /></label>;
}
