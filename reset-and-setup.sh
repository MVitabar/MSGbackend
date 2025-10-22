#!/bin/bash
echo "🧹 Limpiando usuarios existentes..."
npx prisma db push --force-reset

echo "🔄 Regenerando cliente de Prisma..."
npx prisma generate

echo "📝 Creando usuario de prueba..."
echo "Usuario: martin@mail.com / +5548996209954"
echo "Contraseña: test123"

echo "✅ ¡Listo! Ahora puedes hacer login con:"
echo "Email: martin@mail.com"
echo "Teléfono: +5548996209954"
echo "Contraseña: test123"
