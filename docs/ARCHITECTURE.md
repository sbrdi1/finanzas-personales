# Arquitectura

## Resumen

Finova es una aplicación full stack construida con Next.js App Router. La ruta `/` se renderiza dinámicamente en servidor porque verifica la sesión y consulta PostgreSQL; los componentes interactivos se hidratan en el navegador.

## Componentes principales

- `src/app/layout.tsx`: layout raíz, tipografía y metadatos.
- `src/app/page.tsx`: límite de autenticación y composición del dashboard desde servidor.
- `src/app/actions/`: mutaciones del servidor y revalidación.
- `src/components/dashboard/`: componentes de presentación del dashboard, tabla y formulario.
- `src/data/`: capa de acceso a datos `server-only` con autorización por propietario.
- `src/lib/`: categorías, validación, formato y cálculos financieros reutilizables.
- `src/types/`: contratos TypeScript del dominio.
- `prisma/`: modelo relacional y migraciones SQL.
- `src/app/globals.css`: estilos globales y adaptación responsive.
- `public/`: recursos estáticos.

## Modelo de datos

Cada movimiento pertenece simultáneamente a un usuario, una cuenta financiera y una categoría. PostgreSQL asegura la integridad mediante claves foráneas, índices y restricciones únicas. Los montos usan un decimal exacto y las fechas financieras usan `DATE`.

Auth.js gestiona identidades OAuth y sesiones persistidas. La capa de datos obtiene el usuario desde la sesión y no acepta un `userId` suministrado por el navegador.

## Decisiones técnicas

- Next.js 16 y React 19 con App Router.
- Prisma 6.12 por compatibilidad declarada con el adaptador oficial de Auth.js; la actualización a Prisma 7 queda condicionada al soporte de ese adaptador.
- TypeScript en modo estricto.
- Server Components para autenticación y lectura de datos.
- Componentes cliente acotados para formularios, filtros y modales.
- Validación con Zod integrada a React Hook Form.
- Cálculos financieros puros y separados de la presentación.
- `Intl` para formato de moneda CLP y fechas en español de Chile.
- CSS responsive sin dependencias de componentes externas.

## Evolución sugerida

La siguiente etapa debería completar presupuestos y cuentas financieras en la interfaz, añadir pruebas unitarias y end-to-end, observabilidad y una estrategia de respaldo y recuperación.
