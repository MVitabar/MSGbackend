import axios from 'axios';

async function testHealth() {
  try {
    console.log('🔍 Probando endpoint de health...');
    const response = await axios.get('http://localhost:3000/auth/health');
    console.log('✅ Health check exitoso:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Error en health check:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('\n🔍 Probando login con teléfono...');

    const response = await axios.post('http://localhost:3000/auth/login', {
      phone: '+5548996209954',
      password: 'test123'
    });

    console.log('✅ Login exitoso:', response.data);
    return response.data;

  } catch (error) {
    console.log('❌ Error de login:', error.response?.data || error.message);
    console.log('🔍 Status code:', error.response?.status);
    console.log('🔍 Headers:', error.response?.headers);

    // También probar con email
    try {
      console.log('\n🔍 Probando login con email...');
      const response2 = await axios.post('http://localhost:3000/auth/login', {
        email: 'test@ejemplo.com',
        password: 'test123'
      });

      console.log('✅ Login con email exitoso:', response2.data);
      return response2.data;

    } catch (error2) {
      console.log('❌ Error de login con email:', error2.response?.data || error2.message);
      console.log('🔍 Status code:', error2.response?.status);
      console.log('🔍 Headers:', error2.response?.headers);

      // Probar endpoint simple
      try {
        console.log('\n🔍 Probando endpoint login-simple...');
        const response3 = await axios.post('http://localhost:3000/auth/login-simple', {
          phone: '+5548996209954',
          password: 'test123'
        });

        console.log('✅ Login-simple exitoso:', response3.data);
        return response3.data;

      } catch (error3) {
        console.log('❌ Error de login-simple:', error3.response?.data || error3.message);
        console.log('🔍 Status code:', error3.response?.status);
      }
    }
  }
}

async function runTests() {
  console.log('🚀 Iniciando tests de diagnóstico...\n');

  // Primero probar health
  const healthResult = await testHealth();

  if (healthResult) {
    console.log('\n✅ La aplicación está funcionando correctamente');
    console.log('🔍 Si el login falla, es problema de lógica, no de infraestructura');
  } else {
    console.log('\n❌ La aplicación tiene problemas básicos');
    console.log('🔍 Posibles causas: configuración, variables de entorno, build');
  }

  // Luego probar login
  await testLogin();
}

runTests();
