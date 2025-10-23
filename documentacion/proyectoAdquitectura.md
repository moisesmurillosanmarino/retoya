RedBullJab App — Documento Inicial de Arquitectura (Monorepo JS + Postgres + Migraciones Multibase)

Objetivo: Definir el lineamiento completo del proyecto (MVP web) en un monorepo JavaScript con frontend y backend separados, base principal en PostgreSQL, y un esquema de migraciones híbrido que permita operar también con MySQL y MongoDB sin reescribir la lógica de negocio. Todo con Yarn (no npm) y una arquitectura limpia y escalable.

1) Visión del MVP

RedBullJab es una plataforma de reservas de canchas, armado de partidos, equipos, solicitudes y apuestas alrededor de los partidos.

Funcionalidades base:

Catálogo de canchas (listado y detalle) con ubicación, horarios y precio.

Reservas de canchas.

Usuarios / Equipos (creación y asociación de jugadores).

Partidos ligados a reservas.

Apuestas (registro inicial; liquidación en fases futuras).

Web (desktop + mobile web). Monorepo para iterar rápido y separar front en el futuro sin fricción.

2) Stack tecnológico

Node.js: v20 LTS o v22 LTS (recomendado v22.x).
"engines": { "node": ">=22.0.0" }

Gestor de paquetes: Yarn (Berry) con Corepack.

corepack enable
corepack prepare yarn@stable --activate

Lenguaje: JavaScript ESM (sin TypeScript en el MVP; listo para TS más adelante).

Frontend: React + Vite, PrimeReact para componentes (datatable, form, calendar) y TailwindCSS para utilidades de estilo.

Backend: Express + middlewares (helmet, cors, compression), validación con Zod.

ORM/Query Builders:

SQL (Postgres/MySQL): Knex.js (query builder) + Umzug (orquestador de migraciones) → portátil entre Postgres/MySQL/SQLite.

MongoDB: MongoDB Node Driver + Umzug para migraciones de documentos/índices.

Auth: JWT (bcryptjs para hash).

Docs: Swagger/OpenAPI (swagger-ui-express + YAML).

Logs: pino (opcional en MVP) o morgan simple.

Por qué Knex + Umzug: Knex da portabilidad SQL (Postgres/MySQL). Umzug permite un runner único de migraciones que usa un store en la misma BD (tabla/colección) y ejecuta archivos up/down tanto para SQL como para Mongo.

3) Estructura del monorepo
redbulljab/
│     │  └─ styles/
│     │     └─ index.css        # Tailwind base
│     ├─ pages/
│     │  ├─ Home.jsx
│     │  ├─ Courts/
│     │  │  ├─ CourtsList.jsx
│     │  │  └─ CourtDetail.jsx
│     │  ├─ Bookings/
│     │  │  ├─ BookingNew.jsx
│     │  │  └─ BookingsList.jsx
│     │  ├─ Teams/ Matches/ Bets/
│     ├─ components/
│     │  ├─ Layout.jsx NavBar.jsx
│     │  └─ UI/ (Button, Card, Input, Table, Dialog)
│     ├─ services/api.js
│     ├─ App.jsx
│     └─ main.jsx
│
└─ backend/                      # API (Express)
   ├─ package.json
   ├─ .env.example
   └─ src/
      ├─ server.js               # arranque HTTP
      ├─ app.js                  # instancia express
      ├─ config/
      │  ├─ env.js               # lectura/env safe
      │  └─ logger.js            # pino/morgan
      ├─ http/
      │  ├─ routes/              # index + módulos
      │  ├─ controllers/
      │  ├─ middlewares/         # auth, error, validate
      │  └─ validators/          # zod schemas por recurso
      ├─ domain/
      │  ├─ entities/
      │  ├─ services/            # core negocio
      │  └─ repositories/        # interfaces (puertos)
      ├─ infra/
      │  ├─ db/
      │  │  ├─ index.js          # factory de conexión por proveedor
      │  │  ├─ knex/             # SQL: knex instance + config
      │  │  │  ├─ knexfile.cjs
      │  │  │  ├─ migrations/    # *.cjs up/down
      │  │  │  └─ seeds/
      │  │  └─ mongo/
      │  │     ├─ client.js      # Mongo client
      │  │     └─ migrations/    # *.js up/down
      │  ├─ repo-sql/            # impl repos con Knex
      │  │  ├─ users.repo.js courts.repo.js ...
      │  └─ repo-mongo/          # impl repos con Mongo Driver
      │     ├─ users.repo.js courts.repo.js ...
      ├─ scripts/
      │  ├─ migrate.js           # runner Umzug (SQL/Mongo)
      │  └─ seed.js              # datos demo
      └─ docs/openapi.yml
