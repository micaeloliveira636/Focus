// descobrir.js — descoberta geográfica no Google Maps (headless, invisível).
// Dado um nicho + região, devolve os negócios que ESTÃO de fato lá: nome, endereço,
// categoria, nota, nº de avaliações e site. Resolve o gargalo da descoberta (busca web
// dava ~83% de lixo: cidade/zona errada) E já traz o sinal de GMN no mesmo movimento.
//
// O @ do Instagram NÃO sai daqui — Maps não expõe. Sai do passo seguinte (abrir o site/
// linktree, ou buscar o nome). Aqui a gente garante: existe, está na região, e como está o GMN.
//
// Uso:
//   node descobrir.js "estúdio de cílios" "Santana"
//   node descobrir.js "estúdio de cílios" "Água Fria São Paulo"
//
// Saída: saidas/descoberta-<ts>.json  + tabela no terminal.

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataDir = path.join(__dirname, '.perfil-chrome');
const saidasDir = path.join(__dirname, 'saidas');

const nicho = process.argv[2];
const regiao = process.argv[3];
if (!nicho || !regiao) {
  console.log('Uso: node descobrir.js "<nicho>" "<região>"');
  process.exit(1);
}
let local = regiao;
if (!/s[ãa]o paulo|\bsp\b/i.test(local)) local += ' São Paulo';
const query = `${nicho} ${local}`;

if (!fs.existsSync(saidasDir)) fs.mkdirSync(saidasDir, { recursive: true });

const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel: 'chrome',
  headless: true,
  viewport: { width: 1280, height: 1600 },
  locale: 'pt-BR',
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled', '--lang=pt-BR'],
});

const page = await ctx.newPage();
const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/?hl=pt-BR`;
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

// tela de consentimento (perfil novo no Google) — tentar aceitar
try {
  const botao = await page.$(
    'button[aria-label*="Aceitar"], button[aria-label*="Accept"], form[action*="consent"] button, button[jsname]'
  );
  if (botao) {
    await botao.click().catch(() => {});
    await page.waitForTimeout(3000);
  }
} catch {}

// esperar o feed de resultados
let temFeed = true;
try {
  await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
} catch {
  temFeed = false;
}

if (!temFeed) {
  // pode ter caído numa página única (1 resultado direto) ou consentimento travou
  const titulo = await page.title();
  console.log(`SEM_FEED — título da página: "${titulo}". Pode ser consentimento ou resultado único.`);
  await page.screenshot({ path: path.join(saidasDir, 'descoberta-debug.png') }).catch(() => {});
  await ctx.close().catch(() => {});
  process.exit(3);
}

// rolar o feed pra carregar mais resultados (lazy load)
let prev = 0;
for (let i = 0; i < 10; i++) {
  await page.evaluate(() => {
    const f = document.querySelector('div[role="feed"]');
    if (f) f.scrollTo(0, f.scrollHeight);
  });
  await page.waitForTimeout(1800);
  const count = await page.evaluate(
    () => document.querySelectorAll('div[role="feed"] a.hfpxzc').length
  );
  if (count === prev) break;
  prev = count;
}

const negocios = await page.evaluate(() => {
  const out = [];
  for (const card of document.querySelectorAll('div[role="feed"] > div')) {
    const a = card.querySelector('a.hfpxzc');
    if (!a) continue;
    const nome = a.getAttribute('aria-label') || '';
    const placeUrl = a.getAttribute('href') || '';
    const txt = card.innerText || '';
    const nota = card.querySelector('.MW4etd')?.textContent?.trim() || null;
    // nº de avaliações = número entre parênteses logo após a nota ("4,9(312)")
    const aval = (txt.match(/\(\s*([\d.]+)\s*\)/) || [])[1]?.replace(/\./g, '') || null;
    // card patrocinado = o negócio JÁ anuncia (sinal, não descarte)
    const patrocinado = /patrocinado/i.test(card.querySelector('[aria-label*="atrocinado"]') ? 'patrocinado' : txt);
    const site =
      card.querySelector('a[data-value="Website"]')?.getAttribute('href') ||
      card.querySelector('a[aria-label*=" site"]')?.getAttribute('href') ||
      null;
    const detalhes = Array.from(card.querySelectorAll('.W4Efsd'))
      .map((e) => e.textContent.trim())
      .filter(Boolean);
    out.push({ nome, placeUrl, nota, avaliacoes: aval, site, patrocinado, detalhes: detalhes.join(' · ') });
  }
  return out;
});

await ctx.close().catch(() => {});

// dedup por nome
const vistos = new Set();
const limpos = negocios.filter((n) => n.nome && !vistos.has(n.nome) && vistos.add(n.nome));

const arqOut = path.join(saidasDir, `descoberta-${Date.now()}.json`);
fs.writeFileSync(arqOut, JSON.stringify({ query, total: limpos.length, negocios: limpos }, null, 2));

console.log(`\n${limpos.length} negócios em "${query}":\n`);
for (const n of limpos) {
  const estrela = n.nota ? ` — ${n.nota}★ (${n.avaliacoes ?? '?'} aval)` : ' — sem nota';
  const flags = `${n.site ? ' · tem site' : ' · SEM site'}${n.patrocinado ? ' · 📣 ANUNCIA' : ''}`;
  console.log(`• ${n.nome}${estrela}${flags}`);
  if (n.detalhes) console.log(`    ${n.detalhes}`);
}
console.log(`\nSalvo em ${arqOut}`);
process.exit(0);
