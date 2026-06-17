// saved-list.js — entra em "Salvos" da conta logada e lista os posts/reels salvos.
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

// 1) descobre o username logado
await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
await sleep(5000);
let username = null;
try {
  username = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a[role="link"]')].map(x => x.getAttribute('href')).filter(Boolean);
    const cand = a.find(h => /^\/[^/]+\/$/.test(h) && !['/explore/','/reels/','/direct/'].includes(h));
    return cand ? cand.replace(/\//g,'') : null;
  });
} catch {}
console.log('username logado:', username);

// 2) vai pra salvos
const url = username ? `https://www.instagram.com/${username}/saved/all-posts/` : 'https://www.instagram.com/';
await page.goto(url, { waitUntil: 'domcontentloaded' });
await sleep(6000);
await page.screenshot({ path: path.join(saidasDir, 'salvos-grid.png') });

// 3) coleta os links salvos (rola um pouco)
let links = new Set();
for (let i = 0; i < 6; i++) {
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')].map(a => a.getAttribute('href')));
  hrefs.forEach(h => { const m = h && h.match(/\/(p|reel)\/([^/]+)/); if (m) links.add(m[1] + ':' + m[2]); });
  await page.mouse.wheel(0, 1400); await sleep(1500);
}
console.log('total salvos encontrados:', links.size);
[...links].forEach(l => console.log(l));
await ctx.close().catch(()=>{});
process.exit(0);
