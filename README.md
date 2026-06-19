# client-auditor-gesap

Panel de auditoría del Sistema GESAP. Interfaz para auditores y super auditores del MSPAS para supervisar sesiones, usuarios, acciones y hospitales.

## Stack

- React 18 + TypeScript
- Vite + Tailwind CSS v4
- Zustand (estado global, persistido en localStorage)
- Axios (cliente HTTP)
- Socket.IO client (kick en tiempo real + sesiones en tiempo real)
- React Router v6

## Puerto de desarrollo

```
http://localhost:5175
```

## Roles con acceso

| Rol | Funcionalidades |
|-----|-----------------|
| `AUDITOR` | Ve solo datos de su hospital. No puede gestionar otros AUDITOR/SUPER_AUDITOR |
| `SUPER_AUDITOR` | Acceso completo a todos los hospitales y usuarios del sistema |

## Instalación y desarrollo

```bash
pnpm install    # o npm install
pnpm dev        # http://localhost:5175
```

Requiere que **gesap-api** esté corriendo en `localhost:3000` y **gesap-auditor** en `localhost:3001`.

## Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/auditor/dashboard` | Métricas generales del sistema |
| `/auditor/sesiones` | Sesiones activas en tiempo real con opción de kick |
| `/auditor/auditoria` | Historial de accesos con filtros de fecha y estado |
| `/auditor/bitacora` | Bitácora de acciones CRUD con filtros |
| `/auditor/usuarios` | Gestión de usuarios: crear, editar, toggle-active |
| `/auditor/seguridad` | Gestión de roles del sistema |
| `/auditor/hospitales` | Listado y gestión de establecimientos |
| `/auditor/mantenimiento` | Herramientas de mantenimiento de datos |
| `/auditor/reportes` | Reportes del sistema |

## Proxy de desarrollo (Vite)

No requiere `.env` — el proxy de Vite redirige automáticamente:

| Path | Destino |
|------|---------|
| `/gesap/v1/*` | `http://localhost:3000` (gesap-api) |
| `/gesap-auditor/v1/*` | `http://localhost:3001` (gesap-auditor) |
| `/auditor-ws/*` | `http://localhost:3001` WebSocket (kick + sesiones) |

## Build de producción

```bash
pnpm build
# Genera dist/ con base en /auditor/
# Copiar a www/client-auditor/ en el servidor para que nginx lo sirva
```

## Estructura principal

```
src/
├── app/
│   ├── layouts/DashboardPage.tsx
│   └── router/AppRoutes.tsx
├── features/
│   ├── auth/               # Login, ProtectedRoute, useKickListener
│   ├── sesionesActivas/    # Polling + WebSocket sessions:changed, kick modal
│   ├── auditoriaAcceso/    # Historial de login_sessions con filtros
│   ├── bitacoraAcciones/   # Historial de audit_logs con filtros
│   ├── gestionUsuarios/    # CRUD de usuarios con toggle y modal
│   ├── seguridadRoles/     # Gestión de roles
│   └── hospitales/         # Gestión de hospitales
└── shared/
    ├── api/                # Cliente axios + sessions, users, roles, hospitals, auditLogs
    ├── hooks/              # useKickListener
    └── components/layout/  # MainLayout, Sidebar, Navbar (responsive)
```
