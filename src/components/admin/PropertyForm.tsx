'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TOPIC_LABELS,
} from '@/lib/utils';

const types = Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => ({ value, label }));
const purposes = Object.entries(PROPERTY_PURPOSE_LABELS).map(([value, label]) => ({ value, label }));
const statuses = Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => ({ value, label }));
const topics = Object.entries(PROPERTY_TOPIC_LABELS).map(([value, label]) => ({ value, label }));

type PropertyWithImages = {
  id?: string;
  code: string;
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
  lat?: number | null;
  lng?: number | null;
  imageUrls?: string[];
};

type Props = {
  initial?: PropertyWithImages;
};

export default function PropertyForm({ initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.imageUrls || []);
  const [form, setForm] = useState({
    title: initial?.title || '',
    type: initial?.type || 'CASA',
    topic: initial?.topic || 'TERRENOS',
    purpose: initial?.purpose || 'VENDA',
    value: initial?.value ?? 0,
    city: initial?.city || '',
    neighborhood: initial?.neighborhood || '',
    address: initial?.address || '',
    rooms: initial?.rooms ?? 0,
    bathrooms: initial?.bathrooms ?? 0,
    parking: initial?.parking ?? 0,
    area: initial?.area ?? 0,
    description: initial?.description || '',
    status: initial?.status || 'AVAILABLE',
    featured: initial?.featured ?? false,
    lat: initial?.lat ?? '',
    lng: initial?.lng ?? '',
  });

  const update = (key: string, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload');
        setImageUrls((prev) => [...prev, data.url]);
      }
      toast.success('Imagem(ns) enviada(s)');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, []);

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        rooms: Number(form.rooms),
        bathrooms: Number(form.bathrooms),
        parking: Number(form.parking),
        area: Number(form.area),
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        imageUrls,
      };
      const url = initial?.id
        ? `/api/admin/properties/${initial.id}`
        : '/api/admin/properties';
      const method = initial?.id ? 'PUT' : 'POST';
      if (initial?.id) {
        (payload as Record<string, unknown>).code = initial.code;
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar');
      toast.success(initial?.id ? 'Imóvel atualizado!' : 'Imóvel cadastrado!');
      router.push('/admin/imoveis');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-dark-200 px-4 py-3 text-base min-h-[48px] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none';
  const labelClass = 'block text-sm font-medium text-dark-700';

  return (
    <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white border border-dark-200 p-5 sm:p-6 space-y-5 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900">Informações básicas</h2>
        {initial?.code && <p className="text-sm text-dark-500">Código: {initial.code}</p>}
        <div>
          <label className={labelClass}>Título *</label>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Tipo *</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value)} className={inputClass}>
              {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tópico *</label>
            <select value={form.topic} onChange={(e) => update('topic', e.target.value)} className={inputClass}>
              {topics.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Finalidade *</label>
            <select value={form.purpose} onChange={(e) => update('purpose', e.target.value)} className={inputClass}>
              {purposes.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Valor (R$) *</label>
          <input type="number" step="0.01" min={0} value={form.value || ''} onChange={(e) => update('value', e.target.value)} required className={inputClass} inputMode="decimal" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className={inputClass}>
              {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 min-h-[48px]">
            <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="rounded border-dark-300 w-5 h-5" />
            <label htmlFor="featured" className="text-sm font-medium text-dark-700">Imóvel em destaque</label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-dark-200 p-5 sm:p-6 space-y-5 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900">Localização</h2>
        <div><label className={labelClass}>Cidade *</label><input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} required className={inputClass} /></div>
        <div><label className={labelClass}>Bairro *</label><input type="text" value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} required className={inputClass} /></div>
        <div><label className={labelClass}>Endereço *</label><input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} required className={inputClass} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Latitude (mapa)</label><input type="text" value={form.lat} onChange={(e) => update('lat', e.target.value)} placeholder="-23.5505" className={inputClass} inputMode="decimal" /></div>
          <div><label className={labelClass}>Longitude (mapa)</label><input type="text" value={form.lng} onChange={(e) => update('lng', e.target.value)} placeholder="-46.6333" className={inputClass} inputMode="decimal" /></div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-dark-200 p-5 sm:p-6 space-y-5 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900">Características</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><label className={labelClass}>Quartos</label><input type="number" min={0} value={form.rooms} onChange={(e) => update('rooms', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Banheiros</label><input type="number" min={0} value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Vagas</label><input type="number" min={0} value={form.parking} onChange={(e) => update('parking', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Área (m²) *</label><input type="number" step="0.01" min={0} value={form.area || ''} onChange={(e) => update('area', e.target.value)} required className={inputClass} inputMode="decimal" /></div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-dark-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900">Descrição *</h2>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} required rows={5} className="w-full rounded-xl border border-dark-200 px-4 py-3 text-base min-h-[120px] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none" />
      </div>

      <div className="rounded-2xl bg-white border border-dark-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-dark-900">Imagens</h2>
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-dark-200 overflow-hidden">
              <Image src={url} alt="" width={112} height={112} className="object-cover w-full h-full" />
              <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white shadow touch-manipulation" aria-label="Remover">
                <X size={16} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-dark-200 hover:border-primary-500 cursor-pointer text-dark-500 hover:text-primary-600 transition min-h-[96px]">
            <Upload size={28} />
            <span className="text-xs mt-1">{uploading ? 'Enviando...' : 'Adicionar'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pb-8">
        <Link href="/admin/imoveis" className="rounded-xl border-2 border-dark-200 px-6 py-3.5 font-medium text-dark-700 hover:bg-dark-50 transition text-center min-h-[48px] flex items-center justify-center">
          Cancelar
        </Link>
        <button type="submit" disabled={loading} className="rounded-xl bg-primary-500 text-white px-6 py-3.5 font-semibold hover:bg-primary-600 transition disabled:opacity-50 min-h-[48px] shadow-md">
          {loading ? 'Salvando...' : initial?.id ? 'Atualizar' : 'Cadastrar imóvel'}
        </button>
      </div>
    </form>
  );
}
