import { createClient } from '@/lib/supabase/server';

export type PropertyRecord = {
  id: string;
  code: string;
  slug: string;
  title: string;
  type: string;
  topic: string;
  purpose: string;
  value: number;
  city: string;
  neighborhood: string;
  address: string;
  rooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  description: string;
  status: string;
  featured: boolean;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  updatedAt: string;
  images: PropertyImageRecord[];
};

export type PropertyImageRecord = {
  id: string;
  propertyId: string;
  url: string;
  order: number;
};

export type HomeVideoRecord = {
  id: string;
  url: string;
  title: string | null;
  order: number;
  createdAt: string;
};

export type ListingSubmissionRecord = {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerNotes: string | null;
  title: string;
  type: string;
  topic: string;
  purpose: string;
  value: number;
  city: string;
  neighborhood: string;
  address: string;
  rooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes: string | null;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
};

type PropertyFilters = {
  status?: string;
  purpose?: string | null;
  topic?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  minValue?: string | null;
  maxValue?: string | null;
  rooms?: string | null;
  bathrooms?: string | null;
  parking?: string | null;
  featured?: boolean;
};

type ListOptions = PropertyFilters & {
  sort?: string | null;
  page?: number;
  pageSize?: number;
  take?: number;
};

function applyPropertyFilters(query: any, filters: PropertyFilters) {
  let next = query;
  if (filters.status) next = next.eq('status', filters.status);
  if (filters.purpose) next = next.eq('purpose', filters.purpose);
  if (filters.topic) next = next.eq('topic', filters.topic);
  if (filters.city) next = next.ilike('city', `%${filters.city}%`);
  if (filters.neighborhood) next = next.ilike('neighborhood', `%${filters.neighborhood}%`);
  if (filters.minValue != null && filters.minValue !== '') next = next.gte('value', Number(filters.minValue));
  if (filters.maxValue != null && filters.maxValue !== '') next = next.lte('value', Number(filters.maxValue));
  if (filters.rooms != null && filters.rooms !== '') next = next.gte('rooms', Number(filters.rooms));
  if (filters.bathrooms != null && filters.bathrooms !== '') next = next.gte('bathrooms', Number(filters.bathrooms));
  if (filters.parking != null && filters.parking !== '') next = next.gte('parking', Number(filters.parking));
  if (filters.featured) next = next.eq('featured', true);
  return next;
}

function sortImages(images: PropertyImageRecord[]) {
  return [...images].sort((a, b) => a.order - b.order);
}

async function attachImages(properties: Omit<PropertyRecord, 'images'>[]): Promise<PropertyRecord[]> {
  if (!properties.length) return [];

  const supabase = await createClient();
  const ids = properties.map((property) => property.id);
  const { data, error } = await supabase
    .from('PropertyImage')
    .select('*')
    .in('propertyId', ids)
    .order('order', { ascending: true });

  if (error) throw error;

  const grouped = new Map<string, PropertyImageRecord[]>();
  for (const image of (data || []) as PropertyImageRecord[]) {
    grouped.set(image.propertyId, [...(grouped.get(image.propertyId) || []), image]);
  }

  return properties.map((property) => ({
    ...property,
    images: sortImages(grouped.get(property.id) || []),
  }));
}

export async function listProperties(options: ListOptions = {}) {
  const supabase = await createClient();
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? options.take ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const sort = options.sort || 'recent';

  let query = supabase
    .from('Property')
    .select('*', { count: 'exact' });
  query = applyPropertyFilters(query, options);

  if (sort === 'price_asc') query = query.order('value', { ascending: true });
  else if (sort === 'price_desc') query = query.order('value', { ascending: false });
  else query = query.order('createdAt', { ascending: false });

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  const items = await attachImages((data || []) as Omit<PropertyRecord, 'images'>[]);
  return { items, total: count || 0, page, totalPages: Math.ceil((count || 0) / pageSize) };
}

export async function listAllAdminProperties() {
  const { items } = await listProperties({ page: 1, pageSize: 1000, sort: 'recent' });
  return items;
}

