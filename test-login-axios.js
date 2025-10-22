import axios from 'axios';

async function testLogin() {
  try {
    console.log('🔍 Probando login con teléfono...');

    const response = await axios.post('http://localhost:3000/auth/login', {
      phone: '+5548996209954',
      password: 'test123'
    });

    console.log('✅ Login exitoso:', response.data);
    return response.data;

  } catch (error) {
    console.log('❌ Error de login:', error.response?.data || error.message);

    // También probar con email
    try {
      console.log('🔍 Probando login con email...');
      const response2 = await axios.post('http://localhost:3000/auth/login', {
        email: 'test@ejemplo.com',
        password: 'test123'
      });

      console.log('✅ Login con email exitoso:', response2.data);
      return response2.data;

    } catch (error2) {
      console.log('❌ Error de login con email:', error2.response?.data || error2.message);
    }
  }
}

testLogin();
