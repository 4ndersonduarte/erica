import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const exemplosImoveis = [
  { code: 'IM-SEED-001', slug: 'terreno-exemplo-001', title: 'Terreno para construção', type: 'TERRENO', topic: 'TERRENOS', purpose: 'VENDA', value: 180000, city: 'Cidade Exemplo', neighborhood: 'Bairro', address: 'Rua Exemplo, 100', rooms: 0, bathrooms: 0, parking: 0, area: 500, description: 'Terreno plano, documentação em dia. Ótimo para construção. Água e luz na porta.' },
  { code: 'IM-SEED-002', slug: 'casa-exemplo-002', title: 'Casa com área de lazer', type: 'CASA', topic: 'CASAS', purpose: 'VENDA', value: 450000, city: 'Cidade Exemplo', neighborhood: 'Bairro', address: 'Rua Exemplo, 200', rooms: 3, bathrooms: 2, parking: 2, area: 200, description: 'Casa aconchegante com churrasqueira. Edite todas as informações no painel admin.' },
  { code: 'IM-SEED-003', slug: 'chacara-exemplo-003', title: 'Chácara com área verde', type: 'CASA', topic: 'CHACARAS', purpose: 'VENDA', value: 580000, city: 'Cidade Exemplo', neighborhood: 'Zona Rural', address: 'Estrada Exemplo, km 5', rooms: 3, bathrooms: 2, parking: 2, area: 350, description: 'Chácara com espaço para lazer. Pode editar no painel admin.' },
  { code: 'IM-SEED-004', slug: 'fazenda-exemplo-004', title: 'Fazenda produtiva', type: 'CASA', topic: 'FAZENDAS', purpose: 'VENDA', value: 1200000, city: 'Interior', neighborhood: 'Zona Rural', address: 'Fazenda Exemplo, s/n', rooms: 4, bathrooms: 3, parking: 4, area: 800, description: 'Área total 50 ha. Casa sede, currais. Edite os dados no menu administrativo.' },
];

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

  const count = await prisma.property.count();
  if (count === 0) {
    for (const p of exemplosImoveis) {
      await prisma.property.create({
        data: {
          ...p,
          status: 'AVAILABLE',
          featured: true,
          images: {
            create: [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', order: 0 }],
          },
        },
      });
    }
    console.log('Seed: 4 imóveis de exemplo criados (Terrenos, Casas, Chácaras, Fazendas). Edite-os no painel admin.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
