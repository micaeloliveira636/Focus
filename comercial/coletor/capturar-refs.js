// capturar-refs.js — captura as referências de carrossel do banco (REFERENCIAS.md):
//   - PERFIS: print da página do perfil (header + grade, com scroll p/ carregar)
//   - POSTS:  percorre o carrossel slide a slide e printa cada slide recortado
//
// Reusa o perfil dedicado logado (.perfil-chrome). Headless por padrão.
// Uso: node capturar-refs.js            (tudo)
//      node capturar-refs.js posts      (só posts)
//      node capturar-refs.js perfis     (só perfis)
//      HEADLESS=0 node capturar-refs.js (com janela, p/ debug)

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const headless = process.env.HEADLESS !== '0';
const modo = (process.argv[2] || 'tudo').toLowerCase();

const outRoot = path.join(__dirname, '..', '..', 'identidade', 'referencias', 'capturas-2026-06-17');
const outPerfis = path.join(outRoot, 'perfis');
const outPosts = path.join(outRoot, 'posts');
for (const d of [outRoot, outPerfis, outPosts]) fs.mkdirSync(d, { recursive: true });

const PERFIS = [
  'geisianedsgn', 'giovana.psd', 'mazzeidesign_', 'typosters',
  'wanrleydesigner', 'yaojadzn', 'gaia.psd', 'luisfelipe.design',
  'nana_multimedia', 'designbyayelet', 'martavillegaasdesign',
  'designbysergio', 'rafafrancodesign', 'gtmshrma',
];

const POSTS = [
  'DWWP_UtDYTO', 'DHUaD5Wvdjf', 'DIzvMM1ta5g', 'DHPRwb6P-8y', 'DWlhUU4DFKX',
  'DZVH08NgV1S', 'DYpxkaaFZQZ', 'DX_03f-jEiR', 'DYMimB3CLRi', 'DUgS1aZiVyn',
  'DWOqrB5jdOt', 'DZfX1sYFSBK', 'DZnFHREASfA', 'DYiphqLDGPG', 'DYSRkcfEcDh',
  'DX__xKAji1k', 'DV8sDgnjn4I', 'DT24GxxDi8y', 'DZir2nQFCeC', 'DXKCLRhjam8',
  'DWl-uvtDcYX', 'DZIHgVdke2I', 'DWXGcHdFJmo', 'DWEygDKlAJ0', 'DVGqndUjaq9',
  'DKIKsNhRL86', 'DVJAZ3niFq-',
];

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless,
  viewport: { width: 1320, height: 1500 },
  deviceScaleFactor: 2,
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled', ...(headless ? [] : ['--start-maximized'])],
  locale: 'pt-BR',
});

async function temSessao() {
  const cookies = await ctx.cookies('https://www.instagram.com');
  return cookies.some((c) => c.name === 'sessionid' && c.value);
}
if (!(await temSessao())) {
  console.log('NAO_LOGADO — rode: node login.js');
  await ctx.close().catch(() => {});
  process.exit(2);
}

// fecha diálogos chatos (notificações, etc.)
async function fechaDialogo(page) {
  for (const txt of ['Agora não', 'Not Now', 'Cancelar', 'Fechar']) {
    const b = page.locator(`button:has-text("${txt}")`).first();
    if (await b.count().catch(() => 0)) { await b.click().catch(() => {}); await page.waitForTimeout(400); }
  }
}

// bounding box do maior <img> de mídia do post (cdn do instagram/fb)
async function boxDaMidia(page) {
  return await page.evaluate(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const imgs = [...document.querySelectorAll('article img, main img')]
      .filter((im) => /cdninstagram|fbcdn/.test(im.currentSrc || im.src || ''))
      .map((im) => {
        const r = im.getBoundingClientRect();
        // área visível dentro da viewport (resolve slide pré-carregado posicionado fora)
        const vis = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        return { x: r.x, y: r.y, w: r.width, h: r.height, vis };
      })
      .filter((r) => r.w > 250 && r.h > 250)
      .sort((p, q) => q.vis - p.vis);
    return imgs[0] || null;
  });
}

