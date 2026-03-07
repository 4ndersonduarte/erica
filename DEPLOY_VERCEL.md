# Deploy do Erica Imóveis na Vercel

## 1. Conta e repositório

1. Crie uma conta em [vercel.com](https://vercel.com) (pode usar GitHub para login).
2. Coloque o projeto no GitHub (se ainda não estiver):
   - Crie um repositório no GitHub.
   - Na pasta do projeto, execute:
   ```bash
      git init
      git add .
      git commit -m "Deploy Vercel"
      git branch -M main
      git remote add origin https://github.com/SEU-USUARIO/erica-imoveis.git
      git push -u origin main
   ```

## 2. Novo projeto na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository**: escolha o repositório do projeto (ex.: `erica-imoveis`).
3. **Configure Project**:
   - **Framework Preset**: Next.js (já detectado).
   - **Root Directory**: deixe em branco (obrigatório: o app está em `src/app` na raiz do repo).
   - **Build Command**: `npm run build` ou deixe o padrão (usa o script do `package.json`).
   - **Output Directory**: padrão.
   - **Install Command**: `npm install` (padrão).

## 3. Variáveis de ambiente

Em **Settings → Environment Variables** adicione:

| Nome | Valor | Obrigatório |
|------|--------|-------------|
| **`DATABASE_URL`** | Ver quadro abaixo (pooler, porta 6543) | **Sim** |
| `JWT_SECRET` | Uma string longa e aleatória | Sim |
| `NEXT_PUBLIC_APP_URL` | https://seu-projeto.vercel.app (ajuste depois do 1º deploy) | Sim |
| `NEXT_PUBLIC_SUPABASE_URL` | https://dkkmzjskxlqclpvmkjzv.supabase.co | Sim (para upload de fotos) |
| `SUPABASE_ANON_KEY` | Chave **anon** em Supabase → Settings → API | Sim (para upload de fotos) |
| `NEXT_PUBLIC_WHATSAPP_ERICA` | 5538984212207 | Recomendado |
| `NEXT_PUBLIC_WHATSAPP_TERRA_BOA` | Número Terra Boa com DDI | Opcional |

### DATABASE_URL na Vercel (obrigatório: pooler)

Na Vercel **não** use a conexão direta (porta 5432). Use o **pooler** (porta 6543):

```
postgresql://postgres.dkkmzjskxlqclpvmkjzv:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

- Troque `SUA_SENHA` pela senha do banco (Supabase → Settings → Database).
- Se a senha tiver `@`, use `%40` (ex.: `Timaonaveia123@` → `Timaonaveia123%40`).

Se copiar do Supabase, **adicione no final da URL** `?pgbouncer=true` (obrigatório para o Prisma funcionar com o pooler).

- Marque **Production**, **Preview** e **Development** para cada variável (ou só Production).

Depois de salvar, clique em **Deploy**.

## 4. Após o primeiro deploy

1. A Vercel vai mostrar a URL do projeto (ex.: `https://erica-imoveis-xxx.vercel.app`).
2. Volte em **Settings → Environment Variables**, edite `NEXT_PUBLIC_APP_URL` e coloque essa URL exata (com `https://`).
3. Faça um **Redeploy** (Deployments → ⋮ no último deploy → Redeploy) para a app usar a URL correta.

## 5. Deploy pelo terminal (alternativa)

Se preferir não usar o GitHub agora:

1. Instale o CLI: `npm i -g vercel`
2. Na pasta do projeto: `vercel`
3. Siga as perguntas (login, nome do projeto, etc.).
4. Adicione as variáveis de ambiente no painel da Vercel (Settings → Environment Variables) e rode `vercel --prod` para deploy de produção.

---

**Dois WhatsApps:** Use `NEXT_PUBLIC_WHATSAPP_ERICA` (ex.: 5538984212207) e `NEXT_PUBLIC_WHATSAPP_TERRA_BOA` (número que você definir). O botão flutuante e as seções de contato oferecem as duas opções.

**Banco:** Se o projeto já tinha banco antes da atualização com o campo "tópico", rode `npx prisma db push` (ou aplique a migração que adiciona a coluna `topic`) para que o cadastro de imóveis funcione.

**Upload de fotos:** O bucket `property-images` no Supabase Storage já está criado. Basta ter `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_ANON_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`) nas variáveis da Vercel para o upload funcionar.

**Dica:** O dashboard do admin usa a função `get_dashboard_stats()` no Supabase. Garanta que essa função existe no seu projeto Supabase para o painel carregar corretamente em produção.

---

## Erro: "Couldn't find any \`pages\` or \`app\` directory"

Se o build falhar com essa mensagem:

1. No painel da Vercel, vá em **Settings** → **General**.
2. Em **Root Directory**, deixe **vazio** (ou `.`) para que o build rode na raiz do repositório, onde estão `package.json` e a pasta `src` (com `src/app`).
3. Se o seu repositório tiver o app dentro de uma subpasta (ex.: pasta `erica` ou `Erica`), coloque **só o nome dessa pasta** em Root Directory (ex.: `Erica`).
4. Salve e faça **Redeploy** (Deployments → ⋮ → Redeploy).
