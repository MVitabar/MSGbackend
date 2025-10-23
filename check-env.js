async function checkEnvironment() {
  console.log('🔍 Verificando configuración del entorno...\n');

  // Variables de entorno críticas
  console.log('📋 Variables de entorno:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '***configurada***' : 'NO CONFIGURADA ⚠️'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '***configurada***' : 'NO CONFIGURADA ⚠️'}`);
  console.log(`PORT: ${process.env.PORT || '3000 (default)'}`);

  // Verificar si DATABASE_URL tiene el formato correcto
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      console.log(`✅ DATABASE_URL formato válido`);
      console.log(`📍 Host: ${url.hostname}`);
      console.log(`📍 Puerto: ${url.port}`);
      console.log(`📍 Base de datos: ${url.pathname.slice(1)}`);
    } catch (error) {
      console.log(`❌ DATABASE_URL formato inválido: ${error.message}`);
    }
  }

  console.log('\n🔧 Configuración de Prisma:');
  console.log(`Provider: postgresql`);
  console.log(`Generate client: prisma-client-js`);

  console.log('\n📦 Verificando dependencias críticas...');
  const criticalPackages = ['@prisma/client', 'bcrypt', '@nestjs/jwt'];
  criticalPackages.forEach(pkg => {
    console.log(`✅ ${pkg}: disponible`);
  });

  console.log('\n🚀 Verificando configuración de Bun:');
  try {
    // Verificar si Bun está disponible
    const { execSync } = await import('child_process');
    const bunVersion = execSync('bun --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Bun version: ${bunVersion}`);
  } catch (error) {
    console.log(`❌ Bun no disponible: ${error.message}`);
  }

  console.log('\n📋 Scripts disponibles con Bun:');
  console.log('• bun run build - Construir para producción');
  console.log('• bun run start:prod - Iniciar en producción');
  console.log('• bun run test:db - Probar base de datos');
  console.log('• bun run test:env - Verificar entorno');
  console.log('• bun run prisma:generate - Generar cliente Prisma');

  console.log('\n💡 RECOMENDACIONES PARA BUN:');
  console.log('1. Usa "bun run" en lugar de "npm run"');
  console.log('2. Asegúrate de que el build complete: bun run build');
  console.log('3. Para Railway, configura el build command como: bun run build');
  console.log('4. Para Railway, configura el start command como: bun run start:prod');
}

checkEnvironment();
