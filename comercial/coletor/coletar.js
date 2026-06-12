// coletar.js — coleta headless em lote os sinais de prospecção do Instagram + Biblioteca
// de Anúncios, usando o perfil dedicado logado (.perfil-chrome). Invisível: não toca na tela.
//
// O coletar.js SÓ COLETA (dados estruturados + prints headless do feed e dos ads).
// Quem analisa (régua, qualidade visual) e cria os cards no ClickUp é o Claude, depois.
//
// Uso:
//   node coletar.js handle1 handle2 ...      (passa os @ direto)
//   node coletar.js                          (lê de alvos.txt, um @ por linha; # = comentário)
//
// Saída: saidas/coleta-<timestamp>.json  +  saidas/<handle>.png (feed)  +  saidas/<handle>-ads.png

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (min, max) => Math.floor(min + Math.random() * (max - min));

// ---- alvos: args ou alvos.txt ----
let handles = process.argv.slice(2).map((h) => h.replace(/^@/, '').trim()).filter(Boolean);
if (handles.length === 0) {
  const arq = path.join(__dirname, 'alvos.txt');
  if (fs.existsSync(arq)) {
    handles = fs
      .readFileSync(arq, 'utf8')
      .split('\n')
      .map((l) => l.replace(/^@/, '').trim())
      .filter((l) => l && !l.startsWith('#'));
  }
}
if (handles.length === 0) {
  console.log('Sem alvos. Uso: node coletar.js <handle> [...]  ou preencha alvos.txt');
  process.exit(1);
}

if (!fs.existsSync(saidasDir)) fs.mkdirSync(saidasDir, { recursive: true });

// converte "3.531" / "6,4 mil" / "1,2 mi" em número aproximado
function parseNum(raw) {
  if (!raw) return null;
  const s = raw.toLowerCase().replace(/\./g, '').replace(',', '.');
  const m = s.match(/([\d.]+)\s*(mil|mi|m)?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (m[2] === 'mil' || m[2] === 'm') n *= 1000;
  if (m[2] === 'mi') n *= 1000000;
  return Math.round(n);
}

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless: true,
  viewport: { width: 1280, height: 1700 },
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled'],
});

async function logado() {
  const cookies = await ctx.cookies('https://www.instagram.com');
  return cookies.some((c) => c.name === 'sessionid' && c.value);
}

if (!(await logado())) {
  console.log('NAO_LOGADO — rode primeiro: node login.js');
  await ctx.close().catch(() => {});
  process.exit(2);
}

const resultados = [];

for (let i = 0; i < handles.length; i++) {
  const handle = handles[i];
  const r = { handle, seguidores: null, seguindo: null, posts: null, bioLink: null, anuncia: null, erro: null };
  const page = await ctx.newPage();
  try {
    // ---- perfil ----
    await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4500);

    const info = await page.evaluate(() => {
      const desc = document.querySelector('meta[property="og:description"]')?.content || '';
      let link = null;
      for (const a of document.querySelectorAll('header a, header link')) {
        const h = a.getAttribute('href') || '';
        if (h.includes('l.instagram.com') || (/^https?:\/\//.test(h) && !h.includes('instagram.com'))) { link = h; break; }
      }
      return { desc, link };
    });

    // números do og:description: "392 seguidores, seguindo 4, 33 posts — ..."
    r.seguidores = parseNum((info.desc.match(/([\d.,]+\s*(?:mil|mi)?)\s+seguidores/i) || [])[1]);
    r.seguindo = parseNum((info.desc.match(/seguindo\s+([\d.,]+\s*(?:mil|mi)?)/i) || [])[1]);
    r.posts = parseNum((info.desc.match(/([\d.,]+\s*(?:mil|mi)?)\s+posts/i) || [])[1]);

    // link real da bio (decodifica o redirect l.instagram.com?u=...)
    if (info.link) {
      try {
        const u = new URL(info.link);
        r.bioLink = u.searchParams.get('u') ? decodeURIComponent(u.searchParams.get('u')) : info.link;
      } catch { r.bioLink = info.link; }
    }

    // print headless do feed (cabeçalho + grid)
    await page.screenshot({ path: path.join(saidasDir, `${handle}.png`) });

    // ---- Biblioteca de Anúncios pelo @ ----
    await page.goto(
      `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=${encodeURIComponent(handle)}&search_type=keyword_unordered&media_type=all`,
      { waitUntil: 'domcontentloaded' }
    );
    await page.waitForTimeout(6000);
    const corpo = (await page.evaluate(() => document.body.innerText)) || '';
    if (/nenhum an[úu]ncio/i.test(corpo)) r.anuncia = false;
    else if (/resultados?/i.test(corpo)) r.anuncia = true; // tem resultado pelo @ — conferir no print
    await page.screenshot({ path: path.join(saidasDir, `${handle}-ads.png`) });
  } catch (e) {
    r.erro = String(e).slice(0, 200);
  } finally {
    await page.close().catch(() => {});
  }

  resultados.push(r);
  const status = r.erro ? `ERRO: ${r.erro}` : `${r.seguidores ?? '?'} seg · ${r.posts ?? '?'} posts · anuncia=${r.anuncia} · bio=${r.bioLink ?? '—'}`;
  console.log(`[${i + 1}/${handles.length}] @${handle} → ${status}`);

  if (i < handles.length - 1) await sleep(rnd(4000, 9000)); // pacing: não capar a conta
}

await ctx.close().catch(() => {});

const arqOut = path.join(saidasDir, `coleta-${Date.now()}.json`);
fs.writeFileSync(arqOut, JSON.stringify(resultados, null, 2));
console.log(`\nColeta salva em ${arqOut}`);
console.log(`Prints em ${saidasDir}/<handle>.png (feed) e <handle>-ads.png`);
process.exit(0);
