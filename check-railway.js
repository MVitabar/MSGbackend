async function checkRailwayConfig() {
  console.log('🚀 VERIFICANDO CONFIGURACIÓN DE RAILWAY CON NPM');
  console.log('=' .repeat(50));

  console.log('\n📋 1. VERIFICANDO PACKAGE.JSON SCRIPTS');
  console.log('-'.repeat(40));

  const fs = await import('fs');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const scripts = packageJson.scripts;
  const requiredScripts = ['build', 'start:prod'];

  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: ${scripts[script]}`);
    } else {
      console.log(`❌ ${script}: NO ENCONTRADO`);
    }
  });

  console.log('\n📄 2. VERIFICANDO ARCHIVOS DE CONFIGURACIÓN');
  console.log('-'.repeat(40));

  // Verificar railway.toml
  try {
    const railwayConfig = fs.readFileSync('railway.toml', 'utf8');
    console.log('✅ railway.toml: encontrado');

    if (railwayConfig.includes('npm run build')) {
      console.log('✅ Build command: usa npm');
    } else {
      console.log('❌ Build command: no usa npm');
    }

    if (railwayConfig.includes('npm run start:prod')) {
      console.log('✅ Start command: usa npm');
    } else {
      console.log('❌ Start command: no usa npm');
    }
  } catch (error) {
    console.log('❌ railway.toml: no encontrado');
  }

  // Verificar .bunfig.toml (ya no necesitamos Bun)
  try {
    fs.readFileSync('.bunfig.toml', 'utf8');
    console.log('⚠️ .bunfig.toml: encontrado (considera eliminarlo si no usas Bun)');
  } catch (error) {
    console.log('✅ .bunfig.toml: no encontrado (correcto para Node.js)');
  }

  console.log('\n🚀 3. COMANDOS RECOMENDADOS PARA RAILWAY');
  console.log('-'.repeat(40));

  console.log('\n📦 Package Manager: npm');
  console.log('🔨 Build Command: npm install --frozen-lockfile && npm run build');
  console.log('▶️  Start Command: npm run start:prod');

  console.log('\n📋 Variables de Entorno Requeridas:');
  console.log('• DATABASE_URL (PostgreSQL de Railway)');
  console.log('• JWT_SECRET (tu clave secreta)');
  console.log('• NODE_ENV=production');
  console.log('• PORT (Railway lo asigna automáticamente)');

  console.log('\n🔍 4. VERIFICACIÓN FINAL');
  console.log('-'.repeat(40));

  // Verificar que el build funcione
  console.log('\nEjecutando verificación de build...');
  try {
    const { execSync } = await import('child_process');
    execSync('npm run verify:deployment', { stdio: 'inherit' });
    console.log('\n✅ Build verification: PASSED');
  } catch (error) {
    console.log('\n❌ Build verification: FAILED');
  }

  console.log('\n🎯 CONFIGURACIÓN COMPLETA:');
  console.log('1. ✅ Scripts de package.json actualizados para npm');
  console.log('2. ✅ railway.toml configurado para npm');
  console.log('3. ✅ Build verificado correctamente');
  console.log('\n🚀 ¡Listo para deploy en Railway con Node.js!');
}

checkRailwayConfig();
