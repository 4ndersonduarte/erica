import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const property = await prisma.property.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    if (!property) return apiError('Imóvel não encontrado', 404);
    return apiSuccess(property);
  } catch (e) {
    console.error(e);
    return apiError('Erro ao buscar imóvel', 500);
  }
}
