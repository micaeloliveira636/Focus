// ler-perfil.js — lê os sinais públicos de um perfil do Instagram usando o MESMO
// perfil persistente onde você logou com login.js (.perfil-chrome). Sem CDP, sem porta.
// O Chrome 136+ bloqueia depuração no perfil padrão, então usamos um perfil dedicado.
// Uso: node ler-perfil.js <handle>     (HEADLESS=1 pra rodar sem janela)

import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const headless = process.env.HEADLESS === '1';

const handle = (process.argv[2] || 'studio.lashin').replace(/^@/, '');

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless,
  viewport: null,
  // esconde o sinal de automação — sem isso o Instagram entra em loop de "redirecionando"
  ignoreDefaultArgs: ['--enable-automation'],
  args: [
    ...(headless ? [] : ['--start-maximized']),
    '--disable-blink-features=AutomationControlled',
  ],
});

async function temSessao() {
  const cookies = await ctx.cookies('https://www.instagram.com');
  return cookies.some((c) => c.name === 'sessionid' && c.value);
}

if (!(await temSessao())) {
  console.log('NAO_LOGADO — esse perfil não está logado no Instagram. Rode: node login.js');
  await ctx.close().catch(() => {});
  process.exit(2);
}

const page = ctx.pages()[0] ?? (await ctx.newPage());
await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4500);

const data = await page.evaluate(() => {
  const desc = document.querySelector('meta[property="og:description"]')?.content || null;
  // link externo no header (Instagram redireciona via l.instagram.com)
  let link = null;
  for (const a of document.querySelectorAll('header a, header link')) {
    const h = a.getAttribute('href') || '';
    if (h.includes('l.instagram.com') || (/^https?:\/\//.test(h) && !h.includes('instagram.com'))) { link = h; break; }
  }
  return { desc, link, title: document.title };
});

console.log(JSON.stringify({ handle, ...data }, null, 2));
await ctx.close().catch(() => {});
process.exit(0);
