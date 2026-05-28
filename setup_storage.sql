-- Configurar Storage Buckets para o sistema Erica Imóveis
-- Execute este SQL diretamente no Supabase SQL Editor

-- Criar bucket para imagens dos imóveis
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images', 
  'property-images', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Criar bucket para uploads gerais (logo, etc)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads', 
  'uploads', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para o bucket de imagens dos imóveis
-- Permitir leitura pública
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' AND 
  auth.role() = 'authenticated'
);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'property-images' AND 
  auth.role() = 'authenticated'
);

-- Permitir deleção para usuários autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' AND 
  auth.role() = 'authenticated'
);

-- Políticas de acesso para o bucket de uploads gerais
-- Permitir leitura pública
CREATE POLICY "Public uploads are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Permitir atualização para usuários autenticados
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);

-- Permitir deleção para usuários autenticados
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'uploads' AND 
  auth.role() = 'authenticated'
);
