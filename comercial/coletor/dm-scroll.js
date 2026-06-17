// dm-scroll.js — abre a conversa do Micael, rola do TOPO até embaixo capturando telas.
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

// hover no centro do painel de mensagens e rola PRA CIMA até carregar tudo
await page.mouse.move(880, 720);
for (let i=0;i<25;i++){ await page.mouse.wheel(0,-1400); await sleep(900); }
await sleep(1500);

// agora desce capturando telas
let shot=0;
for (let i=0;i<10;i++){
  shot++; await page.screenshot({ path: path.join(saidasDir, `dmfull-${String(shot).padStart(2,'0')}.png`) });
  await page.mouse.move(880, 720); await page.mouse.wheel(0,1150); await sleep(1000);
}
console.log('telas capturadas:', shot);
await ctx.close().catch(()=>{});
process.exit(0);
