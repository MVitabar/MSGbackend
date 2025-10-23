import { execSync } from 'child_process';

async function runFullDiagnostic() {
  console.log('🚀 DIAGNÓSTICO COMPLETO PARA RAILWAY DEPLOYMENT (NPM)');
  console.log('=' .repeat(55));

  // 1. Verificar variables de entorno
  console.log('\n📋 1. VERIFICANDO VARIABLES DE ENTORNO');
  console.log('-'.repeat(45));

  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  let envOk = true;

  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: configurada`);
    } else {
      console.log(`❌ ${varName}: NO CONFIGURADA`);
      envOk = false;
    }
  });

  console.log(`\n📊 Estado de variables de entorno: ${envOk ? '✅ OK' : '❌ FALTAN VARIABLES'}`);

  // 2. Verificar npm
  console.log('\n📦 2. VERIFICANDO NPM');
  console.log('-'.repeat(45));

  try {
    console.log('Verificando versión de Node.js...');
    const { execSync } = await import('child_process');
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js version: ${nodeVersion}`);

    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm version: ${npmVersion}`);
  } catch (error) {
    console.log(`❌ Error con Node.js/npm: ${error.message}`);
    console.log('💡 Asegúrate de que Node.js y npm estén instalados');
    return;
  }

  // 3. Verificar build
  console.log('\n🔨 3. VERIFICANDO BUILD');
  console.log('-'.repeat(45));

  try {
    console.log('Ejecutando npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completado exitosamente');
  } catch (error) {
    console.log('❌ Error en build:', error.message);
    console.log('💡 Esto causaría problemas en Railway');
    return;
  }

  // 4. Verificar Prisma
  console.log('\n🗄️ 4. VERIFICANDO PRISMA');
  console.log('-'.repeat(45));

  try {
    console.log('Generando cliente Prisma...');
    execSync('npm run prisma:generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma generado');
  } catch (error) {
    console.log('❌ Error generando cliente Prisma:', error.message);
  }

  // 5. Tests individuales
  console.log('\n🧪 5. EJECUTANDO TESTS INDIVIDUALES');
  console.log('-'.repeat(45));

  console.log('\n🔍 Ejecutando test:env...');
  try {
    execSync('npm run test:env', { stdio: 'inherit' });
  } catch (error) {
    console.log('💡 Ejecuta manualmente: npm run test:env');
  }

  console.log('\n🔍 Ejecutando test:db...');
  try {
    execSync('npm run test:db', { stdio: 'inherit' });
  } catch (error) {
    console.log('💡 Ejecuta manualmente: npm run test:db');
  }

  // 6. Resumen y recomendaciones
  console.log('\n📋 6. RESUMEN Y RECOMENDACIONES');
  console.log('-'.repeat(45));

  console.log('\n✅ LISTO PARA DEPLOYMENT CON NPM:');
  console.log('1. Asegúrate de que todas las variables de entorno estén en Railway');
  console.log('2. Verifica los logs de Railway después del deployment');
  console.log('3. Usa el endpoint /auth/health para verificar que la app funcione');
  console.log('4. Si hay errores 502, revisa los logs detalladamente');

  console.log('\n🚀 COMANDOS PARA RAILWAY:');
  console.log('• Package Manager: npm');
  console.log('• Build Command: npm install --frozen-lockfile && npm run build');
  console.log('• Start Command: npm run start:prod');

  console.log('\n🔧 SCRIPTS DE DIAGNÓSTICO:');
  console.log('• npm run test:env - Verificar variables de entorno');
  console.log('• npm run test:db - Probar conexión a base de datos');
  console.log('• npm run test:production - Simular entorno de producción');
  console.log('• npm run test:railway - Verificación completa de Railway');

  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Deploy a Railway con configuración de npm');
  console.log('2. Configurar variables de entorno en Railway dashboard');
  console.log('3. Verificar logs en Railway');
  console.log('4. Probar endpoints con herramientas como Postman o curl');

  console.log('\n💡 COMANDOS ÚTILES CON NPM:');
  console.log('• npm install - Instalar dependencias');
  console.log('• npm run start:dev - Desarrollo con watch');
  console.log('• npm run build - Build para producción');
  console.log('• npm run start:prod - Iniciar en producción');
}

runFullDiagnostic();
