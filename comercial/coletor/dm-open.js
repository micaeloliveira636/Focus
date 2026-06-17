// dm-open.js — abre a conversa do Micael, rola até o topo e screenshot + extrai reels.
import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome', headless: true, viewport: { width: 1280, height: 1500 }, locale: 'pt-BR',
});
const page = await ctx.newPage();
await page.goto('https://www.instagram.com/direct/inbox/', { waitUntil: 'domcontentloaded' });
await sleep(7000);
for (const t of ['Agora não','Not Now']) { const b=page.locator(`button:has-text("${t}")`).first(); if(await b.count().catch(()=>0)){await b.click().catch(()=>{});await sleep(800);} }

await page.locator('span:has-text("Micael Oliveira")').first().click().catch(()=>{});
await sleep(5000);

// rola pro topo pra carregar tudo
const scroller = page.locator('div[style*="overflow"]').first();
for (let i=0;i<10;i++){ await page.mouse.wheel(0,-1600); await sleep(1200); }
await sleep(1500);

let links = new Set();
const hrefs = await page.evaluate(()=>[...document.querySelectorAll('a[href*="/reel/"],a[href*="/p/"]')].map(a=>a.getAttribute('href')));
hrefs.forEach(h=>{const m=h&&h.match(/\/(p|reel)\/([^/?]+)/); if(m) links.add(m[1]+':'+m[2]);});
console.log('reels/posts na conversa:', links.size);
[...links].forEach(l=>console.log(l));

// screenshots da conversa (3 telas rolando pra baixo)
for (let i=0;i<4;i++){ await page.screenshot({ path: path.join(saidasDir, `dm-conv-${i+1}.png`) }); await page.mouse.wheel(0,1300); await sleep(1200); }
await ctx.close().catch(()=>{});
process.exit(0);
