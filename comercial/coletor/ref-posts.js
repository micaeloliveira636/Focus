// ref-posts.js — abre posts do Instagram (perfil logado) e tira print pra referência visual.
// Uso: node ref-posts.js <shortcode1> <shortcode2> ...
import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const codes = process.argv.slice(2);
if (!codes.length) { console.log('Uso: node ref-posts.js <shortcode> ...'); process.exit(1); }

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome', headless: true, viewport: { width: 1280, height: 1400 }, locale: 'pt-BR',
});
const page = await ctx.newPage();
for (const code of codes) {
  try {
    await page.goto(`https://www.instagram.com/p/${code}/`, { waitUntil: 'domcontentloaded' });
    await sleep(5000);
    const out = path.join(saidasDir, `ref-ig-${code}.png`);
    await page.screenshot({ path: out });
    console.log(`${code} → ref-ig-${code}.png`);
  } catch (e) { console.log(`ERRO ${code}: ${String(e).slice(0,120)}`); }
}
await ctx.close().catch(()=>{});
process.exit(0);