4) Modelado de dominio (MVP)

Entidades

User: { id, name, email, passwordHash, createdAt }

Court: { id, name, location, pricePerHour, amenities[], rules[], createdAt }

Booking: { id, courtId, userId, startTime, endTime, status }

Team: { id, name, captainUserId, members[] }

Match: { id, bookingId, teamAId, teamBId, status, score }

Bet: { id, matchId, createdByUserId, amount, odds, status }

Nota: El dominio es agnóstico a la base de datos. La capa repositories/ define contratos; infra/repo-* provee las implementaciones específicas.

5) Base de datos y migraciones (híbrido SQL/Mongo)
5.1 Proveedor principal

PostgreSQL (desarrollo y producción inicial). Variables de conexión en backend/.env.

5.2 Portabilidad a MySQL

Mismas migraciones SQL via Knex (dialect cambia por DB_PROVIDER=mysql).

5.3 Soporte MongoDB

Migraciones documentales separadas (índices, colecciones, proyecciones) usando Umzug con el MongoDB Driver. Los nombres de colecciones seguirán el mismo dominio.

5.4 Estrategia

Umzug como único orquestador (scripts/migrate.js) con dos pipelines:

SQL pipeline: busca migraciones en infra/db/knex/migrations y las ejecuta usando Knex. Umzug guarda estado en una tabla umzug_meta (o por defecto en knex_migrations).

Mongo pipeline: busca infra/db/mongo/migrations y ejecuta up/down con el db del driver. Umzug guarda estado en colección umzug_migrations.

Seeds análogos por proveedor.

5.5 Variables de entorno (backend/.env.example)
# Proveedor: postgres | mysql | mongo
DB_PROVIDER=postgres


# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=rbjab
PG_USER=rbjab
PG_PASSWORD=rbjab


# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=rbjab
MYSQL_USER=rbjab
MYSQL_PASSWORD=rbjab


# MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB=rbjab
5.6 Config Knex (backend/src/infra/db/knex/knexfile.cjs)
import 'dotenv/config'
const common = {
  migrations: { tableName: 'knex_migrations', extension: 'cjs', directory: './src/infra/db/knex/migrations' },
  seeds: { directory: './src/infra/db/knex/seeds' }
}


const pg = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
  },
  ...common
}


const mysql = {
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  },
  ...common
}


