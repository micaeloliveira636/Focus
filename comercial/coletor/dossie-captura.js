// dossie-captura.js — captura os ATIVOS visuais do dossiê (presente give-first):
//   1. como a empresa aparece no Google (busca pelo nome)
//   2. como o nicho aparece no Google na região (busca genérica)
//   3. os melhores anúncios do nicho na Biblioteca de Anúncios (prova + ideia)
//
// Reaproveita o perfil dedicado logado (.perfil-chrome) e o stack do coletar.js.
//
// Uso:
//   node dossie-captura.js --slug saara --nome "Saara Clinic Santana cílios" \
//        --nicho "estúdio de cílios Santana" --ads "extensão de cílios"
//
// Saída: saidas/dossie-<slug>/  com g-nome.png, g-nicho.png, ads-nicho.png

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- args ----
const args = {};
const a = process.argv.slice(2);
for (let i = 0; i < a.length; i++) {
  if (a[i].startsWith('--')) { args[a[i].slice(2)] = a[i + 1]; i++; }
}
const slug = args.slug || 'dossie';
const buscaNome = args.nome || '';
const buscaNicho = args.nicho || '';
const buscaAds = args.ads || '';

const outDir = path.join(__dirname, 'saidas', `dossie-${slug}`);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless: true,
  viewport: { width: 1280, height: 1600 },
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled'],
  locale: 'pt-BR',
});

// fecha o consentimento do Google se aparecer
async function aceitaConsentimento(page) {
  for (const txt of ['Aceitar tudo', 'Aceito', 'Concordo', 'Accept all']) {
    const btn = page.locator(`button:has-text("${txt}")`).first();
    if (await btn.count().catch(() => 0)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(1500);
      return;
    }
  }
}

async function google(query, arquivo) {
  if (!query) return;
  const page = await ctx.newPage();
  try {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=br`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(2500);
    await aceitaConsentimento(page);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outDir, arquivo) });
    console.log(`Google "${query}" → ${arquivo}`);
  } catch (e) {
    console.log(`ERRO google "${query}": ${String(e).slice(0, 150)}`);
  } finally {
    await page.close().catch(() => {});
  }
}

async function adsBiblioteca(keyword, arquivo) {
  if (!keyword) return;
  const page = await ctx.newPage();
  try {
    await page.goto(
      `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered&media_type=all`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(7000);
    await page.screenshot({ path: path.join(outDir, arquivo), fullPage: false });
    console.log(`Ads "${keyword}" → ${arquivo}`);
  } catch (e) {
    console.log(`ERRO ads "${keyword}": ${String(e).slice(0, 150)}`);
  } finally {
    await page.close().catch(() => {});
  }
}

await google(buscaNome, 'g-nome.png');
await sleep(2500);
await google(buscaNicho, 'g-nicho.png');
await sleep(2500);
await adsBiblioteca(buscaAds, 'ads-nicho.png');

await ctx.close().catch(() => {});
console.log(`\nAtivos do dossiê em ${outDir}`);
process.exit(0);
