# RetoYa Frontend

Frontend de la aplicación RetoYa construido con React, Vite, PrimeReact y Tailwind CSS.

## 🚀 Características

- **Página Principal Completa**: Header con login/registro y sección de canchas
- **Autenticación**: Modal de login/registro con PrimeReact
- **Gestión de Canchas**: Visualización de canchas disponibles con información detallada
- **Diseño Responsivo**: Optimizado para móviles, tablets y desktop
- **UI Moderna**: Componentes PrimeReact con tema personalizado

## 🛠️ Tecnologías

- **React 18**: Framework principal
- **Vite**: Build tool y servidor de desarrollo
- **PrimeReact**: Biblioteca de componentes UI
- **Tailwind CSS**: Framework de estilos
- **Zustand**: Gestión de estado
- **React Router**: Navegación

## 📦 Instalación

```bash
# Instalar dependencias
npm install
# o
yarn install

# Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
```

## 🎨 Componentes Principales

### AuthModal
Modal de autenticación con login y registro integrados.

### CourtsSection
Sección que muestra las canchas disponibles con:
- Cards informativos
- Estados de disponibilidad
- Precios por hora
- Imágenes de las canchas

### Header
Header principal con:
- Logo de RetoYa
- Navegación principal
- Botones de login/registro
- Menú de usuario (cuando está autenticado)

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```
VITE_API_URL=http://localhost:4000/api
```

### PrimeReact
Configuración optimizada en `config/primeReact.js`:
- Ripple effects habilitados
- Input style outlined
- Z-index optimizado

## 📱 Responsive Design

La aplicación está optimizada para:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🎯 Funcionalidades

### Página Principal
- Hero section con call-to-action
- Sección de características
- Lista de canchas disponibles
- Footer completo

### Autenticación
- Login con email/password
- Registro con datos completos
- Gestión de sesión con Zustand
- Auto-login después del registro

### Canchas
- Carga dinámica desde API
- Estados de disponibilidad
- Información detallada
- Navegación a detalles

## 🚀 Próximas Mejoras

- [ ] Filtros de búsqueda de canchas
- [ ] Sistema de reservas integrado
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] PWA support

## 📄 Estructura de Archivos

```
frontend/
├── components/
│   ├── Auth/
│   │   └── AuthModal.jsx
│   ├── Courts/
│   │   └── CourtsSection.jsx
│   └── Layout/
│       └── Header.jsx
├── pages/
│   └── Home.jsx
├── app/
│   ├── store/
│   │   └── auth.js
│   └── styles/
│       └── index.css
├── config/
│   └── primeReact.js
└── services/
    └── api.js
```
