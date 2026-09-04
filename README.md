# NoirLol

Plataforma completa de perfiles personalizables con autenticación, dashboard, layouts, medios, música, efectos, enlaces, widgets, SEO, aliases, hosting de archivos, analíticas y conexión OAuth con Discord.

## Desarrollo local

1. Instala Node.js 20+ y PostgreSQL.
2. Copia `.env.example` a `.env` y configura `DATABASE_URL`, `JWT_SECRET` e `IP_HASH_SECRET`.
3. Ejecuta:

```bash
npm install
npx prisma db push
npm run dev
```

## GitHub

El repositorio ya incluye `.gitignore`. No subas tu `.env` ni credenciales.

```bash
git init
git add .
git commit -m "Initial NoirLol release"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/noirlol.git
git push -u origin main
```

## Deploy en Render

El archivo `render.yaml` permite crear NoirLol y PostgreSQL como Blueprint desde el repositorio.

1. Sube este proyecto a GitHub.
2. En Render: **New > Blueprint** y selecciona el repositorio.
3. Render detectará `render.yaml`.
4. Configura `APP_URL` con la URL final, por ejemplo `https://noirlol.onrender.com`.
5. Para Discord OAuth, configura `DISCORD_CLIENT_ID` y `DISCORD_CLIENT_SECRET`; en Discord Developer Portal usa como redirect: `https://TU-DOMINIO/api/discord/callback`.
6. Para uploads permanentes en Render Free, configura las variables `S3_*` con Cloudflare R2 u otro almacenamiento S3 compatible.

El comando de arranque ejecuta `prisma db push` antes de levantar Next.js, así el primer deploy crea el esquema automáticamente sin depender de `preDeployCommand`.

### Importante sobre Render Free

El filesystem del Web Service es efímero. Si no configuras `S3_*`, los uploads locales pueden desaparecer con reinicios o deploys. Render Postgres Free también tiene las limitaciones que Render establezca para ese plan. Para producción usa almacenamiento persistente y una base de datos con retención adecuada.

## Variables principales

- `DATABASE_URL`: conexión PostgreSQL.
- `JWT_SECRET`: firma de sesiones.
- `IP_HASH_SECRET`: anonimización de IP para estadísticas.
- `APP_URL`: URL pública del sitio.
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET`: OAuth de Discord.
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_PUBLIC_URL`: almacenamiento permanente.

## Salud del servicio

`GET /api/health` responde con el estado de NoirLol y es usado por Render como health check.
