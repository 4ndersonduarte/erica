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
   - **Root Directory**: deixe em branco.
   - **Build Command**: `next build` (padrão).
   - **Output Directory**: padrão.
   - **Install Command**: `npm install` (padrão).

## 3. Variáveis de ambiente

Em **Environment Variables** adicione (use os mesmos valores do seu `.env` local):

| Nome | Valor | Onde achar |
|------|--------|------------|
| `DATABASE_URL` | URI do PostgreSQL (Supabase) | Supabase → Settings → Database → Connection string (URI), porta 6543 |
| `JWT_SECRET` | Uma string longa e aleatória | Mesma que você usa no `.env` local |
| `NEXT_PUBLIC_APP_URL` | **https://seu-projeto.vercel.app** | Será a URL do site na Vercel (ajuste depois do 1º deploy) |
| `NEXT_PUBLIC_WHATSAPP` | Número com DDI, ex: 5511999999999 | Seu WhatsApp |
| `NEXT_PUBLIC_SUPABASE_URL` | https://dkkmzjskxlqclpvmkjzv.supabase.co | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Chave `anon` do projeto | Supabase → Settings → API → Project API keys |

- Marque **Production**, **Preview** e **Development** para cada variável (ou só Production se quiser).
- **Importante:** na senha do banco, se tiver `@`, use `%40` (ex.: `minhasenha%40abc`).

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

**Dica:** O dashboard do admin usa a função `get_dashboard_stats()` no Supabase. Garanta que essa função existe no seu projeto Supabase para o painel carregar corretamente em produção.
