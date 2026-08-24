"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="error-page"><section className="panel"><small>ALGO SALIÓ MAL</small><h1>No pudimos cargar tus finanzas</h1><p>El error fue registrado de forma segura. Puedes intentar nuevamente.</p><button className="primary" onClick={retry}>Reintentar</button></section></main>;
}
