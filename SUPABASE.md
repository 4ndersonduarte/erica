# Erica Imóveis + Supabase

O projeto está conectado ao Supabase. As tabelas já foram criadas na migration `erica_imoveis_initial`.

## Projeto

- **URL:** https://dkkmzjskxlqclpvmkjzv.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/dkkmzjskxlqclpvmkjzv

## Configurar conexão

1. No [Dashboard do Supabase](https://supabase.com/dashboard/project/dkkmzjskxlqclpvmkjzv/settings/database), vá em **Settings → Database**.
2. Em **Connection string**, escolha **URI** e copie a URL.
3. Substitua `[YOUR-PASSWORD]` pela senha do banco (a mesma que você definiu ao criar o projeto, ou redefina em **Database password**).
4. No projeto Erica, crie ou edite o `.env`:

```env
DATABASE_URL="postgresql://postgres.dkkmzjskxlqclpvmkjzv:[SUA-SENHA]@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Para rodar migrations com Prisma, use a **conexão direta** (porta 5432):

```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.dkkmzjskxlqclpvmkjzv.supabase.co:5432/postgres"
```

5. Gere o cliente e crie o admin:

```bash
npx prisma generate
npm run db:seed
```

6. Inicie o app: `npm run dev`

## Tabelas no Supabase

- **Admin** – usuários do painel (login)
- **Property** – imóveis
- **PropertyImage** – fotos dos imóveis

A migração foi aplicada via MCP (Supabase). Novas alterações no `prisma/schema.prisma` podem ser aplicadas com `npx prisma db push` ou `npx prisma migrate dev`.