export async function getPropertyById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Property').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return (await attachImages([data as Omit<PropertyRecord, 'images'>]))[0] || null;
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('Property').select('*').eq('slug', slug).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return (await attachImages([data as Omit<PropertyRecord, 'images'>]))[0] || null;
}

export async function createProperty(data: Omit<PropertyRecord, 'id' | 'createdAt' | 'updatedAt' | 'images'>, imageUrls: string[]) {
  const supabase = await createClient();
  const { data: property, error } = await supabase
    .from('Property')
    .insert(data)
    .select('*')
    .single();
  if (error) throw error;

  if (imageUrls.length) {
    const { error: imageError } = await supabase.from('PropertyImage').insert(
      imageUrls.map((url, order) => ({
        propertyId: property.id,
        url,
        order,
      }))
    );
    if (imageError) throw imageError;
  }

  return getPropertyById(property.id);
}

export async function updateProperty(id: string, data: Partial<Omit<PropertyRecord, 'id' | 'createdAt' | 'updatedAt' | 'images'>>, imageUrls: string[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('Property')
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;

  const { error: deleteError } = await supabase.from('PropertyImage').delete().eq('propertyId', id);
  if (deleteError) throw deleteError;

  if (imageUrls.length) {
    const { error: imageError } = await supabase.from('PropertyImage').insert(
      imageUrls.map((url, order) => ({
        propertyId: id,
        url,
        order,
      }))
    );
    if (imageError) throw imageError;
  }

  return getPropertyById(id);
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('Property').delete().eq('id', id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const count = async (filters: PropertyFilters = {}) => {
    let query = supabase.from('Property').select('id', { count: 'exact', head: true });
    query = applyPropertyFilters(query, filters);
    const { error, count: total } = await query;
    if (error) throw error;
    return total || 0;
  };

  const [total, forSale, forRent, sold, rented] = await Promise.all([
    count(),
    count({ purpose: 'VENDA', status: 'AVAILABLE' }),
    count({ purpose: 'ALUGUEL', status: 'AVAILABLE' }),
    count({ status: 'SOLD' }),
    count({ status: 'RENTED' }),
  ]);

  const { count: pendingSubmissions, error: pendingError } = await supabase
    .from('ListingSubmission')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'PENDING');
  if (pendingError && pendingError.code !== '42P01' && pendingError.code !== 'PGRST205') {
    throw pendingError;
  }

  return { total, forSale, forRent, sold, rented, pendingSubmissions: pendingSubmissions || 0 };
}

export async function listHomeVideos() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('HomeVideo')
    .select('*')
    .order('order', { ascending: true })
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data || []) as HomeVideoRecord[];
}

export async function createHomeVideo(data: Pick<HomeVideoRecord, 'url' | 'title' | 'order'>) {
  const supabase = await createClient();
  const { data: video, error } = await supabase
    .from('HomeVideo')
    .insert(data)
    .select('*')
    .single();
  if (error) throw error;
  return video as HomeVideoRecord;
}

export async function deleteHomeVideo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('HomeVideo').delete().eq('id', id);
  if (error) throw error;
}

export async function createListingSubmission(
  data: Omit<ListingSubmissionRecord, 'id' | 'status' | 'adminNotes' | 'propertyId' | 'createdAt' | 'updatedAt'>
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('ListingSubmission')
    .insert({ ...data, status: 'PENDING' });
  if (error) throw error;
  return { status: 'PENDING' as const };
}

export async function listListingSubmissions(status?: ListingSubmissionRecord['status']) {
  const supabase = await createClient();
  let query = supabase
    .from('ListingSubmission')
    .select('*')
    .order('createdAt', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) {
    if (error.code === '42P01' || error.code === 'PGRST205') return [];
    throw error;
  }
  return (data || []) as ListingSubmissionRecord[];
}

export async function getListingSubmissionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ListingSubmission')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST205') return null;
    throw error;
  }
  return data as ListingSubmissionRecord;
}

export async function updateListingSubmissionStatus(
  id: string,
  status: ListingSubmissionRecord['status'],
  options: { adminNotes?: string | null; propertyId?: string | null } = {}
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ListingSubmission')
    .update({
      status,
      adminNotes: options.adminNotes ?? null,
      propertyId: options.propertyId ?? null,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as ListingSubmissionRecord;
}
