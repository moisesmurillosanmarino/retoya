# RedBullJab - Plataforma de Reservas Deportivas

RedBullJab es una plataforma completa para reservas de canchas deportivas, gestión de equipos, partidos y apuestas deportivas.

## 🚀 Características Principales

- **Reservas de Canchas**: Sistema completo de reservas con calendario y pagos
- **Gestión de Equipos**: Creación y administración de equipos deportivos
- **Partidos y Torneos**: Organización de partidos y competencias
- **Sistema de Apuestas**: Plataforma de apuestas deportivas
- **Multi-rol**: Soporte para usuarios, propietarios de canchas y administradores
- **Multi-base de datos**: PostgreSQL, MySQL y MongoDB

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con Vite
- **PrimeReact** para componentes UI
- **TailwindCSS** para estilos
- **Zustand** para manejo de estado
- **React Router** para navegación

### Backend
- **Node.js 22 LTS** con Express
- **JavaScript ESM** (sin TypeScript en MVP)
- **Zod** para validación
- **JWT** para autenticación
- **Swagger/OpenAPI** para documentación

### Base de Datos
- **PostgreSQL** (principal)
- **MySQL** (portabilidad)
- **MongoDB** (portabilidad)
- **Knex.js** para SQL
- **MongoDB Driver** para Mongo
- **Umzug** para migraciones híbridas

### Herramientas
- **Yarn Berry** con Corepack
- **ESLint** y **Prettier**
- **Husky** para git hooks

## 📁 Estructura del Proyecto

```
redbulljab/
├── frontend/                 # Aplicación React
│   ├── app/
│   │   ├── routes.jsx       # Rutas de la aplicación
│   │   ├── store/           # Stores de Zustand
│   │   └── styles/          # Estilos CSS
│   ├── components/          # Componentes reutilizables
│   ├── pages/               # Páginas de la aplicación
│   ├── services/            # Servicios API
│   └── package.json
├── backend/                  # API Express
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── domain/          # Lógica de negocio
│   │   ├── http/            # Controladores y rutas
│   │   ├── infra/           # Repositorios y DB
│   │   └── scripts/        # Migraciones y seeds
│   └── package.json
├── documentacion/           # Documentación del proyecto
└── package.json             # Configuración del monorepo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 22 LTS o superior
- PostgreSQL (recomendado) o SQLite para desarrollo
- Yarn Berry (se instala automáticamente con Corepack)

### 1. Habilitar Corepack y Yarn
```bash
corepack enable
corepack prepare yarn@stable --activate
```

### 2. Instalar dependencias
```bash
# Instalar dependencias del monorepo
npm install

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Configurar variables de entorno
```bash
# Backend
cd backend
cp .env.example .env
# Editar backend/.env con tus credenciales de base de datos
```

### 4. Configurar base de datos
```bash
# PostgreSQL (recomendado)
# Crear base de datos 'retoya' en PostgreSQL
# Usuario: postgres, sin contraseña (configuración local)

# SQLite (alternativa para desarrollo)
# No requiere configuración adicional
```

### 5. Ejecutar migraciones
```bash
cd backend
npm run migrate
```

### 6. Poblar con datos de ejemplo
```bash
npm run seed
```

### 7. Iniciar la aplicación
```bash
# Opción 1: Iniciar backend y frontend por separado
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Opción 2: Usar scripts del monorepo (si Yarn Berry está configurado)
cd ..
yarn dev
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Documentación API**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/health

## 👥 Usuarios de Prueba

Después de ejecutar `npm run seed`, tendrás estos usuarios disponibles:

- **Admin**: admin@retaya.com / admin123
- **Propietario**: owner@retaya.com / owner123  
- **Usuario**: user@retaya.com / user123

### Datos de Ejemplo Creados
- **Venue**: Complejo Deportivo El Dorado
- **Canchas**: 3 canchas (Fútbol 5, 7 y 11)
- **Equipo**: Los Campeones
- **Cupón**: BIENVENIDO20 (20% descuento)

## 📚 Documentación API

La documentación completa de la API está disponible en:
- **Swagger UI**: http://localhost:4000/api/docs
- **OpenAPI Spec**: `backend/src/docs/openapi.yml`

## 🗄️ Base de Datos

### Proveedores Soportados
- **PostgreSQL** (recomendado para producción)
- **MySQL** (compatible)
- **MongoDB** (compatible)

### Cambiar Proveedor
Edita `backend/.env`:
```bash
# Para PostgreSQL
DB_PROVIDER=postgres

# Para MySQL
DB_PROVIDER=mysql

# Para MongoDB
DB_PROVIDER=mongo
```

### Migraciones
```bash
# Ejecutar migraciones
yarn migrate

# Revertir migraciones
yarn migrate:down
```

## 🧪 Scripts Disponibles

### Monorepo (raíz)
- `npm install` - Instala dependencias del monorepo
- `yarn dev` - Inicia frontend y backend (requiere Yarn Berry)
- `yarn dev:frontend` - Solo frontend
- `yarn dev:backend` - Solo backend
- `yarn migrate` - Ejecuta migraciones
- `yarn seed` - Pobla base de datos
- `yarn build` - Construye frontend
- `yarn start` - Inicia backend en producción

### Backend
- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run start` - Servidor de producción
- `npm run migrate` - Ejecuta migraciones
- `npm run migrate:down` - Revierte migraciones
- `npm run seed` - Pobla base de datos

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Vista previa de producción

## 🔧 Configuración de Desarrollo

### Variables de Entorno

#### Backend (`backend/.env`)
```bash
# Proveedor de base de datos
DB_PROVIDER=postgres

# Configuración del servidor
NODE_ENV=development
PORT=4000

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=rbjab
PG_USER=rbjab
PG_PASSWORD=rbjab

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```bash
VITE_API_URL=http://localhost:4000/api
```

## 🎨 Temas y Estilos

El proyecto usa una combinación de:
- **PrimeReact**: Componentes UI profesionales
- **TailwindCSS**: Utilidades de estilo
- **Colores de marca**: Sky blue (#0ea5e9) y Amber (#f59e0b)

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa
- **Tablet**: Adaptación de componentes
- **Mobile**: Interfaz móvil-first

## 🔒 Seguridad

- **JWT** para autenticación
- **Rate limiting** en endpoints
- **CORS** configurado
- **Helmet** para headers de seguridad
- **Validación** con Zod
- **Hash de contraseñas** con bcrypt

## 🚀 Despliegue

### Producción
1. Configurar variables de entorno de producción
2. Ejecutar `yarn build` para frontend
3. Ejecutar `yarn start` para backend
4. Configurar proxy reverso (Nginx/Apache)

### Docker (próximamente)
```bash
# Docker Compose para desarrollo completo
docker-compose up -d
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: support@redbulljab.com
- **Documentación**: Ver carpeta `documentacion/`

---

**RedBullJab** - Conectando deportistas a través de la tecnología ⚽🏀🎾