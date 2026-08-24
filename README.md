# Finova

Aplicación full stack de finanzas personales para registrar ingresos y gastos, consultar el balance y visualizar la distribución por categorías. Cada usuario accede únicamente a sus datos mediante una sesión protegida.

## Estado del proyecto

La Fase 2 está implementada y validada localmente:

- Login y cierre de sesión con GitHub OAuth.
- Sesiones protegidas y persistidas en PostgreSQL.
- Creación, edición y eliminación de movimientos.
- Persistencia de datos después de cerrar sesión y volver a entrar.
- Autorización por propietario para lecturas y mutaciones.
- Base PostgreSQL alojada en Neon y gestionada con Prisma.

## Funcionalidades

- Registro, edición, eliminación y listado de ingresos y gastos.
- Búsqueda y filtros combinables por tipo, categoría y fecha.
- Balance, totales y porcentaje de ahorro calculados en tiempo real.
- Gráficos de flujo y distribución por categoría sin librerías externas.
- Persistencia multiusuario en PostgreSQL sobre Neon.
- Inicio de sesión OAuth con GitHub mediante Auth.js.
- Server Actions con validación y autorización por propietario.
- Validación tipada con Zod y React Hook Form.
- Interfaz adaptable a escritorio, tablet y móvil.
- Formato de moneda CLP y fechas en español de Chile.

## Tecnologías

- Next.js 16.3 con App Router
- React 19
- TypeScript estricto
- Tailwind CSS 4 y CSS global
- ESLint 9 y GitHub Actions
- Zod y React Hook Form
- PostgreSQL, Neon y Prisma ORM
- Auth.js con GitHub OAuth y PrismaAdapter

## Requisitos

- Node.js 20.9 o superior; se recomienda Node.js 22 LTS.
- npm 10 o superior.
- Un proyecto PostgreSQL en Neon.
- Una GitHub OAuth App para desarrollo y otra para producción.

## Instalación local

```bash
git clone <URL_DEL_REPOSITORIO>
cd finanzas-personales
npm ci
```

Crea el archivo local de variables de entorno:

```bash
cp .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## Variables de entorno

Configura estas variables en `.env.local`:

```env
DATABASE_URL="<CONEXION_POOLED_DE_NEON>"
DIRECT_URL="<CONEXION_DIRECTA_DE_NEON>"
AUTH_SECRET="<SECRETO_ALEATORIO_SEGURO>"
AUTH_GITHUB_ID="<GITHUB_CLIENT_ID>"
AUTH_GITHUB_SECRET="<GITHUB_CLIENT_SECRET>"
```

### Conexiones de Neon

- `DATABASE_URL` usa la conexión **pooled**. El hostname normalmente contiene `-pooler` y se utiliza en ejecución por Prisma Client.
- `DIRECT_URL` usa la conexión **directa**, sin `-pooler`, y se utiliza para migraciones.
- Ambas conexiones deben incluir `sslmode=require`.
- Las dos deben apuntar al mismo proyecto, rama, base de datos y rol de Neon.

### Secreto de Auth.js

Genera `AUTH_SECRET` con:

```bash
npx auth secret
```

Debe ser aleatorio, estable y tener al menos 32 bytes de entropía. Nunca lo publiques ni lo reutilices después de una exposición.

## Configuración de GitHub OAuth

Abre **GitHub → Settings → Developer settings → OAuth Apps** y crea una OAuth App.

Para desarrollo local:

```text
Homepage URL:
http://localhost:3000

Authorization callback URL:
http://localhost:3000/api/auth/callback/github
```

Guarda el Client ID en `AUTH_GITHUB_ID` y el Client Secret en `AUTH_GITHUB_SECRET`.

Para producción se recomienda crear otra OAuth App con el dominio público definitivo:

```text
Homepage URL:
https://TU-DOMINIO

Authorization callback URL:
https://TU-DOMINIO/api/auth/callback/github
```

El protocolo, dominio y ruta deben coincidir exactamente. No uses el callback de `localhost` en producción.

## Base de datos y migraciones

En desarrollo:

```bash
npm run db:migrate
```

En CI o producción:

```bash
npm run db:deploy
```

La migración crea los modelos requeridos por Auth.js (`User`, `Account`, `Session` y `VerificationToken`) y las entidades financieras de Finova.

Para inspeccionar la base:

```bash
npm run db:studio
```

## Ejecutar y validar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y prueba:

1. Iniciar sesión con GitHub.
2. Crear un ingreso y un gasto.
3. Editar un movimiento.
4. Eliminar un movimiento.
5. Cerrar sesión y volver a entrar.
6. Confirmar que los datos permanecen disponibles.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run lint` | Ejecuta ESLint sin admitir advertencias. |
| `npm run typecheck` | Comprueba los tipos de TypeScript. |
| `npm run build` | Genera el build de producción. |
| `npm run start` | Sirve localmente el build de producción. |
| `npm run check` | Ejecuta lint, tipos y build. |
| `npm run db:generate` | Regenera Prisma Client. |
| `npm run db:migrate` | Crea o aplica migraciones de desarrollo. |
| `npm run db:deploy` | Aplica migraciones existentes en producción. |
| `npm run db:studio` | Abre Prisma Studio. |

