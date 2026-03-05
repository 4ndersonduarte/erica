import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  type: z.enum(['CASA', 'APARTAMENTO', 'TERRENO', 'COMERCIAL']),
  purpose: z.enum(['VENDA', 'ALUGUEL']),
  value: z.number().positive('Valor deve ser positivo'),
  city: z.string().min(2, 'Cidade obrigatória'),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  address: z.string().min(5, 'Endereço obrigatório'),
  rooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  parking: z.number().int().min(0),
  area: z.number().positive('Metragem obrigatória'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  status: z.enum(['AVAILABLE', 'SOLD', 'RENTED', 'RESERVED']).default('AVAILABLE'),
  featured: z.boolean().default(false),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  imageUrls: z.array(z.string().min(1, 'URL da imagem inválida')).default([]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
