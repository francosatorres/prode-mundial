# ⚽ Prode Mundial 2026

Aplicación de pronósticos del Mundial 2026, gratis y lista para producción.

**Stack:** Next.js 14 · Supabase · Tailwind CSS · Vercel

---

## 🚀 Setup en 15 minutos

### PASO 1 — Crear proyecto en Supabase (gratis)

1. Ir a [supabase.com](https://supabase.com) → Create new project
2. Nombre: `prode-mundial` · Elegí región (South America si está disponible)
3. Guardá la contraseña de la DB

### PASO 2 — Ejecutar SQL

En el dashboard de Supabase → **SQL Editor**:

1. Pegá y ejecutá el contenido de `sql/01_schema.sql` (tablas, RLS, funciones)
2. Pegá y ejecutá el contenido de `sql/02_seed_fixture.sql` (fixture inicial)

### PASO 3 — Configurar Auth en Supabase

1. Authentication → Settings
2. Desactivar "Enable email confirmations" (para desarrollo)
3. Site URL: `https://tu-app.vercel.app`
4. Redirect URLs: `https://tu-app.vercel.app/**`

### PASO 4 — Obtener variables de entorno

En Supabase → Settings → API:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ nunca expongas esto al cliente)

### PASO 5 — API de resultados automáticos (opcional pero recomendado)

Registrarse GRATIS en [football-data.org](https://www.football-data.org/):
- Plan gratuito: 10 req/min, acceso a Mundiales
- Copiar el API key → `FOOTBALL_API_KEY`

### PASO 6 — Deploy en Vercel (gratis)

```bash
# 1. Subir código a GitHub
git init
git add .
git commit -m "init"
gh repo create prode-mundial --public --push

# 2. Ir a vercel.com → New Project → Import from GitHub
# 3. Configurar variables de entorno en Vercel:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    FOOTBALL_API_KEY (opcional)
# 4. Deploy!
```

### PASO 7 — Crear primer admin

1. Registrarse en la app con tu email
2. En Supabase → Table Editor → profiles
3. Cambiar `role` a `admin` y `approved` a `true` para tu usuario

---

## 📁 Estructura del proyecto

```
prode-mundial/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── login/                # Login
│   │   ├── register/             # Registro
│   │   ├── fixture/              # Fixture completo
│   │   ├── mis-pronosticos/      # Pronósticos del usuario
│   │   ├── ranking/              # Ranking general y filtrado
│   │   ├── admin/                # Panel admin (protegido)
│   │   ├── perfil/               # Perfil del usuario
│   │   └── api/
│   │       └── sync-results/     # Sync automático de resultados
│   ├── components/
│   │   ├── layout/               # Navbar, Footer
│   │   └── ui/                   # MatchCard
│   ├── lib/
│   │   └── supabase/             # Clientes browser/server/middleware
│   └── types/                    # TypeScript types
├── sql/
│   ├── 01_schema.sql             # Tablas + RLS + funciones SQL
│   └── 02_seed_fixture.sql       # Fixture Mundial 2026
└── README.md
```

---

## 🎯 Sistema de puntos

| Resultado | Puntos |
|-----------|--------|
| Exacto (ej: 2-1 vs 2-1) | **3 pts** |
| Ganador o empate correcto | **1 pt** |
| Fallo | **0 pts** |

---

## 🔒 Seguridad

- **RLS activo** en todas las tablas
- Usuarios solo pueden ver/editar sus propios pronósticos
- Bloqueo automático cuando `NOW() >= fecha_hora` del partido
- Bloqueo global configurable desde el panel admin
- Solo admins pueden cargar resultados y aprobar usuarios
- Service role key usada únicamente en API routes (server-side)

---

## 💳 Pagos (opcional)

Para cobrar inscripción podés integrar **MercadoPago** (gratis para Argentina):

1. Crear cuenta en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Instalar SDK: `npm install mercadopago`
3. Crear API route `/api/crear-pago`
4. Agregar campo `paid: boolean` en tabla `profiles`
5. El admin puede marcar usuarios como pagados o hacerlo automático vía webhook

MercadoPago cobra **comisión por transacción** (~5.99% para tarjeta de crédito), no tiene costo fijo.

---

## 🔄 Actualización automática de resultados

El endpoint `POST /api/sync-results` usa [football-data.org](https://football-data.org) (gratuito).

Para automatizar, podés usar:
- **Vercel Cron Jobs** (gratuito): agregar `vercel.json` con schedule
- O desde el panel admin → botón "Sync automático"

```json
// vercel.json
{
  "crons": [{
    "path": "/api/sync-results",
    "schedule": "*/15 * * * *"
  }]
}
```

---

## 💰 Costos totales: $0

| Servicio | Plan | Costo |
|----------|------|-------|
| Supabase | Free (500MB DB, 50K usuarios) | $0 |
| Vercel | Hobby (100GB bandwidth) | $0 |
| football-data.org | Free (10 req/min) | $0 |
| Dominio | Vercel subdomain gratuito | $0 |

---

## 📱 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Home con stats y ranking top 3 |
| `/login` | Iniciar sesión |
| `/register` | Crear cuenta |
| `/fixture` | Todos los partidos ordenados por fase |
| `/mis-pronosticos` | Cargar y editar pronósticos |
| `/ranking` | Clasificación con filtros por fase/jornada |
| `/admin` | Panel admin (solo admins) |
| `/perfil` | Datos personales y estadísticas |

---

## ✏️ Actualizar equipos del fixture

Una vez que la FIFA confirme los grupos (diciembre 2025), actualizá los partidos directamente desde Supabase → Table Editor → matches, reemplazando "Por definir" con los nombres reales de los equipos.

También podés hacer un UPDATE en SQL:
```sql
UPDATE public.matches SET equipo_local = 'Colombia' WHERE equipo_local = 'Por definir' AND fase = 'Grupo A' AND jornada = 'Fecha 1';
```