export default (process.env.DB_PROVIDER === 'mysql' ? mysql : pg)
5.7 Ejemplo de migración SQL (backend/src/infra/db/knex/migrations/202410161200_init.cjs)
/** @param {import('knex').Knex} knex */
export async function up(knex) {
  await knex.schema
    .createTable('users', (t) => {
      t.increments('id').primary()
      t.string('name').notNullable()
      t.string('email').notNullable().unique()
      t.string('password_hash').notNullable()
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('courts', (t) => {
      t.increments('id').primary()
      t.string('name').notNullable()
      t.string('location')
      t.decimal('price_per_hour', 10, 2)
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('bookings', (t) => {
      t.increments('id').primary()
      t.integer('court_id').notNullable().references('id').inTable('courts')
      t.integer('user_id').notNullable().references('id').inTable('users')
      t.timestamp('start_time').notNullable()
      t.timestamp('end_time').notNullable()
      t.string('status').notNullable()
      t.timestamp('created_at').defaultTo(knex.fn.now())
    })
}


/** @param {import('knex').Knex} knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists('bookings')
  await knex.schema.dropTableIfExists('courts')
  await knex.schema.dropTableIfExists('users')
}
5.8 Ejemplo de migración Mongo (backend/src/infra/db/mongo/migrations/202410161210_init.js)
// Umzug ejecuta esta función con un contexto { db }
export const up = async ({ db }) => {
  await db.createCollection('users')
  await db.createCollection('courts')
  await db.createCollection('bookings')
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
}


export const down = async ({ db }) => {
  await db.collection('bookings').drop().catch(() => {})
  await db.collection('courts').drop().catch(() => {})
  await db.collection('users').drop().catch(() => {})
}
5.9 Runner de migraciones unificado (backend/src/scripts/migrate.js)
import { Umzug, memoryStorage } from 'umzug'
    const { MongoClient } = await import('mongodb')
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
    const db = client.db(process.env.MONGO_DB)
    return { db, client }
  } else {
    const knexModule = await import('knex')
    const config = (await import('../infra/db/knex/knexfile.cjs')).default
    const knex = knexModule.default(config)
    return { knex }
  }
}


function createUmzug(ctx) {
  if (provider === 'mongo') {
    const migrationsPath = resolve(__dirname, '../infra/db/mongo/migrations')
    return new Umzug({
      context: { db: ctx.db },
      migrations: { glob: migrationsPath + '/*.js' },
      storage: memoryStorage(), // para simplificar; se puede implementar storage en colección
      logger: console
    })
  } else {
    const migrationsPath = resolve(__dirname, '../infra/db/knex/migrations')
    return new Umzug({
      context: { knex: ctx.knex },
      migrations: {
        glob: migrationsPath + '/*.cjs',
        resolve: ({ name, path, context }) => ({
          name,
          up: async () => (await import(path)).up(context.knex),
          down: async () => (await import(path)).down(context.knex)
        })
      },
      storage: memoryStorage(), // para simplificar en MVP
      logger: console
    })
  }
}


const action = process.argv[2] || 'up'
const ctx = await getContext()
const umzug = createUmzug(ctx)


if (action === 'down') await umzug.down()
else await umzug.up()


if (ctx.client) await ctx.client.close()
if (ctx.knex) await ctx.knex.destroy()

En producción se recomienda usar un storage persistente para Umzug (tabla/colección) en lugar de memoryStorage. Umzug provee interfaces para implementarlo rápidamente.

6) Backend HTTP (Express)

Rutas MVP:

POST /api/auth/register, POST /api/auth/login, GET /api/users/me

GET /api/courts, GET /api/courts/:id

POST /api/bookings, GET /api/bookings?courtId=&date=

POST /api/teams, GET /api/teams/:id

POST /api/matches

POST /api/bets

Capas:

controllers: I/O HTTP (sin lógica)

services: orquesta casos de uso

repositories: contratos; selecciona implementación repo-sql o repo-mongo según DB_PROVIDER

Middlewares: auth.js, validate.js (Zod), error.js centralizado.

OpenAPI: docs/openapi.yml servido en /api/docs con swagger-ui-express.

7) Frontend (React + Vite + PrimeReact + Tailwind)

Rutas/áreas: Courts, Bookings, Teams, Matches, Bets.

Estado global: Zustand (auth token, user, uiFlags).

UI: PrimeReact (DataTable, Dialog, Calendar, Dropdown) + Tailwind para layout/espaciados.

Servicios: services/api.js con fetch, inyecta VITE_API_BASE_URL.

Tailwind setup (frontend):

yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

tailwind.config.js: content sobre ./index.html y ./src/**/*.{js,jsx}.

8) Dependencias (por workspace)
Raíz (package.json)

npm-run-all (si se desea paralelo) o usar yarn workspaces run.

eslint, prettier, husky, lint-staged.

Backend

Prod: express, cors, helmet, compression, zod, jsonwebtoken, bcryptjs, express-rate-limit, swagger-ui-express, yamljs, knex, pg, mysql2, mongodb, umzug.

Dev: nodemon (si se prefiere), pino/morgan.

Frontend

Prod: react, react-dom, react-router-dom, zustand, primereact, primeicons.

Dev: vite, tailwindcss, postcss, autoprefixer.

9) Scripts Yarn

package.json (raíz)

{
  "name": "redbulljab",
  "private": true,
  "packageManager": "yarn@stable",
  "workspaces": ["frontend", "backend", "shared"],
  "scripts": {
    "dev": "yarn workspace rbj-backend dev & yarn workspace rbj-frontend dev",
    "dev:backend": "yarn workspace rbj-backend dev",
    "dev:frontend": "yarn workspace rbj-frontend dev",
    "migrate": "yarn workspace rbj-backend migrate",
    "seed": "yarn workspace rbj-backend seed",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}

backend/package.json

{
  "name": "rbj-backend",
  "type": "module",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "NODE_ENV=production node src/server.js",
    "migrate": "node src/scripts/migrate.js up",
    "migrate:down": "node src/scripts/migrate.js down",
    "seed": "node src/scripts/seed.js"
  }
}

frontend/package.json

{
  "name": "rbj-frontend",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5173"
  }
}
10) Convenciones y calidad

ESM en todo el repo.

Nombres: carpetas kebab-case, archivos camelCase.js.

Controller → Service → Repo (separación estricta).

Validaciones Zod antes de servicios.

Errores centralizados con errorHandler y códigos HTTP claros.

