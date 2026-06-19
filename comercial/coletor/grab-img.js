// grab-img.js — pega a imagem em resolução cheia de um post IG (perfil logado).
// Uso: node grab-img.js <shortcode>
import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const code = process.argv[2];
if (!code) { console.log('Uso: node grab-img.js <shortcode>'); process.exit(1); }

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome', headless: true, viewport: { width: 1180, height: 1300 }, locale: 'pt-BR',
});
const page = await ctx.newPage();
await page.goto(`https://www.instagram.com/p/${code}/`, { waitUntil: 'domcontentloaded' });
await sleep(5000);

// pega o maior <img> dentro do article (a foto do slide atual)
const src = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('article img, main img'));
  let best = null, area = 0;
  for (const im of imgs) {
    const a = (im.naturalWidth || im.width) * (im.naturalHeight || im.height);
    if (a > area && (im.naturalWidth || im.width) > 400) { area = a; best = im.currentSrc || im.src; }
  }
  return best;
});
if (!src) { console.log('nao achei img'); await ctx.close(); process.exit(1); }
const resp = await ctx.request.get(src);
const buf = await resp.body();
const out = path.join(saidasDir, `img-${code}.jpg`);
fs.writeFileSync(out, buf);
console.log('salvo:', out, '(', buf.length, 'bytes )');
await ctx.close().catch(()=>{});
process.exit(0);
