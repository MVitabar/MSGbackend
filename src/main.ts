import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir requests desde el frontend Flutter
  app.enableCors({
    origin: [
      'http://localhost:3000',      // Para desarrollo web si lo usas
      'http://localhost:56276',     // Puerto típico de Flutter dev server
      'http://127.0.0.1:56276',    // Alternativa localhost
      /^https?:\/\/localhost:\d+$/, // Cualquier puerto localhost para desarrollo
      /^https?:\/\/127\.0\.0\.1:\d+$/ // Cualquier puerto 127.0.0.1 para desarrollo
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true, // Si necesitas enviar cookies o headers de auth
  });

  app.useGlobalPipes(new ValidationPipe());

  // Usar puerto dinámico para Railway o puerto 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Chat App Backend is running on: http://localhost:${port}`);
}
bootstrap();
