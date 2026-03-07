# Admin – como funciona

- **Onde:** `/admin` (link “Entrar” no site leva ao login).
- **Login:** um único usuário (e-mail e senha definidos no seed, ex.: admin@erica.com / admin123).
- **Quem loga** pode fazer qualquer alteração: cadastrar, editar e excluir imóveis.
- **Tudo** que for alterado é salvo no banco de dados. Nada de modo rascunho ou aprovação.
- Objetivo: manter o admin **simples e oculto** (só quem tem o login acessa).

Sem níveis de permissão, sem “corretor vs admin”: **logou = acesso total, tudo persiste no banco.**
