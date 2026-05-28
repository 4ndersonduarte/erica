import { listProperties } from '@/lib/supabase-data';

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

  return listProperties({
    status: 'AVAILABLE',
    topic,
    neighborhood,
    minValue,
    maxValue,
    rooms,
    bathrooms,
    parking,
    featured,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });
}
