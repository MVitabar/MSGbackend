import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir requests desde el frontend Flutter, desarrollo web y dispositivos móviles
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  // En tu main.ts o app.module.ts de NestJS
app.enableCors({
  origin: true, // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
});

  app.useGlobalPipes(new ValidationPipe());

  // Usar puerto dinámico para Railway o puerto 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`CORS: ${isProduction ? 'Allowing all origins (mobile apps)' : 'Restricted to local origins'}`);
  console.log(`Chat App Backend is running on: http://localhost:${port}`);
}
bootstrap();
