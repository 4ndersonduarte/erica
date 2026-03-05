import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@erica.com' },
    update: {},
    create: {
      email: 'admin@erica.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  });
  console.log('Seed: admin criado (admin@erica.com / admin123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