Prettier + ESLint sin errores en CI.

11) Seguridad

JWT simple (access token). Rutas sensibles con rate-limit.

CORS restringido (en prod) a dominios conocidos.

Helmet para cabeceras y compression para payloads.

12) Swagger / OpenAPI

backend/src/docs/openapi.yml describe endpoints MVP.

Montado en /api/docs.

Mantener ejemplos de respuestas 200/400/401/404.

13) Puesta en marcha — Paso a paso
# 0) Node 22 y Corepack
corepack enable
corepack prepare yarn@stable --activate


# 1) Clonar e instalar
yarn install


# 2) Configurar entorno backend
cp backend/.env.example backend/.env
# Editar DB_PROVIDER=postgres y credenciales PG_*


# 3) Levantar base de datos (opcional Docker local)
# Postgres
# docker run --name pg-rbj -e POSTGRES_PASSWORD=rbjab -e POSTGRES_USER=rbjab -e POSTGRES_DB=rbjab -p 5432:5432 -d postgres:16
# Mongo
# docker run --name mongo-rbj -p 27017:27017 -d mongo:7


# 4) Migraciones
yarn migrate


# 5) Semillas (canchas demo, usuario demo)
yarn seed


# 6) Levantar backend y frontend en paralelo
yarn dev
# Backend: http://localhost:4000  |  Frontend: http://localhost:5173


# 7) Ver Swagger
# http://localhost:4000/api/docs
14) Esqueleto visual (frontend)

Layout base: Layout.jsx con Topbar (logo RedBullJab, enlaces) y contenedor.

Home: CTA a “Buscar canchas” y “Crear reserva”.

CourtsList: tabla con PrimeReact (filtros rápidos, paginación). Card por cancha en mobile.

CourtDetail: hero con datos, slots disponibles del día, botón “Reservar”.

BookingNew: formulario (cancha, fecha/hora rango, confirmación).

Teams/Matches/Bets: placeholders listos para iterar.

Paleta inicial (sugerencia):

Primario: #0ea5e9 (sky-500) / Hover #0284c7

Secundario: #f59e0b (amber-500)

Grises: Tailwind slate

Fondo: #0b1220 (modo oscuro opcional) o #f8fafc

15) Roadmap técnico inmediato

Bootstrap monorepo con Yarn workspaces.

Backend: endpoints /courts (GET) y /bookings (POST) funcionales con Postgres.

Migraciones: validar up/down en Postgres y MySQL; crear 1 migración Mongo (índices).

Frontend: CourtsList consumiendo /courts.

Auth JWT (register/login) y guard en front.

OpenAPI completo MVP.

Semillas (3 canchas, 1 user demo) y datos de prueba.

16) Criterios DoD del MVP

Aplicación levanta con yarn dev (front+back) y responde /api/courts.

Migraciones up/down operativas en Postgres y Mongo (al menos init).

Swagger accesible y actualizado.

Lint/format sin errores; manejo de errores consistente.

UX base navegable (Courts → Detail → Booking).

Con esta guía tienes el modelo inicial para crear el repo, instalar, migrar y levantar el MVP con Postgres como base y multibase listo para crecer (MySQL/Mongo). Cuando quieras, generamos el boilerplate de archivos con los primeros controladores, repos y migraciones reales para empezar a codificar de inmediato.

Perfecto. Acabo de actualizar el documento en el canvas con toda la guía ampliada que pediste:

DB principal: PostgreSQL, con portabilidad real a MySQL y MongoDB.

Migraciones híbridas con Umzug como orquestador:

SQL (Postgres/MySQL) vía Knex (migraciones up/down portables).

Mongo con el MongoDB Driver (migraciones documentales up/down separadas).

Runner único de migraciones (backend/src/scripts/migrate.js) que detecta DB_PROVIDER y ejecuta el pipeline correcto.

Yarn (Berry) + Corepack, Node 22 LTS, ESM puro.

Frontend: React + Vite + PrimeReact (componentes) + Tailwind (utilidades de estilo).

Backend: Express + Zod + JWT + Swagger/OpenAPI.

Estructura de carpetas completa (monorepo con frontend/, backend/, shared/), ejemplos de migraciones SQL y Mongo, variables de entorno por proveedor, y scripts Yarn para dev, migrate, seed.

También dejé un paso a paso claro para levantar todo con yarn (instalar, configurar .env, correr migraciones y seeds, y levantar front/back en paralelo), más el esqueleto visual inicial del front y los criterios DoD del MVP.