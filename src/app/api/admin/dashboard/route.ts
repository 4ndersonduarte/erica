import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { apiSuccess, apiError, apiUnauthorized } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();

    const [total, forSale, forRent, sold, rented] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { purpose: 'VENDA', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { purpose: 'ALUGUEL', status: 'AVAILABLE' } }),
      prisma.property.count({ where: { status: 'SOLD' } }),
      prisma.property.count({ where: { status: 'RENTED' } }),
    ]);

    return apiSuccess({
      total,
      forSale,
      forRent,
      sold,
      rented,
    });
  } catch (e) {
    if ((e as Error).message === 'Unauthorized') return apiUnauthorized();
    console.error(e);
    return apiError('Erro ao carregar dashboard', 500);
  }
}
