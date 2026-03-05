import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get('purpose');
    const city = searchParams.get('city') || undefined;
    const neighborhood = searchParams.get('neighborhood') || undefined;
    const minValue = searchParams.get('minValue');
    const maxValue = searchParams.get('maxValue');
    const rooms = searchParams.get('rooms');
    const bathrooms = searchParams.get('bathrooms');
    const parking = searchParams.get('parking');
    const sort = searchParams.get('sort') || 'recent';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const featured = searchParams.get('featured') === 'true';

    const where: Record<string, unknown> = {
      status: 'AVAILABLE',
    };
    if (purpose) where.purpose = purpose;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (neighborhood) where.neighborhood = { contains: neighborhood, mode: 'insensitive' };
    const valueFilter: { gte?: number; lte?: number } = {};
    if (minValue != null && minValue !== '') valueFilter.gte = Number(minValue);
    if (maxValue != null && maxValue !== '') valueFilter.lte = Number(maxValue);
    if (Object.keys(valueFilter).length) where.value = valueFilter;
    if (rooms != null && rooms !== '') where.rooms = { gte: parseInt(rooms, 10) };
    if (bathrooms != null && bathrooms !== '') where.bathrooms = { gte: parseInt(bathrooms, 10) };
    if (parking != null && parking !== '') where.parking = { gte: parseInt(parking, 10) };
    if (featured) where.featured = true;

    const orderBy: Record<string, string> =
      sort === 'price_asc'
        ? { value: 'asc' }
        : sort === 'price_desc'
          ? { value: 'desc' }
          : { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return apiSuccess({
      items,
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (e) {
    console.error(e);
    return apiError('Erro ao listar imóveis', 500);
  }
}
