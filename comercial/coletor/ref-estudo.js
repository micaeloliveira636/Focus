// ref-estudo.js — captura grade de PERFIS e slides de um CARROSSEL pra estudo de referência.
// Uso: node ref-estudo.js
import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas', 'estudo');
import fs from 'fs';
fs.mkdirSync(saidasDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const perfis = ['geisianedsgn', 'giovana.psd', 'mazzeidesign_', 'typosters'];
const carrossel = 'DWWP_UtDYTO'; // o que o dono mais elogiou a edição/manipulação

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome', headless: true, viewport: { width: 1180, height: 1500 }, locale: 'pt-BR',
});
const page = await ctx.newPage();

for (const h of perfis) {
  try {
    await page.goto(`https://www.instagram.com/${h}/`, { waitUntil: 'domcontentloaded' });
    await sleep(5500);
    await page.screenshot({ path: path.join(saidasDir, `perfil-${h}.png`) });
    console.log(`perfil ${h} OK`);
  } catch (e) { console.log(`ERRO perfil ${h}: ${String(e).slice(0,100)}`); }
}

// carrossel slide a slide
try {
  await page.goto(`https://www.instagram.com/p/${carrossel}/`, { waitUntil: 'domcontentloaded' });
  await sleep(5000);
  for (let i = 1; i <= 10; i++) {
    await page.screenshot({ path: path.join(saidasDir, `carrossel-${carrossel}-${String(i).padStart(2,'0')}.png`) });
    const next = page.locator('button[aria-label="Avançar"], button[aria-label="Next"]').first();
    if (!(await next.count().catch(()=>0))) break;
    await next.click().catch(()=>{});
    await sleep(1600);
  }
  console.log(`carrossel ${carrossel} OK`);
} catch (e) { console.log(`ERRO carrossel: ${String(e).slice(0,100)}`); }

await ctx.close().catch(()=>{});
process.exit(0);
