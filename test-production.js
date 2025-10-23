import axios from 'axios';

async function testProductionLike() {
  console.log('🚀 Simulando entorno de producción...\n');

  // Simular variables de entorno de Railway
  process.env.NODE_ENV = 'production';
  process.env.PORT = '3000';
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production-123456789';

  // Usar la DATABASE_URL real si existe
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL no configurada');
    console.log('💡 Configura DATABASE_URL para probar con la base de datos real');
    return;
  }

  try {
    console.log('🔍 Probando endpoint de health...');
    const healthResponse = await axios.get('http://localhost:3000/auth/health');
    console.log('✅ Health check:', healthResponse.data);

    console.log('\n🔍 Probando login con teléfono...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      phone: '+5548996209954',
      password: 'test123'
    });

    console.log('✅ Login exitoso:', loginResponse.data);

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    console.log('🔍 Status:', error.response?.status);

    if (error.response?.status === 502) {
      console.log('\n💡 Error 502 detectado - posibles causas:');
      console.log('  • Problema de conexión a la base de datos');
      console.log('  • Error no manejado en el código');
      console.log('  • Problema con bcrypt u otro paquete nativo');
      console.log('  • Error en la configuración de Railway');
    }
  }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
  testProductionLike();
}

export { testProductionLike };
