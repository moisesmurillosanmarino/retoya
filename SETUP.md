# 🚀 RedBullJab - Guía de Setup y Desarrollo

## 📋 Prerrequisitos

### Software Requerido
- **Node.js**: v22 LTS o superior
- **PostgreSQL**: v14 o superior (recomendado)
- **Yarn**: v4 (Berry) - se instala automáticamente con Corepack

### Configuración Inicial
```bash
# Habilitar Corepack y Yarn Berry
corepack enable
corepack prepare yarn@stable --activate
```

## 🛠️ Setup del Proyecto

### 1. Instalación de Dependencias
```bash
# Desde la raíz del proyecto
cd redbulljab
yarn install

# O instalar por separado
cd backend
yarn install

cd ../frontend
yarn install
```

### 2. Configuración de Base de Datos

#### Crear archivo .env
```bash
cd backend
cp .env.example .env  # Si existe
# O crear manualmente el archivo .env con:
```

```bash
# Configuración del servidor
NODE_ENV=development
PORT=4000
LOG_LEVEL=info

# Proveedor de base de datos
DB_PROVIDER=postgres

# PostgreSQL (configurar según tu instalación)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=rbjab
PG_USER=postgres
PG_PASSWORD=tu_password_aqui

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Configurar PostgreSQL
```bash
# Opción 1: Docker (recomendado para desarrollo)
docker run --name pg-rbj \
  -e POSTGRES_PASSWORD=tu_password \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:16

# Opción 2: Instalación local
# Crear usuario y base de datos
sudo -u postgres psql
CREATE USER postgres WITH PASSWORD 'tu_password';
CREATE DATABASE rbjab OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE rbjab TO postgres;
\q
```

### 3. Ejecutar Setup Automático
```bash
cd backend
node setup.js
```

Este script automáticamente:
- ✅ Verifica la configuración
- ✅ Crea la base de datos si no existe
- ✅ Ejecuta las migraciones
- ✅ Verifica el estado final

### 4. Setup Manual (Alternativo)

#### Crear base de datos
```bash
cd backend
node create-db.js
```

#### Ejecutar migraciones
```bash
npm run migrate
# o
node src/scripts/migrate.js up
```

#### Poblar datos de ejemplo
```bash
npm run seed
# o
node src/scripts/seed.js
```

### 5. Verificar Instalación

#### Verificar estado de migraciones
```bash
node check-migration-status.js
```

#### Verificar base de datos
```bash
node check-db.js
```

## 🚀 Iniciar Desarrollo

### Backend
```bash
cd backend
npm run dev
# Servidor en: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
# Health: http://localhost:4000/health
```

### Frontend
```bash
cd frontend
npm run dev
# Aplicación en: http://localhost:5173
```

### Ambos (Monorepo)
```bash
# Desde la raíz
yarn dev
```

## 📊 Verificación del Estado

### URLs de Verificación
- **Health Check**: http://localhost:4000/health
- **API Documentation**: http://localhost:4000/api/docs
- **Frontend**: http://localhost:5173

### Usuarios de Prueba (después de seed)
- **Admin**: admin@retaya.com / admin123
- **Owner**: owner@retaya.com / owner123
- **User**: user@retaya.com / user123

### Datos de Ejemplo Creados
- **Venue**: Complejo Deportivo El Dorado
- **Canchas**: 3 canchas (Fútbol 5, 7 y 11)
- **Equipo**: Los Campeones
- **Cupón**: BIENVENIDO20 (20% descuento)

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev              # Servidor de desarrollo
npm run start            # Servidor de producción
npm run migrate          # Ejecutar migraciones
npm run migrate:down     # Revertir migraciones
npm run seed             # Poblar datos de ejemplo
```

### Monorepo
```bash
yarn dev                 # Frontend + Backend
yarn dev:backend         # Solo backend
yarn dev:frontend        # Solo frontend
yarn migrate             # Migraciones
yarn seed                # Datos de ejemplo
yarn build               # Construir frontend
yarn start               # Backend en producción
```

## 🗄️ Base de Datos

### Esquema Creado
- **Esquema**: `retaya`
- **Tablas principales**: users, roles, venues, courts, bookings, teams, matches, bets
- **Características**: Soft deletes, auditoría, triggers automáticos

### Migraciones
- **Sistema**: Umzug con Knex.js
- **Archivo**: `202410170000_retaya_complete_schema.js`
- **Estado**: Verificar con `node check-migration-status.js`

## 🐛 Solución de Problemas

### Error de Conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo systemctl status postgresql
# o
brew services list | grep postgresql

# Verificar puerto
netstat -an | grep 5432
```

### Error de Permisos
```bash
# Verificar usuario y permisos
sudo -u postgres psql
\l  # Listar bases de datos
\du # Listar usuarios
```

### Error de Migraciones
```bash
# Verificar estado
node check-migration-status.js

# Revertir y volver a ejecutar
npm run migrate:down
npm run migrate
```

### Puerto en Uso
```bash
# Cambiar puerto en .env
PORT=4001  # Para backend
# O en vite.config.js para frontend
```

## 📚 Documentación Adicional

- **Arquitectura**: `documentacion/proyectoAdquitectura.md`
- **Flujo End-to-End**: `documentacion/flujo end-to-end.md`
- **API Documentation**: http://localhost:4000/api/docs
- **OpenAPI Spec**: `backend/src/docs/openapi.yml`

## 🎯 Próximos Pasos de Desarrollo

1. **Implementar Controladores**: Completar lógica en `src/http/controllers/`
2. **Desarrollar Servicios**: Implementar casos de uso en `src/domain/services/`
3. **Crear Repositorios**: Implementar acceso a datos en `src/infra/repo-sql/`
4. **Validaciones**: Completar schemas Zod en `src/http/validators/`
5. **Frontend**: Desarrollar páginas funcionales en `frontend/pages/`

---

**¡Listo para desarrollar! 🚀**
