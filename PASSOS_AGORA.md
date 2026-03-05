# O que fazer agora – passos em ordem

Siga **nesta ordem**. Quando terminar um passo, vá para o próximo.

---

## 1. Colocar a senha do banco no `.env`

O seed e o app precisam da **senha do PostgreSQL** do seu projeto Supabase.

1. Abra: **https://supabase.com/dashboard/project/dkkmzjskxlqclpvmkjzv/settings/database**
2. Na seção **Database password**:
   - Se você ainda **não definiu** uma senha (ou não lembra), clique em **Reset database password**, defina uma senha forte e **guarde**.
   - Se já tem a senha, use essa mesma.
3. Abra o arquivo **`.env`** na raiz do projeto Erica.
4. Na linha do `DATABASE_URL`, **substitua** `YOUR_SUPABASE_DB_PASSWORD` pela senha que você usa no Supabase (sem espaços nem aspas extras).

Exemplo (sua senha é `MinhaS3nhaF0rt3`):

```env
DATABASE_URL="postgresql://postgres:MinhaS3nhaF0rt3@db.dkkmzjskxlqclpvmkjzv.supabase.co:5432/postgres"
```

Salve o `.env`.

---

## 2. Rodar o seed (criar admin)

No terminal, na pasta do projeto:

```bash
npm run db:seed
```

Deve aparecer: **Seed: admin criado (admin@erica.com / admin123)**

Se der erro de conexão, volte ao passo 1 e confira a senha no `.env`.

---

## 3. Subir o site

No terminal:

```bash
npm run dev
```

Abra no navegador:

- **Site:** http://localhost:3000  
- **Painel:** http://localhost:3000/admin  

Login do painel: **admin@erica.com** / **admin123**

---

## 4. Testar

1. No **painel** (/admin), faça login.
2. Cadastre um imóvel (fotos, endereço, valor, etc.).
3. Marque como **Destaque** e salve.
4. No **site** (/), confira se o imóvel aparece na seção de destaque.

---

## Resumo

| Passo | O que fazer |
|-------|-------------|
| 1 | Colocar a **senha do Supabase** no `.env` (substituir `YOUR_SUPABASE_DB_PASSWORD`) |
| 2 | Rodar `npm run db:seed` |
| 3 | Rodar `npm run dev` |
| 4 | Abrir http://localhost:3000 e http://localhost:3000/admin e testar |

Depois disso o Erica Imóveis estará rodando com o banco no Supabase.
