import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

  // Habilitar CORS de forma segura para apps móviles y web.
  // Usamos un origin dinámico para poder devolver el origin real cuando vienen cookies/credentials.
  app.enableCors({
    origin: (origin, callback) => {
      // origin puede ser undefined (p. ej. peticiones desde apps nativas o curl)
      if (!origin) {
        // permitir peticiones sin origin (apps móviles nativas, curl, etc.)
        return callback(null, true);
      }

      // En producción: permitir cualquier origen (si quieres restringir, reemplaza esto por un whitelist)
      if (isProduction) {
        return callback(null, true);
      }

      // En desarrollo puedes limitar a localhost y a la URL de tu frontend
      const whitelist = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        // agrega aquí otras URLs de desarrollo que uses
      ];
      if (whitelist.includes(origin)) {
        return callback(null, true);
      }
      // rechazar por defecto
      return callback(new Error('Origin no permitido por CORS'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept,Origin,X-Requested-With',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = Number(process.env.PORT) || 3000;
  // IMPORTANTE: bind a 0.0.0.0 para que Railway exponga la app
  await app.listen(port, '0.0.0.0');
  console.log(`Chat App Backend is running on port ${port}`);
}
bootstrap();
