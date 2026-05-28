# Como Atualizar as Chaves do Supabase no .env

## Onde encontrar as chaves

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto: `shxyunbdhtxhffpyqmyu`
3. Vá para **Settings** → **API Keys**

## Chaves necessárias

### 1. Project URL
```
NEXT_PUBLIC_SUPABASE_URL="https://shxyunbdhtxhffpyqmyu.supabase.co"
```

### 2. Anon Key (Public)
- Encontrada em **Project API keys** → **anon public**
- Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Substitua a linha `SUPABASE_ANON_KEY` no .env

### 3. Service Role Key (Secret)
- Encontrada em **Project API keys** → **service_role** (secret)
- Formato: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **NUNCA** exponha esta chave no frontend
- Substitua a linha `SUPABASE_SERVICE_ROLE_KEY` no .env

## Exemplo de .env atualizado

```env
DATABASE_URL="postgresql://postgres.shxyunbdhtxhffpyqmyu:Timaonaveia123%40@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
JWT_SECRET="dev-secret-change-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP="5511999999999"

# Supabase API Keys - substitua com as chaves REAIS do seu projeto
NEXT_PUBLIC_SUPABASE_URL="https://shxyunbdhtxhffpyqmyu.supabase.co"
SUPABASE_ANON_KEY="COLE_AQUI_A_CHAVE_ANON_REAL"
SUPABASE_SERVICE_ROLE_KEY="COLE_AQUI_A_CHAVE_SERVICE_ROLE_REAL"
```

## ⚠️ Importante

- **Anon Key**: Pode ser exposta no frontend (NEXT_PUBLIC_)
- **Service Role**: NUNCA exponha no frontend, use apenas no backend
- **JWT Secret**: Use uma chave segura em produção
- **Database URL**: Já está configurada para o novo projeto

## Após atualizar

1. Salve o arquivo .env
2. Reinicie o servidor: `npm run dev`
3. Teste o cadastro de imóveis para verificar a conexão
