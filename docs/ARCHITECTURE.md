# Arquitectura

## Resumen

Finova es una aplicación de una sola página construida con Next.js App Router. La ruta `/` se prerenderiza durante el build y se hidrata en el navegador para habilitar la interacción.

## Componentes principales

- `src/app/layout.tsx`: layout raíz, tipografía y metadatos.
- `src/app/page.tsx`: orquestación del dashboard y estado de interfaz.
- `src/components/dashboard/`: componentes de presentación del dashboard, tabla y formulario.
- `src/hooks/use-transactions.ts`: CRUD y persistencia local de movimientos.
- `src/lib/`: categorías, validación, formato y cálculos financieros reutilizables.
- `src/types/`: contratos TypeScript del dominio.
- `src/app/globals.css`: estilos globales y adaptación responsive.
- `public/`: recursos estáticos.

## Modelo de datos

Cada movimiento tiene identificador, descripción, categoría, monto, tipo (`income` o `expense`) y fecha. El navegador guarda la colección bajo la clave `finova-movements` de `localStorage`.

No existe sincronización entre dispositivos, autenticación ni persistencia del lado del servidor. Borrar los datos del sitio en el navegador elimina los movimientos guardados.

## Decisiones técnicas

- Next.js 16 y React 19 con App Router.
- TypeScript en modo estricto.
- Componente cliente para estado e interacción local.
- Validación con Zod integrada a React Hook Form.
- Cálculos financieros puros y separados de la presentación.
- `Intl` para formato de moneda CLP y fechas en español de Chile.
- CSS responsive sin dependencias de componentes externas.

## Evolución sugerida

Para convertir la demostración en un producto multiusuario, la siguiente etapa debería separar presentación, dominio y acceso a datos; añadir autenticación; validar entradas en servidor; persistir en una base de datos; e incorporar pruebas unitarias y end-to-end.
