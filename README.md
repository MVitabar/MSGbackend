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

## ⚠️ **IMPORTANTE: Migración de Bun a Node.js**

**Por problemas de compatibilidad y estabilidad en Railway**, este proyecto ha sido migrado de Bun a Node.js.

### **Razones de la migración:**
- ✅ **Estabilidad:** Node.js es más maduro y estable en plataformas de hosting
- ✅ **Compatibilidad:** Mejor soporte para todos los paquetes npm (Prisma, bcrypt, etc.)
- ✅ **Soporte oficial:** Railway y otros hosts soportan Node.js de forma nativa
- ✅ **Menos errores 502:** Node.js reduce problemas de deployment en producción

### **¿Por qué Bun causaba problemas?**
- 🚫 **Compatibilidad limitada:** Algunos paquetes no funcionan perfectamente con Bun
- 🚫 **Errores de parsing:** Problemas con archivos de configuración TOML/JSON
- 🚫 **Soporte limitado:** Railway no siempre detecta correctamente los comandos de Bun
- 🚫 **Debugging complejo:** Más difícil diagnosticar problemas en producción

### **¿Qué cambió?**
- ✅ Scripts de `package.json` usan `npm` en lugar de `bun`
- ✅ `railway.toml` configurado para `npm` en lugar de `bun`
- ✅ Scripts de diagnóstico actualizados para Node.js
- ✅ Eliminación de archivos de configuración específicos de Bun

### **Comandos actualizados:**
```bash
# Antes (Bun) ❌
bun run test:env
bun run build

# Ahora (Node.js) ✅
npm run test:env
npm run build
```

#### Variables de Entorno:
- `DATABASE_URL`: URL de PostgreSQL proporcionada por Railway
- `JWT_SECRET`: Clave secreta para JWT (cámbiala en producción)
- `NODE_ENV`: `production`
- `PORT`: Railway lo asigna automáticamente

#### Comandos de Build:
- **Package Manager**: `npm`
- **Build Command**: `npm install --frozen-lockfile && npm run build`
- **Start Command**: `npm run start:prod`

### Instalación con npm

```bash
# Instalar dependencias con npm
npm install

# Generar cliente Prisma
npm run prisma:generate

# Aplicar migraciones
npm run prisma:push

# Desarrollo
npm run start:dev

# Build para producción
npm run build

# Producción
npm run start:prod
```

### Scripts de Diagnóstico para Railway
```bash
# Verificación completa para Railway
npm run test:railway

# Setup completo para Railway
npm run setup:railway

# Verificar que el build funcione
npm run verify:deployment

# Diagnóstico completo
npm run test:diagnostic

# Probar base de datos
npm run test:db

# Verificar variables de entorno
npm run test:env

# Simular entorno de producción
npm run test:production
```

### Comandos Útiles con npm
- `npm install` - Instalar dependencias (compatible con Railway)
- `npm run build` - Build para producción
- `npm run start:prod` - Iniciar aplicación compilada
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:push` - Aplicar cambios a la base de datos

## 🔧 Troubleshooting

### Error 502 Bad Gateway

Si recibes errores 502 en producción, las causas más comunes son:

#### 1. **Problemas de conexión a la base de datos**
- Verifica que `DATABASE_URL` esté configurada correctamente en Railway
- Asegúrate de que la base de datos PostgreSQL esté creada y accesible
- Usa el script de test: `node test-db.js`

#### 2. **Endpoint esperando datos incorrectos**
- Revisa que el endpoint `/auth/login` reciba `email` O `phone`, más `password`
- Los campos son mutuamente exclusivos (usa uno u otro, no ambos)

#### 3. **Errores internos no atrapados**
- Cualquier excepción no manejada puede causar 502
- Revisa los logs de Railway para ver el error exacto

#### 4. **Problemas de build**
- Paquetes nativos como `bcrypt` pueden fallar en Railway
- Asegúrate de que el build complete correctamente
### Scripts de diagnóstico

#### Verificar variables de entorno:
```bash
npm run test:env
```

#### Probar conexión a la base de datos:
```bash
npm run test:db
```

#### Probar endpoints con diagnóstico completo:
```bash
node test-login-axios.js
```

#### Simular entorno de producción:
```bash
npm run test:production
```

#### Verificación completa para Railway:
```bash
npm run test:railway
```

### Logs de Railway

Para ver los logs completos en Railway:
1. Ve a tu proyecto en Railway
2. Selecciona tu servicio
3. Ve a la pestaña "Logs"
4. Revisa tanto los logs de build como los de runtime

### Endpoint de Health

Para verificar que la aplicación funcione sin depender de la base de datos:
```bash
curl https://tu-app.railway.app/auth/health
```

Si `/health` responde correctamente pero `/auth/login` falla, el problema está en la lógica específica del login.

### Problemas Comunes con Node.js en Railway

#### 1. **Build Command incorrecto**
- ✅ **Correcto**: `npm install --frozen-lockfile && npm run build`
- ❌ **Incorrecto**: `npm install` (sin lockfile)

#### 2. **Start Command incorrecto**
- ✅ **Correcto**: `npm run start:prod`
- ❌ **Incorrecto**: `node dist/main.js` (sin usar npm scripts)

#### 3. **Variables de entorno no configuradas**
- Asegúrate de que `DATABASE_URL` esté configurada en Railway
- Verifica que `JWT_SECRET` esté configurada
- Railway debe usar `npm` como Package Manager

#### 4. **Prisma Client no generado**
- El build debe incluir `prisma generate`
- Verifica que el cliente Prisma esté en `node_modules/@prisma/client`

### Comandos de Verificación Rápida

```bash
# Verificar que Node.js funcione
node --version

# Verificar que el build funcione
npm run verify:deployment

# Setup completo
npm run setup:railway

# Verificación completa de Railway
npm run test:railway
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
