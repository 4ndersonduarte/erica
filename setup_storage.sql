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
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON storage.objects;
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'property-images' );

-- Permitir atualização para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'property-images' )
WITH CHECK ( bucket_id = 'property-images' );

-- Permitir deleção para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'property-images' );

-- Políticas de acesso para o bucket de uploads gerais
-- Permitir leitura pública
DROP POLICY IF EXISTS "Public uploads are viewable by everyone" ON storage.objects;
CREATE POLICY "Public uploads are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Permitir upload para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'uploads' );

-- Permitir atualização para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'uploads' )
WITH CHECK ( bucket_id = 'uploads' );

-- Permitir deleção para usuários autenticados
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'uploads' );
