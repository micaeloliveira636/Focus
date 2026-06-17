// ref-carousel.js — abre um post-carrossel do IG (perfil logado) e tira print de CADA slide,
// clicando no botão "Avançar". Uso: node ref-carousel.js <shortcode>
import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const code = process.argv[2];
if (!code) { console.log('Uso: node ref-carousel.js <shortcode>'); process.exit(1); }

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome', headless: true, viewport: { width: 1180, height: 1300 }, locale: 'pt-BR',
});
const page = await ctx.newPage();
await page.goto(`https://www.instagram.com/p/${code}/`, { waitUntil: 'domcontentloaded' });
await sleep(5000);

for (let i = 1; i <= 12; i++) {
  await page.screenshot({ path: path.join(saidasDir, `refc-${code}-${String(i).padStart(2,'0')}.png`) });
  console.log(`slide ${i} → refc-${code}-${String(i).padStart(2,'0')}.png`);
  const next = page.locator('button[aria-label="Avançar"], button[aria-label="Next"]').first();
  if (!(await next.count().catch(()=>0))) { console.log('fim (sem botão Avançar)'); break; }
  await next.click().catch(()=>{});
  await sleep(1800);
}
await ctx.close().catch(()=>{});
process.exit(0);
