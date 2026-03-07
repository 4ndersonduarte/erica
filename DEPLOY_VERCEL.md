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

Em **Environment Variables** adicione (use os mesmos valores do seu `.env` local):

| Nome | Valor | Onde achar |
|------|--------|------------|
| `DATABASE_URL` | URI do PostgreSQL (Supabase) | Supabase → Settings → Database → Connection string (URI), porta 6543 |
| `JWT_SECRET` | Uma string longa e aleatória | Mesma que você usa no `.env` local |
| `NEXT_PUBLIC_APP_URL` | **https://seu-projeto.vercel.app** | Será a URL do site na Vercel (ajuste depois do 1º deploy) |
| `NEXT_PUBLIC_WHATSAPP_ERICA` | Número Erica com DDI, ex: 5538984212207 | WhatsApp (Erica) |
| `NEXT_PUBLIC_WHATSAPP_TERRA_BOA` | Número Terra Boa com DDI | WhatsApp (Terra Boa) |
| `NEXT_PUBLIC_WHATSAPP` | Fallback (opcional) | Se não usar os dois acima |
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

**Dois WhatsApps:** Use `NEXT_PUBLIC_WHATSAPP_ERICA` (ex.: 5538984212207) e `NEXT_PUBLIC_WHATSAPP_TERRA_BOA` (número que você definir). O botão flutuante e as seções de contato oferecem as duas opções.

**Banco:** Se o projeto já tinha banco antes da atualização com o campo "tópico", rode `npx prisma db push` (ou aplique a migração que adiciona a coluna `topic`) para que o cadastro de imóveis funcione.

**Dica:** O dashboard do admin usa a função `get_dashboard_stats()` no Supabase. Garanta que essa função existe no seu projeto Supabase para o painel carregar corretamente em produção.

---

## Erro: "Couldn't find any \`pages\` or \`app\` directory"

Se o build falhar com essa mensagem:

1. No painel da Vercel, vá em **Settings** → **General**.
2. Em **Root Directory**, deixe **vazio** (ou `.`) para que o build rode na raiz do repositório, onde estão `package.json` e a pasta `src` (com `src/app`).
3. Se o seu repositório tiver o app dentro de uma subpasta (ex.: pasta `erica` ou `Erica`), coloque **só o nome dessa pasta** em Root Directory (ex.: `Erica`).
4. Salve e faça **Redeploy** (Deployments → ⋮ → Redeploy).
