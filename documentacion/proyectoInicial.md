# RedBullJab — Documentación inicial

Este documento resume la estructura creada, cómo instalar dependencias y ejecutar el frontend (Vite + React + Tailwind) y el backend (Express). Sirve como punto de partida para el proyecto.

## Contenido
- Panorama del proyecto
- Estructura de carpetas
- Requisitos
- Instalación y ejecución
- Variables de entorno
- API inicial (healthcheck)
- Notas sobre base de datos y repositorios
- Próximos pasos

## Panorama del proyecto
- Frontend (Vite + React + React Router + Zustand + Tailwind)
- Backend (Express + CORS + Morgan + dotenv)
- Estructura modular para dominio/infra/repositorios y scripts de migraciones/seed (placeholders)

## Estructura de carpetas
```
redbulljab/
│  package.json             # Frontend (Vite)
│  index.html               # Entrada Vite
│  vite.config.js           # Config Vite
│  tailwind.config.js       # Config Tailwind
│  postcss.config.js
│  App.jsx                  # Root App
│  main.jsx                 # Entrypoint React
│
│  app/
│  │  routes.jsx            # React Router
│  │  store/                # Zustand (auth/UI)
│  │  styles/
│  │    index.css           # Tailwind base
│  │
│  pages/
│  │  Home.jsx
│  │  Courts/
│  │    CourtsList.jsx
│  │    CourtDetail.jsx
│  │  Bookings/
│  │    BookingNew.jsx
│  │    BookingsList.jsx
│  │  Teams/ Matches/ Bets/
│  │
│  components/
│  │  Layout.jsx  NavBar.jsx
│  │  UI/ (Button, Card, Input, Table, Dialog)
│  │
│  services/
│  │  api.js                # Helper fetch
│
│  documetnacion/
│  │  README.md             # Este archivo
│
└─ backend/
   ├─ package.json
   ├─ .env.example
   └─ src/
      ├─ server.js          # arranque HTTP
      ├─ app.js             # instancia express
      ├─ config/
      │  ├─ env.js          # lectura/env safe
      │  └─ logger.js       # logger simple (swappable)
      ├─ http/
      │  ├─ routes/         # index + módulos
      │  ├─ controllers/
      │  ├─ middlewares/    # auth, error, validate
      │  └─ validators/     # zod schemas por recurso
      ├─ domain/
      │  ├─ entities/
      │  ├─ services/       # core negocio
      │  └─ repositories/   # interfaces (puertos)
      └─ infra/
         ├─ db/
         │  ├─ index.js     # factory proveedor
         │  ├─ knex/
         │  │  ├─ knexfile.cjs
         │  │  ├─ migrations/
         │  │  └─ seeds/
         │  └─ mongo/
         │     ├─ client.js
         │     └─ migrations/
         ├─ repo-sql/       # impl repos con Knex
         │  ├─ users.repo.js  courts.repo.js
         └─ repo-mongo/     # impl repos con Mongo Driver
            ├─ users.repo.js  courts.repo.js

scripts/
├─ migrate.js               # runner (placeholder)
└─ seed.js                  # datos demo (placeholder)

docs/
└─ openapi.yml
```

## Requisitos
- Node.js 18+ recomendado
- Yarn 1.x o Yarn Berry

## Instalación y ejecución
- Frontend
  1. `cd redbulljab`
  2. `yarn install`
  3. `yarn dev` → http://localhost:5173

- Backend
  1. `cd redbulljab/backend`
  2. Copia variables: `copy .env.example .env` (Windows) / `cp .env.example .env` (Unix)
  3. `yarn install`
  4. `yarn dev` → API en http://localhost:3001 (por defecto)

- Configurar URL de API para el frontend (opcional):
  - Crear `redbulljab/.env` y definir `VITE_API_URL="http://localhost:3001/api"` (Vite expone `import.meta.env.VITE_API_URL`).

## Variables de entorno
- Backend (`redbulljab/backend/.env`):
  - `NODE_ENV` (default: development)
  - `PORT` (default: 3001)
  - `LOG_LEVEL` (default: info)
  - `DB_URL` (e.g., Postgres o Mongo)
- Frontend (`redbulljab/.env`):
  - `VITE_API_URL` (e.g., `http://localhost:3001/api`)

## API inicial
- Healthcheck: `GET /health` → `{ "status": "ok" }`
- Prefijo API: `"/api"` (ruta base en `backend/src/app.js`)

## Base de datos y repositorios
- SQL (Knex):
  - Config en `backend/src/infra/db/knex/knexfile.cjs`
  - Directorios `migrations/` y `seeds/` listos (vacíos)
- Mongo:
  - Cliente en `backend/src/infra/db/mongo/client.js` (import dinámico `mongodb`)
- Repos de ejemplo:
  - SQL: `backend/src/infra/repo-sql/*.repo.js`
  - Mongo: `backend/src/infra/repo-mongo/*.repo.js`
- Scripts de migración/seed (`backend/scripts/*.js`) son placeholders; integra tu herramienta (Knex/Umzug/Mongo) según preferencia.

## Frontend
- Rutas: `app/routes.jsx`
- Estado global: `app/store/auth.js`, `app/store/ui.js` (Zustand)
- Estilos: `app/styles/index.css` con Tailwind
- Helper API: `services/api.js` (usa `VITE_API_URL` si está definido)

## Scripts útiles
- Frontend (`redbulljab`):
  - `yarn dev` | `yarn build` | `yarn preview`
- Backend (`redbulljab/backend`):
  - `yarn dev` (nodemon) | `yarn start`

## Próximos pasos sugeridos
- Añadir controladores, middlewares y validadores por recurso en `backend/src/http/*`.
- Definir esquemas (Zod) y repositorios concretos según proveedor (SQL/Mongo).
- Implementar migraciones y semillas con Knex o Mongo runner (Umzug u otro).
- Integrar logger tipo pino y correlación de peticiones.
- Configurar CORS según dominios reales.
- Ampliar `docs/openapi.yml` con los endpoints del dominio.
- Añadir tests (unitarios e integración).

---
Cualquier duda o ajuste de estructura, coméntalo y lo adaptamos.
