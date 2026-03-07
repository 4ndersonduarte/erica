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

## Opção 2: Manual

1. Abra: **https://supabase.com/dashboard/project/dkkmzjskxlqclpvmkjzv/settings/database**
2. Em **Connection string**, escolha **URI**.
3. Copie a URL e troque `[YOUR-PASSWORD]` pela senha do banco.  
   Se a senha tiver `@` ou `#`, troque por `%40` ou `%23`.
4. No projeto, abra o arquivo **`.env`** e deixe só uma linha assim (com a URL que você colou):

   ```
   DATABASE_URL="postgresql://..."
   ```

5. Salve, reinicie o servidor (`npm run dev`) e teste de novo.

---

## Se ainda der erro

- Confirme se o projeto no Supabase não está **pausado** (ative no dashboard).
- Use a **Connection string** que o próprio Supabase mostra (Session ou Transaction) e cole no `.env`.
