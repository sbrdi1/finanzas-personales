# Base de datos y autenticación

Finova usa PostgreSQL en Neon, Prisma ORM y Auth.js con GitHub OAuth. Los secretos se configuran localmente y en Vercel; nunca se versionan.

## 1. Crear la base de datos en Neon

1. Crea un proyecto en [Neon](https://console.neon.tech/).
2. Copia la conexión **pooled** en `DATABASE_URL`.
3. Copia la conexión **direct** en `DIRECT_URL`.
4. Ambas conexiones deben incluir `sslmode=require`.

Copia el archivo de ejemplo y reemplaza sus valores:

```bash
cp .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## 2. Aplicar la migración

En desarrollo:

```bash
npm run db:migrate
```

En CI o producción:

```bash
npm run db:deploy
```

La migración crea tablas de usuarios, sesiones, proveedores OAuth, cuentas financieras, categorías, transacciones y presupuestos. Puedes inspeccionarlas con:

```bash
npm run db:studio
```

## 3. Configurar GitHub OAuth

1. Abre **GitHub > Settings > Developer settings > OAuth Apps**.
2. Crea una OAuth App.
3. Para desarrollo usa:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copia el Client ID en `AUTH_GITHUB_ID`.
5. Genera un Client Secret y guárdalo en `AUTH_GITHUB_SECRET`.
6. Genera `AUTH_SECRET` con `npx auth secret`.

Para producción crea otra OAuth App con el dominio final de Vercel. No reutilices callbacks locales en producción.

## 4. Variables de Vercel

Configura en **Settings > Environment Variables**:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`

Marca los secretos para Production y Preview según la estrategia de ramas de Neon. Ejecuta `npm run db:deploy` con la conexión de producción antes del primer despliegue.

## Modelo y seguridad

- Auth.js conserva cuentas OAuth y sesiones en PostgreSQL.
- Cada entidad financiera contiene `userId` y relaciones con claves foráneas.
- Todas las Server Actions vuelven a verificar la sesión.
- `UPDATE` y `DELETE` incluyen `userId` en la condición para prevenir acceso horizontal (IDOR).
- Zod valida nuevamente cada dato recibido en servidor.
- Prisma usa `Decimal(14,2)` para montos y PostgreSQL `DATE` para fechas financieras.
- Los errores internos se registran en servidor; el cliente recibe mensajes genéricos.
