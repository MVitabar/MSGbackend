#!/bin/bash
echo "🔄 Regenerando cliente de Prisma..."
npx prisma generate

echo "📊 Aplicando cambios a la base de datos..."
npx prisma db push

echo "✅ ¡Listo! El cliente de Prisma se ha actualizado."
