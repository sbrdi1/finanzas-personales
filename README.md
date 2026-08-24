# Finova

Panel responsive de finanzas personales para registrar ingresos y gastos, consultar el balance y visualizar la distribución por categorías. Los datos se conservan localmente en el navegador.

## Funcionalidades

- Registro, edición, eliminación y listado de ingresos y gastos.
- Búsqueda y filtros combinables por tipo, categoría y fecha.
- Balance, totales y porcentaje de ahorro calculados en tiempo real.
- Gráficos de flujo y distribución por categoría sin librerías externas.
- Persistencia en `localStorage`.
- Validación tipada con Zod y React Hook Form.
- Interfaz adaptable a escritorio, tablet y móvil.
- Formato de moneda CLP y fechas en español de Chile.

## Tecnologías

- Next.js 16.3 con App Router
- React 19
- TypeScript estricto
- Tailwind CSS 4 y CSS global
- ESLint 9
- GitHub Actions
- Zod y React Hook Form

## Requisitos

- Node.js 20.9 o superior; se recomienda Node.js 22 LTS.
- npm 10 o superior.

## Desarrollo local

```bash
git clone <URL_DEL_REPOSITORIO>
cd finanzas-personales
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run lint` | Ejecuta ESLint sin admitir advertencias. |
| `npm run typecheck` | Comprueba los tipos de TypeScript. |
| `npm run build` | Genera el build de producción. |
| `npm run start` | Sirve localmente el build de producción. |
| `npm run check` | Ejecuta lint, tipos y build. |

## Persistencia y privacidad

Esta versión no envía información a un servidor. Los movimientos se guardan bajo la clave `finova-movements` de `localStorage`, por lo que no se comparten entre navegadores o dispositivos y se pierden al borrar los datos del sitio.

El proyecto es una demostración educativa; no reemplaza software contable ni asesoría financiera.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Despliegue paso a paso en Vercel](docs/DEPLOYMENT.md)
- [Guía de contribución](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)

## Calidad y despliegue

Cada push y pull request hacia `main` ejecuta lint, comprobación de tipos y build mediante GitHub Actions. Para validar lo mismo localmente:

```bash
npm run check
```

Vercel ofrece integración directa con Next.js y despliegues automáticos desde GitHub. Consulta la [guía completa de despliegue](docs/DEPLOYMENT.md).

## Hoja de ruta

- Autenticación y cuentas individuales.
- Persistencia segura con PostgreSQL.
- Presupuestos y metas de ahorro.
- Exportación CSV.
- Pruebas unitarias y end-to-end.