async function botaoProximo(page) {
  // pt-BR: "Avançar"; en: "Next"
  for (const lbl of ['Avançar', 'Next', 'Próximo']) {
    const b = page.locator(`button[aria-label="${lbl}"], [aria-label="${lbl}"][role="button"]`).first();
    if (await b.count().catch(() => 0)) return b;
  }
  return null;
}

async function capturaPost(code) {
  const page = await ctx.newPage();
  const dir = path.join(outPosts, code);
  fs.mkdirSync(dir, { recursive: true });
  try {
    await page.goto(`https://www.instagram.com/p/${code}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4500);
    await fechaDialogo(page);
    await page.waitForTimeout(800);

    // confirma que o post existe
    const indisponivel = await page.locator('text=/página não está disponível|isn.t available|Esta página/i').count().catch(() => 0);
    if (indisponivel) { console.log(`  [${code}] INDISPONÍVEL`); return { code, ok: false, slides: 0 }; }

    let n = 0;
    const max = 20;
    for (let i = 0; i < max; i++) {
      await page.waitForTimeout(900);
      const box = await boxDaMidia(page);
      n++;
      const file = path.join(dir, `slide-${String(n).padStart(2, '0')}.png`);
      if (box && box.w > 250) {
        const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.w, 1320 - Math.max(0, box.x)), height: Math.min(box.h, 1500 - Math.max(0, box.y)) };
        await page.screenshot({ path: file, clip }).catch(async () => { await page.screenshot({ path: file }); });
      } else {
        await page.screenshot({ path: file });
      }
      const next = await botaoProximo(page);
      if (!next) break;
      await next.click().catch(() => {});
      await page.waitForTimeout(700);
    }
    console.log(`  [${code}] OK — ${n} slide(s)`);
    return { code, ok: true, slides: n };
  } catch (e) {
    console.log(`  [${code}] ERRO: ${String(e).slice(0, 120)}`);
    return { code, ok: false, slides: 0, err: String(e).slice(0, 120) };
  } finally {
    await page.close().catch(() => {});
  }
}

async function capturaPerfil(handle) {
  const page = await ctx.newPage();
  try {
    await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4500);
    await fechaDialogo(page);
    const indisponivel = await page.locator('text=/página não está disponível|isn.t available/i').count().catch(() => 0);
    if (indisponivel) { console.log(`  [@${handle}] INDISPONÍVEL`); return { handle, ok: false }; }
    // carrega algumas linhas da grade
    for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 1100); await page.waitForTimeout(1100); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const file = path.join(outPerfis, `perfil-${handle}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  [@${handle}] OK`);
    return { handle, ok: true };
  } catch (e) {
    console.log(`  [@${handle}] ERRO: ${String(e).slice(0, 120)}`);
    return { handle, ok: false, err: String(e).slice(0, 120) };
  } finally {
    await page.close().catch(() => {});
  }
}

const relatorio = { perfis: [], posts: [] };

if (modo === 'tudo' || modo === 'perfis') {
  console.log(`\n== PERFIS (${PERFIS.length}) ==`);
  for (const h of PERFIS) { relatorio.perfis.push(await capturaPerfil(h)); await sleep(2500); }
}
if (modo === 'tudo' || modo === 'posts') {
  console.log(`\n== POSTS (${POSTS.length}) ==`);
  for (const c of POSTS) { relatorio.posts.push(await capturaPost(c)); await sleep(3000); }
}

fs.writeFileSync(path.join(outRoot, '_relatorio-captura.json'), JSON.stringify(relatorio, null, 2));
console.log(`\nPronto. Capturas em ${outRoot}`);
console.log(JSON.stringify(relatorio, null, 2));
await ctx.close().catch(() => {});
process.exit(0);
