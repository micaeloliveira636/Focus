// ler-ficha.js — abre a ficha de cada negócio no Google Maps (headless) e extrai o que
// a lista de busca não dá: TELEFONE, SITE/@ do Instagram e nº de AVALIAÇÕES.
// Lê o último saidas/descoberta-*.json (ou um passado em --arq) e grava enriquecido.
//
// Uso:
//   node ler-ficha.js                       (todos do último descoberta-*.json)
//   node ler-ficha.js "Saara" "ANNA" "TM"   (só os negócios cujo nome casa com algum termo)
//   node ler-ficha.js --arq saidas/descoberta-123.json
//
// Saída: saidas/ficha-<ts>.json — cada negócio com telefone, site, handle (@ do IG se o
// site for instagram), avaliacoes, e os campos originais da descoberta.

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rnd = (min, max) => Math.floor(min + Math.random() * (max - min));

// ---- args ----
let argv = process.argv.slice(2);
let arq = null;
const ai = argv.indexOf('--arq');
if (ai !== -1) { arq = argv[ai + 1]; argv.splice(ai, 2); }
const filtros = argv.map((s) => s.toLowerCase()); // termos de nome (opcional)

// ---- achar o descoberta-*.json ----
if (!arq) {
  const cands = fs
    .readdirSync(saidasDir)
    .filter((x) => x.startsWith('descoberta-') && x.endsWith('.json'))
    .map((x) => ({ x, t: fs.statSync(path.join(saidasDir, x)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!cands.length) { console.log('Sem descoberta-*.json em saidas/. Rode antes: node descobrir.js'); process.exit(1); }
  arq = path.join(saidasDir, cands[0].x);
} else if (!path.isAbsolute(arq)) {
  arq = path.join(__dirname, arq);
}

const desc = JSON.parse(fs.readFileSync(arq, 'utf8'));
let alvos = desc.negocios.filter((n) => n.placeUrl);
if (filtros.length) alvos = alvos.filter((n) => filtros.some((f) => n.nome.toLowerCase().includes(f)));
if (!alvos.length) { console.log('Nenhum negócio casou os filtros.'); process.exit(1); }

console.log(`Lendo ficha de ${alvos.length} negócio(s) (de ${arq})\n`);

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless: true,
  viewport: { width: 1280, height: 1400 },
  locale: 'pt-BR',
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled', '--lang=pt-BR'],
});

const resultados = [];

for (let i = 0; i < alvos.length; i++) {
  const n = alvos[i];
  const r = { ...n, telefone: null, siteReal: null, handle: null, avaliacoes: n.avaliacoes || null, erro: null };
  const page = await ctx.newPage();
  try {
    await page.goto(n.placeUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(rnd(3500, 5000));

    const dados = await page.evaluate(() => {
      const tel =
        document.querySelector('button[data-item-id^="phone"]')?.getAttribute('aria-label') ||
        document.querySelector('[data-tooltip="Copiar número de telefone"]')?.getAttribute('aria-label') ||
        null;
      const site =
        document.querySelector('a[data-item-id="authority"]')?.getAttribute('href') ||
        document.querySelector('a[aria-label^="Site"]')?.getAttribute('href') ||
        null;
      // nº de avaliações no cabeçalho da ficha: "(312)" perto da nota
      const head = document.querySelector('.F7nice')?.textContent || document.body.innerText.slice(0, 400);
      const av = (head.match(/\(\s*([\d.]+)\s*\)/) || [])[1] || null;
      return { tel, site, av };
    });

    if (dados.tel) r.telefone = dados.tel.replace(/^Telefone:\s*/i, '').trim();
    if (dados.av) r.avaliacoes = dados.av.replace(/\./g, '');
    if (dados.site) {
      r.siteReal = dados.site;
      const m = dados.site.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
      if (m) r.handle = m[1].replace(/\/$/, '');
    }
  } catch (e) {
    r.erro = String(e).slice(0, 160);
  } finally {
    await page.close().catch(() => {});
  }

  resultados.push(r);
  const linha = r.erro
    ? `ERRO: ${r.erro}`
    : `tel=${r.telefone ?? '—'} · @=${r.handle ?? '—'} · site=${r.siteReal ? '✓' : '—'} · ${r.avaliacoes ?? '?'} aval`;
  console.log(`[${i + 1}/${alvos.length}] ${n.nome.slice(0, 50)} → ${linha}`);

  if (i < alvos.length - 1) await sleep(rnd(3000, 7000)); // pacing
}

await ctx.close().catch(() => {});

const arqOut = path.join(saidasDir, `ficha-${Date.now()}.json`);
fs.writeFileSync(arqOut, JSON.stringify(resultados, null, 2));
console.log(`\nFichas salvas em ${arqOut}`);
process.exit(0);
