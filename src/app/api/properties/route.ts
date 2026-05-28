import { NextRequest } from 'next/server';
import { listProperties } from '@/lib/supabase-data';
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

    const result = await listProperties({
      status: 'AVAILABLE',
      purpose,
      city,
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
    return apiSuccess(result);
  } catch (e) {
    console.error(e);
    return apiError('Erro ao listar imóveis', 500);
  }
}