## Despliegue en Vercel

1. Ejecuta `npm ci` y `npm run check` localmente.
2. Importa el repositorio desde **Vercel → Add New → Project**.
3. Conserva el preset de Next.js y el directorio raíz `./`.
4. En **Settings → Environment Variables**, configura para **Production**:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
5. Aplica las migraciones con `npm run db:deploy` usando las conexiones de producción.
6. Configura en GitHub OAuth el callback exacto del dominio de producción.
7. Despliega y valida autenticación, CRUD y persistencia.

Los cambios de variables solo se aplican a despliegues nuevos. Después de agregar, modificar o rotar una variable, crea un **Redeploy** en Vercel.

Si usas un dominio personalizado, la OAuth App debe emplear ese dominio. Evita iniciar el flujo en un dominio y recibir el callback en otro.

## Arquitectura de autenticación y seguridad

- Auth.js usa el provider oficial de GitHub.
- PrismaAdapter persiste usuarios, cuentas OAuth y sesiones en PostgreSQL.
- La estrategia de sesión es `database`.
- La ruta de Auth.js es `/api/auth/[...nextauth]`.
- El callback de GitHub es `/api/auth/callback/github`.
- La capa de datos obtiene el usuario desde la sesión y no acepta un `userId` enviado por el navegador.
- Todas las Server Actions verifican nuevamente la sesión.
- Actualizaciones y eliminaciones incluyen `userId` para prevenir acceso horizontal (IDOR).
- Zod valida los datos en el servidor.
- Prisma usa `Decimal(14,2)` para montos y PostgreSQL `DATE` para fechas financieras.

## Secretos y control de versiones

- `.env.local` está ignorado por Git y nunca debe versionarse.
- `.env.example` solo contiene nombres y valores ficticios.
- No pegues conexiones, tokens ni secretos en commits, issues, capturas o chats.
- Si una credencial queda expuesta, rótala en Neon o GitHub y actualiza Vercel antes de desplegar nuevamente.
- No uses `NEXT_PUBLIC_` para secretos: esos valores pueden quedar expuestos al navegador.

## Diagnóstico

### Auth.js muestra `Server error` o `Configuration`

Revisa los logs inmediatamente después de `/api/auth/callback/github`:

- `MissingSecret`: falta `AUTH_SECRET` en el entorno actual.
- `invalid_client` o `incorrect_client_credentials`: el ID y el Secret no corresponden a la misma OAuth App.
- Error de `redirect_uri`: el callback de GitHub no coincide con el dominio utilizado.
- `AdapterError`, errores de Prisma o `P1001`: revisa Neon, `DATABASE_URL` y las migraciones.
- `relation ... does not exist`: ejecuta `npm run db:deploy` contra la base correcta.
- `fetch failed` con `EACCES`: el proceso no tiene acceso HTTPS saliente a GitHub; no implica necesariamente credenciales incorrectas.

Si configuraste manualmente `AUTH_URL` o `NEXTAUTH_URL`, comprueba que no apunten a `localhost` ni a un dominio antiguo. En Vercel con Auth.js v5 normalmente pueden omitirse para usar la detección automática del host.

### Mensaje `Failed to connect to MetaMask`

Finova no usa MetaMask, Ethereum, `window.ethereum` ni librerías Web3. Ese mensaje proviene de una extensión del navegador y no afecta Finova ni GitHub OAuth.

### El build falla

Reproduce localmente las comprobaciones de CI:

```bash
npm ci
npm run check
```

## Persistencia y privacidad

Los movimientos se almacenan en PostgreSQL y quedan asociados al usuario autenticado. Las lecturas y mutaciones verifican la sesión en el servidor y limitan el acceso por propietario.

Finova es una demostración educativa; no reemplaza software contable ni asesoría financiera.

## Documentación adicional

- [Arquitectura](docs/ARCHITECTURE.md)
- [Configuración de Neon y Auth.js](docs/DATABASE_AND_AUTH.md)
- [Despliegue paso a paso en Vercel](docs/DEPLOYMENT.md)
- [Guía de contribución](CONTRIBUTING.md)
- [Política de seguridad](SECURITY.md)

## Calidad y despliegues posteriores

Cada push y pull request hacia `main` ejecuta lint, comprobación de tipos y build mediante GitHub Actions. Cada push a `main` genera un despliegue de producción en Vercel; los pull requests generan previews.

## Hoja de ruta

- Presupuestos y metas de ahorro.
- Interfaz de cuentas financieras.
- Exportación CSV.
- Pruebas unitarias y end-to-end.
- Observabilidad, respaldos y recuperación.
