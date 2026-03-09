# Configurar o banco (Supabase) – jeito fácil

## Opção 1: Automático (recomendado)

No terminal, na pasta do projeto:

```bash
npm install
npm run setup:db
```

O script vai **testar** as conexões com o Supabase e **gravar no `.env`** a que funcionar.  
Se pedir a senha, use a **senha do banco** (Supabase → **Settings** → **Database** → *Database password*).

Depois:

```bash
npm run dev
```

E tente cadastrar o imóvel de novo.

---

## Opção 2: Manual (use o pooler, não a porta 5432)

A conexão **direta** (porta 5432) costuma falhar no seu computador com *"Can't reach database server"*. Use sempre o **pooler** (porta 6543):

1. Abra o arquivo **`.env`** na raiz do projeto.
2. Deixe a **`DATABASE_URL`** exatamente assim (trocando `SUA_SENHA` pela senha do banco do Supabase):

   ```
   DATABASE_URL="postgresql://postgres.dkkmzjskxlqclpvmkjzv:SUA_SENHA@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

   - Usuário é **`postgres.dkkmzjskxlqclpvmkjzv`** (com o ponto e o id do projeto).
   - Host é **`aws-1-sa-east-1.pooler.supabase.com`**, porta **6543**.
   - No **final** da URL tem que ter **`?pgbouncer=true`**.
   - Se a senha tiver `@` ou `#`, use `%40` ou `%23` no lugar.

3. Salve o `.env`, reinicie o servidor (`npm run dev`) e tente de novo (login/cadastro/imóveis).

---

## Se ainda der erro

- Confirme se o projeto no Supabase não está **pausado** (ative no dashboard).
- Use a **Connection string** que o próprio Supabase mostra (Session ou Transaction) e cole no `.env`.
