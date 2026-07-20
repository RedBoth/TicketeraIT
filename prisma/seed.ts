import { PrismaClient } from '@prisma/client'
import prismaConfig from '../prisma.config.ts'

const prisma = new PrismaClient(prismaConfig)

async function main() {
  // Limpiar datos previos si existen
  await prisma.ticket.deleteMany({})
  await prisma.equipment.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.tenant.deleteMany({})

  // 1. Crear Empresa Globex (Azul/Celeste)
  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex Corporation',
      slug: 'globex',
      primaryColor: '#0284c7', // sky-600
      accentColor: '#38bdf8',  // sky-400
    },
  })

  // 2. Crear Empresa Acme (Rojo/Naranja)
  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme Industries',
      slug: 'acme',
      primaryColor: '#dc2626', // red-600
      accentColor: '#f97316',  // orange-500
    },
  })

  // 3. Crear un usuario para Globex
  const userGlobex = await prisma.user.create({
    data: {
      name: 'Juan Técnico',
      email: 'juan@globex.com',
      password: 'password123', // En producción iría encriptada
      role: 'TECNICO',
      tenantId: globex.id,
    },
  })

  // 4. Crear un ticket de prueba para Globex
  await prisma.ticket.create({
    data: {
      title: 'Fallo en servidor principal',
      description: 'El servidor de storage dejó de responder a los pings.',
      status: 'OPEN',
      priority: 'HIGH',
      tenantId: globex.id,
      userId: userGlobex.id,
    },
  })

  console.log('🌱 ¡Base de datos poblada con éxito!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })