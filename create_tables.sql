-- Criar tabelas para o sistema Erica Imóveis
-- Execute este SQL diretamente no Supabase SQL Editor

-- Tabela de Admins
CREATE TABLE IF NOT EXISTS "Admin" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Imóveis
CREATE TABLE IF NOT EXISTS "Property" (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  topic TEXT DEFAULT 'TERRENOS',
  purpose TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  rooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  parking INTEGER NOT NULL,
  area DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  featured BOOLEAN DEFAULT false,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Imagens dos Imóveis
CREATE TABLE IF NOT EXISTS "PropertyImage" (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  FOREIGN KEY (property_id) REFERENCES "Property" (id) ON DELETE CASCADE
);

-- Tabela de Vídeos da Home
CREATE TABLE IF NOT EXISTS "HomeVideo" (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_property_status ON "Property" (status);
CREATE INDEX IF NOT EXISTS idx_property_featured ON "Property" (featured);
CREATE INDEX IF NOT EXISTS idx_property_topic ON "Property" (topic);
CREATE INDEX IF NOT EXISTS idx_property_city ON "Property" (city);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON "PropertyImage" (property_id);

-- Inserir admin padrão (senha: admin123)
INSERT INTO "Admin" (id, email, password, name) 
VALUES ('admin-default', 'admin@erica.com', '$2b$10$rQO8dH8uH8u8u8u8u8u8uO8u8u8u8u8u8u8u8u8u', 'Admin Erica')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS (Row Level Security) para segurança
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HomeVideo" ENABLE ROW LEVEL SECURITY;
