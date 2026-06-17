// dm-list.js — abre o Direct e screenshot da inbox + da 1ª conversa, pra achar reels compartilhados.
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
// fecha popup "ativar notificações" se aparecer
for (const t of ['Agora não','Not Now','Cancelar']) {
  const b = page.locator(`button:has-text("${t}")`).first();
  if (await b.count().catch(()=>0)) { await b.click().catch(()=>{}); await sleep(1000); }
}
await page.screenshot({ path: path.join(saidasDir, 'dm-inbox.png') });
console.log('inbox salvo');

// abre a 1ª conversa
const firstChat = page.locator('div[role="listitem"], a[href^="/direct/t/"]').first();
if (await firstChat.count().catch(()=>0)) {
  await firstChat.click().catch(()=>{});
  await sleep(5000);
  await page.screenshot({ path: path.join(saidasDir, 'dm-chat1.png') });
  console.log('chat1 salvo');
  // links de reels/posts compartilhados na conversa
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="/reel/"],a[href*="/p/"]')].map(a=>a.getAttribute('href')));
  const set = new Set(); hrefs.forEach(h=>{const m=h&&h.match(/\/(p|reel)\/([^/?]+)/); if(m) set.add(m[1]+':'+m[2]);});
  console.log('links na conversa:', set.size); [...set].forEach(l=>console.log(l));
}
await ctx.close().catch(()=>{});
process.exit(0);
