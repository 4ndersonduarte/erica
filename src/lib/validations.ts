import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional().or(z.literal('')),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  type: z.enum(['CASA', 'APARTAMENTO', 'TERRENO', 'COMERCIAL']),
  topic: z.enum(['TERRENOS', 'CASAS', 'FAZENDAS', 'CHACARAS']),
  purpose: z.enum(['VENDA', 'ALUGUEL']),
  value: z.number().min(0.01, 'Informe o valor do imóvel (R$)'),
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

export const listingSubmissionSchema = z.object({
  ownerName: z.string().min(2, 'Informe seu nome'),
  ownerEmail: z.string().email('Informe um e-mail valido'),
  ownerPhone: z.string().min(8, 'Informe um telefone para contato'),
  ownerNotes: z.string().max(1000, 'Mensagem muito longa').optional().nullable(),
  title: z.string().min(3, 'Titulo deve ter pelo menos 3 caracteres'),
  type: z.enum(['CASA', 'APARTAMENTO', 'TERRENO', 'COMERCIAL']),
  topic: z.enum(['TERRENOS', 'CASAS', 'FAZENDAS', 'CHACARAS']),
  purpose: z.enum(['VENDA', 'ALUGUEL']),
  value: z.number().min(0.01, 'Informe o valor do imovel (R$)'),
  city: z.string().min(2, 'Cidade obrigatoria'),
  neighborhood: z.string().min(2, 'Bairro obrigatorio'),
  address: z.string().min(5, 'Endereco obrigatorio'),
  rooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  parking: z.number().int().min(0),
  area: z.number().positive('Metragem obrigatoria'),
  description: z.string().min(10, 'Descricao deve ter pelo menos 10 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ListingSubmissionInput = z.infer<typeof listingSubmissionSchema>;
