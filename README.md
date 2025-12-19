# 🎨 Secret Manager - Frontend Dashboard

Panel de administración web para Secret Manager. Interfaz moderna y responsive construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- **Dashboard completo** - Visualización de estadísticas y gestión de recursos
- **Gestión de Secretos** - CRUD completo con búsqueda y filtros
- **Gestión de Proyectos** - Organización de secretos
- **API Keys** - Generación y gestión de keys de acceso
- **Auditoría** - Visualización de logs de acceso
- **Autenticación** - Login/Logout integrado con JWT
- **Dark Mode** - Soporte para tema oscuro
- **Responsive** - Diseño adaptable a todos los dispositivos

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Backend API corriendo (ver [backend repository](https://github.com/ivargasm/secret-manager-backend))

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd secret-manager-frontend
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Primer Uso

### 1. Registrar usuario admin

Antes de usar el frontend, debes registrar el primer usuario en el backend:

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "tu-password-seguro"
  }'
```

### 2. Hacer login en el frontend

1. Abre `http://localhost:3000`
2. Haz clic en "Login"
3. Ingresa tus credenciales
4. Serás redirigido al dashboard

### 3. Crear tu primer secreto

1. Ve a la sección "Secretos"
2. Haz clic en "Nuevo Secreto"
3. Completa el formulario:
   - **Nombre**: `DATABASE_PASSWORD`
   - **Valor**: `mi-password-secreto`
   - **Descripción**: `Password de la base de datos`
   - **Proyecto**: (opcional)
4. Haz clic en "Crear"

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── login/          # Página de login
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Layout del dashboard
│   │   │   ├── page.tsx        # Home del dashboard
│   │   │   ├── secrets/        # Gestión de secretos
│   │   │   ├── projects/       # Gestión de proyectos
│   │   │   ├── api-keys/       # Gestión de API keys
│   │   │   └── audit/          # Logs de auditoría
│   │   ├── components/
│   │   │   ├── SecretForm.tsx
│   │   │   ├── SecretViewModal.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── APIKeyCreateModal.tsx
│   │   ├── lib/
│   │   │   └── api.tsx         # Cliente API
│   │   ├── store/
│   │   │   └── Store.tsx       # Zustand store
│   │   └── globals.css
│   ├── types/
│   │   └── vault.ts            # TypeScript types
│   └── components/
│       └── ui/                 # shadcn/ui components
├── public/
├── package.json
└── README.md
```

## 🎨 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Iconos**: Lucide React
- **Autenticación**: JWT con cookies

## 📱 Funcionalidades

### Dashboard
- Estadísticas generales
- Contadores de recursos
- Acceso rápido a secciones

### Secretos
- ✅ Listar todos los secretos
- ✅ Buscar por nombre
- ✅ Filtrar por proyecto
- ✅ Crear nuevo secreto
- ✅ Editar secreto existente
- ✅ Ver valor descifrado (con show/hide)
- ✅ Copiar valor al clipboard
- ✅ Eliminar secreto

### Proyectos
- ✅ Listar proyectos
- ✅ Crear proyecto
- ✅ Editar proyecto
- ✅ Eliminar proyecto
- ✅ Vista en cards

### API Keys
- ✅ Listar API keys
- ✅ Generar nueva key
- ✅ Ver key solo una vez (con advertencia)
- ✅ Copiar key al clipboard
- ✅ Desactivar key
- ✅ Ver último uso

### Auditoría
- ✅ Ver logs de acceso
- ✅ Estadísticas por tipo de acción
- ✅ Filtrar por acción (read/create/update/delete)
- ✅ Buscar por secreto o usuario
- ✅ Iconos y colores por tipo

## 🔒 Seguridad

- **JWT Authentication** - Tokens almacenados en cookies HttpOnly
- **CORS** - Configuración restrictiva
- **Validación** - Validación de formularios en cliente y servidor
- **Password masking** - Ocultación de valores sensibles
- **Copy protection** - Advertencias al copiar secretos

## 🚀 Deployment

### Build de producción

```bash
npm run build
# o
yarn build
```

### Iniciar en producción

```bash
npm start
# o
yarn start
```

### Docker

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Variables de Entorno (Producción)

```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
NODE_ENV=production
```

## 🎯 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm start            # Iniciar producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

MIT License - ver archivo LICENSE para más detalles

## 👤 Autor

Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

## 🔗 Links

- [Backend Repository](https://github.com/tu-usuario/secret-manager-backend)
- [Documentación](https://github.com/tu-usuario/secret-manager-frontend/wiki)
