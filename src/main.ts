import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir requests desde el frontend Flutter, desarrollo web y dispositivos móviles
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  app.enableCors({
    origin: isProduction
      ? ['*'] // Permitir todos los orígenes en producción para apps móviles
      : [
          'http://localhost:3000', // Para desarrollo web si lo usas
          'http://localhost:56276', // Puerto típico de Flutter dev server
          'http://127.0.0.1:56276', // Alternativa localhost
          /^https?:\/\/localhost:\d+$/, // Cualquier puerto localhost para desarrollo
          /^https?:\/\/127\.0\.0\.1:\d+$/, // Cualquier puerto 127.0.0.1 para desarrollo
          // Redes locales para dispositivos móviles (reemplaza con tu IP real)
          /^https?:\/\/192\.168\.1\.\d+:3000$/, // Red local 192.168.1.x
          /^https?:\/\/10\.0\.0\.\d+:3000$/, // Red local 10.0.0.x
          /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:3000$/, // Red local 172.16-31.x
          // Para desarrollo con emulador o IP específica del teléfono
          'http://192.168.1.100:3000', // Ejemplo: reemplaza con la IP de tu teléfono
        ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Si necesitas enviar cookies o headers de auth
  });

  app.useGlobalPipes(new ValidationPipe());

  // Usar puerto dinámico para Railway o puerto 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`CORS: ${isProduction ? 'Allowing all origins (mobile apps)' : 'Restricted to local origins'}`);
  console.log(`Chat App Backend is running on: http://localhost:${port}`);
}
bootstrap();
