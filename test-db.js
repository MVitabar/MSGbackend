import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection() {
  console.log('🔍 Probando conexión con la base de datos...\n');

  const prisma = new PrismaClient();

  try {
    console.log('📋 Información de la conexión:');
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '***configurada***' : 'NO CONFIGURADA ⚠️'}`);

    // Probar conexión
    console.log('\n🔌 Intentando conectar...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');

    // Verificar tablas
    console.log('\n📊 Verificando estructura de la base de datos...');
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;

    console.log('✅ Tablas encontradas:', (tables).length);

    // Verificar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios en la base de datos: ${userCount}`);

    if (userCount === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
      console.log('💡 Considera crear un usuario de prueba para testing');
    } else {
      console.log('✅ Base de datos tiene datos');
    }

    // Probar consulta específica
    console.log('\n🔍 Probando consulta de usuarios...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        username: true,
        createdAt: true
      }
    });

    console.log(`✅ Usuarios recuperados: ${users.length}`);
    if (users.length > 0) {
      console.log('📋 Lista de usuarios:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.email || user.phone})`);
      });
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);

    if (error.code === 'P1001') {
      console.log('🔍 Posible causa: DATABASE_URL mal configurada');
      console.log('💡 Verifica que la DATABASE_URL en Railway esté correcta');
    } else if (error.code === 'P2002') {
      console.log('🔍 Error de constraint: datos duplicados');
    } else {
      console.log('🔍 Error code:', error.code);
      console.log('🔍 Stack trace:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

testDatabaseConnection();
