# Despliegue en Vercel

Finova no necesita variables de entorno en su versión actual. Vercel detecta automáticamente Next.js y usa el lockfile de npm.

## Antes de desplegar

1. Instala Node.js 22 LTS.
2. Ejecuta `npm ci`.
3. Ejecuta `npm run check`.
4. Comprueba que el workflow **CI** de GitHub esté en verde.

## Primer despliegue desde el panel

1. Inicia sesión en [Vercel](https://vercel.com/) con tu cuenta de GitHub.
2. Selecciona **Add New > Project**.
3. Busca e importa el repositorio `finanzas-personales`.
4. Conserva los valores detectados:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Install Command: `npm install` (automático)
   - Build Command: `next build` (automático)
   - Output Directory: valor administrado por Next.js
5. No agregues variables de entorno: esta versión no las usa.
6. Selecciona **Deploy**.
7. Abre la URL generada y verifica crear, recargar y eliminar un movimiento.

## Despliegues posteriores

Cada push a `main` genera un despliegue de producción. Los pull requests generan previews aisladas para revisar los cambios antes de integrarlos.

## Dominio personalizado

En el proyecto de Vercel, abre **Settings > Domains**, agrega el dominio y configura los registros DNS que indique Vercel. Define una sola variante como principal para evitar URLs duplicadas.

## Variables de entorno futuras

Si se añade una base de datos o autenticación, configura cada variable en **Settings > Environment Variables** para Production, Preview y Development según corresponda. Nunca subas `.env` al repositorio y usa `NEXT_PUBLIC_` solamente para valores que puedan quedar expuestos en el navegador.

Después de cambiar variables, crea un nuevo despliegue. Los valores `NEXT_PUBLIC_` quedan incorporados durante el build.

## Reversión y diagnóstico

- Para volver a una versión anterior, abre **Deployments**, selecciona un despliegue válido y usa **Promote to Production**.
- Si falla el build, revisa sus logs y reproduce localmente con `npm ci && npm run check`.
- Si los movimientos no aparecen en otro dispositivo, es el comportamiento esperado: se guardan únicamente en el `localStorage` de cada navegador.
