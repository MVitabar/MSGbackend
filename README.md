# Chat App Backend

Backend para aplicación de mensajería en tiempo real desarrollada con NestJS, Prisma, PostgreSQL y WebSockets.

## Características

- 🔐 Autenticación dual (email/teléfono) con JWT
- 👥 Gestión de usuarios con soporte para email y teléfono
- 💬 Chats individuales y grupales
- 📨 Mensajería en tiempo real con WebSockets
- 🖼️ Soporte para archivos multimedia
- 📖 Estado de lectura de mensajes
- 🔍 Búsqueda de usuarios por nombre, email o teléfono

## Tecnologías

- **NestJS** - Framework Node.js progresivo
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Socket.IO** - Comunicación en tiempo real
- **JWT** - Autenticación
- **TypeScript** - Tipado estático

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL
- Bun (opcional, como gestor de paquetes)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd chat-app-backend
   ```

2. **Instalar dependencias**
   ```bash
   # Con npm
   npm install

   # Con yarn
   yarn install

   # Con bun (recomendado)
   bun install
   ```

3. **Configurar base de datos**
   - Crear una base de datos PostgreSQL
   - Actualizar el archivo `.env` con tus credenciales:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/chat_app?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   NODE_ENV=development
   ```

4. **Ejecutar migraciones de Prisma**
   ```bash
   # Generar cliente de Prisma
   npx prisma generate

   # Ejecutar migraciones
   npx prisma db push

   # O usar migrate para producción
   npx prisma migrate dev
   ```

5. **Iniciar la aplicación**
   ```bash
   # Desarrollo
   npm run start:dev

   # Producción
   npm run build
   npm run start:prod
   ```

## Uso

### Endpoints principales

#### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

#### Usuarios
- `GET /users` - Lista de usuarios
- `GET /users/:id` - Detalles de usuario
- `GET /users/username/:username` - Usuario por nombre de usuario
- `GET /users/email/:email` - Usuario por email
- `GET /users/phone/:phone` - Usuario por teléfono
- `GET /users/search?q=query` - Búsqueda de usuarios (nombre, email, teléfono)

#### Chats
- `POST /chats/direct` - Crear chat directo
- `POST /chats/group` - Crear chat grupal
- `GET /chats` - Lista de chats del usuario
- `GET /chats/:id` - Detalles de chat

#### Mensajes
- `POST /messages` - Enviar mensaje
- `GET /messages/:chatId` - Obtener mensajes de chat
- `POST /messages/:messageId/read` - Marcar mensaje como leído

### WebSockets

Conectar al servidor WebSocket:
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Unirse a un chat
socket.emit('join-chat', { chatId: 'chat-id' });

// Enviar mensaje
socket.emit('send-message', {
  content: 'Hola!',
  chatId: 'chat-id'
});

// Escuchar mensajes nuevos
socket.on('new-message', (message) => {
  console.log('Nuevo mensaje:', message);
});
```

## 📱 **Ejemplos de uso**

### **Registro de usuario:**
```javascript
// Con email y teléfono opcional
POST /auth/register
{
  "email": "usuario@ejemplo.com",
  "phone": "+5491123456789", // Opcional
  "username": "usuario123",
  "password": "micontraseña123"
}
```

### **Login flexible:**
```javascript
// Login con email
POST /auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "micontraseña123"
}

// O login con teléfono
POST /auth/login
{
  "phone": "+5491123456789",
  "password": "micontraseña123"
}
```

### **Búsqueda de usuarios:**
```javascript
// Buscar por nombre, email o teléfono
GET /users/search?q=usuario123
GET /users/search?q=usuario@ejemplo.com
GET /users/search?q=+5491123456789
```

### **Obtener usuario por teléfono:**
```javascript
GET /users/phone/+5491123456789
```

## Estructura del proyecto

```
src/
├── auth/                 # Módulo de autenticación
├── users/                # Módulo de usuarios
├── chats/                # Módulo de chats
├── messages/             # Módulo de mensajes
├── chat-ws/              # WebSockets para tiempo real
├── prisma/               # Configuración de Prisma
└── common/               # Utilidades compartidas

## 📊 **Estructura del modelo User**

### 🏗️ **Campos de la tabla `users`:**

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `id` | `String` | ID único (CUID automático) | ✅ |
| `email` | `String` | Correo electrónico único | ✅ |
| `phone` | `String?` | Número de teléfono único (opcional) | ❌ |
| `username` | `String` | Nombre de usuario único | ✅ |
| `password` | `String` | Contraseña (hasheada) | ✅ |
| `avatar` | `String?` | URL de imagen de perfil | ❌ |
| `status` | `String` | Estado: "online" / "offline" | ❌ (default: "offline") |
| `createdAt` | `DateTime` | Fecha de creación | ❌ (automático) |
| `updatedAt` | `DateTime` | Última actualización | ❌ (automático) |

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | - |
| `JWT_SECRET` | Clave secreta para JWT | - |
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |

## Desarrollo

### Scripts disponibles

- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run test` - Ejecutar pruebas
- `npm run lint` - Verificar código

### Prisma

- `npx prisma studio` - Abrir Prisma Studio
- `npx prisma generate` - Generar cliente
- `npx prisma db push` - Aplicar cambios al schema

## Próximas características

- [ ] Notificaciones push
- [ ] Mensajes temporales
- [ ] Estados "escribiendo..."
- [ ] Subida de archivos mejorada
- [ ] Encriptación end-to-end
