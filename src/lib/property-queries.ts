import { prisma } from '@/lib/prisma';

const PAGE_SIZE = 12;

type Filters = {
  tipo?: string | null; // TERRENOS | CASAS | FAZENDAS | CHACARAS
  neighborhood?: string | null;
  minValue?: string | null;
  maxValue?: string | null;
  rooms?: string | null;
  bathrooms?: string | null;
  parking?: string | null;
  sort?: string | null;
  page?: string | null;
  featured?: boolean;
};

export async function getPublicPropertiesList(filters: Filters) {
  let topic = filters.tipo || undefined;
  if (topic === 'CASAS_XACARAS') topic = 'CHACARAS'; // legado
  const neighborhood = filters.neighborhood || undefined;
  const minValue = filters.minValue;
  const maxValue = filters.maxValue;
  const rooms = filters.rooms;
  const bathrooms = filters.bathrooms;
  const parking = filters.parking;
  const sort = filters.sort || 'recent';
  const page = Math.max(1, parseInt(filters.page || '1', 10));
  const featured = filters.featured ?? false;

  const where: Record<string, unknown> = {
    status: 'AVAILABLE',
  };
  if (topic) where.topic = topic;
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
    sort === 'price_asc' ? { value: 'asc' } : sort === 'price_desc' ? { value: 'desc' } : { createdAt: 'desc' };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { images: { orderBy: { order: 'asc' }, take: 1 } },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}
