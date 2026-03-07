# Por que está dando erro?

Na prática são **duas causas** que geram quase todos os problemas:

---

## 1. Banco de dados (Supabase) não conecta

**Sintomas:** "Can't reach database server", "Tenant or user not found", ou ao cadastrar imóvel dá 500.

**Motivo:** A `DATABASE_URL` no `.env` está errada ou a rede não alcança o Supabase.

**Solução:**

```bash
npm install
npm run setup:db
```

O script testa as conexões e grava no `.env` a que funcionar. Depois reinicie o servidor (`npm run dev`).

Se ainda falhar: projeto no Supabase pode estar **pausado** (ative no dashboard) ou a senha está errada (Settings → Database).

---

## 2. Erro ao rodar `npm run build` (EPERM / arquivo em uso)

**Sintoma:** algo como "EPERM: operation not permitted, rename" ou "arquivo está sendo usado por outro processo".

**Motivo:** O servidor (`npm run dev`) ou outro programa está usando arquivos do Prisma/Node.

**Solução:**

1. Feche o terminal onde está rodando `npm run dev` (Ctrl+C).
2. Feche o Cursor/VS Code se estiver com o projeto aberto (ou deixe aberto mas não rode build enquanto o dev estiver ativo).
3. Rode de novo: `npm run build`.

Se continuar, reinicie o PC ou desative por um momento o antivírus na pasta do projeto.

---

## Resumo

| Erro | Causa | O que fazer |
|------|--------|-------------|
| Can't reach database / Tenant not found / 500 ao salvar | Conexão com o banco | `npm run setup:db` e conferir Supabase |
| EPERM / operation not permitted no build | Arquivo em uso (dev server, IDE, antivírus) | Parar o `npm run dev`, depois rodar `npm run build` |

Não há muitos tipos diferentes de erro: é **banco** ou **arquivo em uso**.
