import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function testLogin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get('AuthService');

  try {
    console.log('🔍 Probando login con teléfono...');

    // Probar login con teléfono
    const result = await authService.login({
      phone: '+5548996209954',
      password: 'test123'
    });

    console.log('✅ Login exitoso:', result);
  } catch (error) {
    console.log('❌ Error de login:', error.message);

    // Probar con la contraseña correcta si existe
    try {
      const result = await authService.login({
        phone: '+5548996209954',
        password: 'test123'
      });
      console.log('✅ Login exitoso:', result);
    } catch (error2) {
      console.log('❌ Error con contraseña alternativa:', error2.message);
    }
  }

  await app.close();
}

testLogin();
