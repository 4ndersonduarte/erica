/**
 * Configura a DATABASE_URL no .env testando qual conexão funciona com seu Supabase.
 * Uso: npm run setup:db
 * Ou: node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_REF = 'dkkmzjskxlqclpvmkjzv';
const ENV_PATH = path.join(__dirname, '..', '.env');

function lerSenhaDoEnv() {
  try {
    const env = fs.readFileSync(ENV_PATH, 'utf8');
    const m = env.match(/DATABASE_URL="[^"]*[:]([^@]+)@/);
    if (m) {
      const encoded = m[1];
      try {
        return decodeURIComponent(encoded);
      } catch {
        return encoded;
      }
    }
  } catch {}
  return null;
}

function perguntar(pergunta) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(pergunta, (resposta) => {
      rl.close();
      resolve(resposta.trim());
    });
  });
}

function codificarSenha(senha) {
  return encodeURIComponent(senha).replace(/@/g, '%40').replace(/#/g, '%23');
}

function getUrls(senha) {
  const p = codificarSenha(senha);
  return [
    { nome: 'Conexão direta (porta 5432)', url: `postgresql://postgres:${p}@db.${PROJECT_REF}.supabase.co:5432/postgres?connect_timeout=10` },
    { nome: 'Pooler Session (porta 5432)', url: `postgresql://postgres.${PROJECT_REF}:${p}@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?connect_timeout=10` },
    { nome: 'Pooler Transaction (porta 6543)', url: `postgresql://postgres.${PROJECT_REF}:${p}@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=10` },
  ];
}

function testarConexao(url) {
  let Client;
  try {
    Client = require('pg').Client;
  } catch {
    console.log('\n  Execute antes: npm install\n');
    process.exit(1);
  }
  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }, 8000);
    const client = new Client({ connectionString: url });
    client.connect()
      .then(() => {
        client.end();
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(true);
        }
      })
      .catch(() => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve(false);
        }
      });
  });
}

function atualizarEnv(url) {
  let conteudo = fs.readFileSync(ENV_PATH, 'utf8');
  const novaLinha = `DATABASE_URL="${url.replace(/"/g, '')}"`;
  if (conteudo.match(/^DATABASE_URL=/m)) {
    conteudo = conteudo.replace(/^DATABASE_URL="[^"]*"/m, novaLinha);
  } else {
    conteudo = (conteudo.trimEnd() + '\n' + novaLinha + '\n').trimStart();
  }
  fs.writeFileSync(ENV_PATH, conteudo, 'utf8');
}

async function main() {
  console.log('\n  Configuração do banco (Supabase) - Erica Imóveis\n');

  let senha = lerSenhaDoEnv();
  if (!senha) {
    console.log('  Senha do banco: Supabase → Settings → Database (campo Database password)\n');
    senha = await perguntar('  Cole sua senha do banco e pressione Enter: ');
    if (!senha) {
      console.log('  Nenhuma senha informada. Saindo.');
      process.exit(1);
    }
  } else {
    console.log('  Usando a senha que já está no .env.\n');
  }

  const candidatos = getUrls(senha);
  console.log('  Testando conexões...\n');

  for (const { nome, url } of candidatos) {
    process.stdout.write(`  • ${nome} ... `);
    const ok = await testarConexao(url);
    if (ok) {
      console.log(' OK');
      atualizarEnv(url);
      console.log('\n  Conexão funcionou. DATABASE_URL foi atualizada no .env.');
      console.log('  Reinicie o servidor (npm run dev) e tente cadastrar o imóvel.\n');
      process.exit(0);
    }
    console.log(' falhou');
  }

  console.log('\n  Nenhuma das conexões funcionou.');
  console.log('  1. Confirme a senha em: https://supabase.com/dashboard/project/' + PROJECT_REF + '/settings/database');
  console.log('  2. Se o projeto estiver pausado, ative no dashboard do Supabase.');
  console.log('  3. Copie a "Connection string" (URI) do Supabase e cole no .env em DATABASE_URL.\n');
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
