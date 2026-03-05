# Próximos passos – Erica Imóveis

Siga esta ordem para colocar o sistema no ar.

---

## Passo 1: Banco de dados PostgreSQL

Você precisa de um PostgreSQL acessível.

**Opção A – Local (no seu PC)**  
- Instale: https://www.postgresql.org/download/windows/  
- Crie um banco: `erica_imobiliaria`  
- Anote: usuário, senha, host (geralmente `localhost`), porta (geralmente `5432`)

**Opção B – Supabase (grátis)**  
- Acesse https://supabase.com e crie um projeto  
- Em **Settings → Database** copie a **Connection string** (URI)  
- Use no `.env` como `DATABASE_URL` (modo “Transaction” ou “Session” está ok)

**Opção C – Outro provedor**  
- Neon, Railway, etc. – pegue a URL de conexão PostgreSQL e use como `DATABASE_URL`

---

## Passo 2: Ajustar o `.env`

Abra o arquivo `.env` na raiz do projeto e preencha:

```env
# Troque pela sua URL real do PostgreSQL
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/NOME_DO_BANCO?schema=public"

# Mantenha ou troque por uma chave forte (produção)
JWT_SECRET="dev-secret-change-in-production"

# URL do site (em produção troque pelo seu domínio)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Número do WhatsApp (só números, com DDI: 5511999999999)
NEXT_PUBLIC_WHATSAPP="5511999999999"
```

Salve o arquivo.

---

## Passo 3: Criar tabelas no banco

No terminal, na pasta do projeto:

```bash
npx prisma db push
```

Se der certo, as tabelas do sistema serão criadas.

---

## Passo 4: Criar o usuário admin

Ainda no terminal:

```bash
npm run db:seed
```

Login padrão do painel:
- **E-mail:** admin@erica.com  
- **Senha:** admin123  

(Altere a senha depois pelo painel ou direto no banco.)

---

## Passo 5: Subir o projeto

```bash
npm run dev
```

- **Site:** http://localhost:3000  
- **Painel:** http://localhost:3000/admin  

Faça login no painel e cadastre o primeiro imóvel para testar.

---

## Passo 6: Personalizar (quando quiser)

- Trocar “Erica Imóveis” e textos em `src/components/Header.tsx` e `src/app/page.tsx`  
- Links das redes em `src/components/Footer.tsx`  
- Cores em `tailwind.config.ts`  
- Imagem do banner na home em `src/app/page.tsx`  

---

## Passo 7: Deploy (quando for publicar)

1. Escolher um host (Vercel, Railway, etc.).  
2. Conectar o repositório e configurar no painel:
   - `DATABASE_URL` (PostgreSQL de produção)
   - `JWT_SECRET` (chave forte e única)
   - `NEXT_PUBLIC_APP_URL` (ex: https://seusite.com.br)
   - `NEXT_PUBLIC_WHATSAPP`
3. Fazer o deploy; em produção usar `npx prisma migrate deploy` se estiver usando migrations.

---

**Resumo rápido:**  
1. PostgreSQL → 2. `.env` → 3. `npx prisma db push` → 4. `npm run db:seed` → 5. `npm run dev`

Quando tiver o Passo 1 e 2 prontos, rode os comandos dos passos 3, 4 e 5 nessa ordem.
