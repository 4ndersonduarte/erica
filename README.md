# Erica Imóveis

Sistema web completo para corretor de imóveis: site institucional + painel administrativo.

## Tecnologias

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Banco de dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (cookie httpOnly)

## Requisitos

- Node.js 18+
- **Local (teste):** SQLite (já configurado, sem instalação)
- **Produção:** PostgreSQL

## Rodar localmente (teste rápido)

O projeto já está configurado para usar **SQLite** localmente (arquivo `prisma/dev.db`). Não é preciso instalar PostgreSQL.

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- **Site:** http://localhost:3000  
- **Painel:** http://localhost:3000/admin  
- **Login:** admin@erica.com / admin123  

## Configuração para produção (PostgreSQL)

1. No `prisma/schema.prisma`, troque o datasource para:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. No `.env`, use a URL do seu PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/erica_imobiliaria?schema=public"
JWT_SECRET="sua-chave-secreta-jwt-muito-segura"
NEXT_PUBLIC_APP_URL="https://seusite.com.br"
NEXT_PUBLIC_WHATSAPP="5511999999999"
```

3. Rode `npx prisma db push` (ou `prisma migrate deploy` se usar migrations).

## Estrutura

- **Site público:** `/` (início), `/imoveis` (listagem), `/imoveis/[slug]` (imóvel)
- **Painel admin:** `/admin/login`, `/admin/dashboard`, `/admin/imoveis` (CRUD)
- **API:** `/api/auth/*`, `/api/properties`, `/api/admin/*`

## Deploy

1. Configure as variáveis de ambiente no provedor (Vercel, Railway, etc.).
2. Use `prisma migrate deploy` em ambiente de produção (após criar migrations com `prisma migrate dev`).
3. Build: `npm run build` e `npm start`.

## SEO

- Metadados e Open Graph nas páginas
- URLs amigáveis com slug por imóvel
- Sitemap em `/sitemap.xml`
- Robots em `/robots.txt`
