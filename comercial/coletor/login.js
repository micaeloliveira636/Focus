// login.js — abre o Chrome controlado num perfil dedicado pra automação.
// Você loga a conta SECUNDÁRIA uma vez; a sessão fica salva pros próximos runs.
// Detecção de login = cookie 'sessionid' do Instagram (independe de idioma/DOM).

import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless: false,
  viewport: null,
  // esconde o sinal de automação — sem isso o Instagram entra em loop de "redirecionando"
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
});

let closed = false;
ctx.on('close', () => { closed = true; });

const page = ctx.pages()[0] ?? (await ctx.newPage());

async function temSessao() {
  try {
    const cookies = await ctx.cookies('https://www.instagram.com');
    return cookies.some((c) => c.name === 'sessionid' && c.value);
  } catch {
    return false;
  }
}

if (await temSessao()) {
  console.log('SESSAO_JA_ATIVA');
  await ctx.close().catch(() => {});
  process.exit(0);
}

try {
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });
} catch {}
console.log('>> Faça login com a conta SECUNDÁRIA na janela do Chrome que abriu.');
console.log('>> Pode navegar à vontade; eu detecto a sessão pelo cookie e fecho sozinho.');

const deadline = Date.now() + 8 * 60 * 1000; // 8 min
let ok = false;
while (Date.now() < deadline) {
  if (closed) break;
  if (await temSessao()) { ok = true; break; }
  await sleep(3000);
}

console.log(closed && !ok ? 'JANELA_FECHADA' : ok ? 'LOGIN_OK' : 'LOGIN_TIMEOUT');
if (!closed) await ctx.close().catch(() => {});
process.exit(ok ? 0 : 1);
