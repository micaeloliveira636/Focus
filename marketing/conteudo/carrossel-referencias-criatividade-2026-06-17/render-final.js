// Render FINAL com gradação unificada: mesma coloração roxa nos 8 slides,
// sombra/vinheta reforçada e grão extra. O grade entra POR BAIXO do texto
// (z-index 4) pra não tingir tipografia nem logo.
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pwPath = path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core');
const { chromium } = require(pwPath);
const outDir = path.join(__dirname, 'instagram');
fs.mkdirSync(outDir, { recursive: true });
const files = ['capa.html', 'slide-02.html', 'slide-03.html', 'slide-04.html', 'slide-05.html', 'slide-06.html', 'slide-07.html', 'slide-08.html'];

const GRADE = `
  /* dessatura o que vier quente e dá um contraste base uniforme */
  .cena{ filter: saturate(.74) contrast(1.07) brightness(.95) !important; }
  /* tinta tudo pro MESMO roxo (color = pega o tom roxo, mantém a luz) */
  .grade-col{ position:absolute; inset:0; z-index:4; pointer-events:none;
    background:#5a2bb0; mix-blend-mode:color; opacity:.34; }
  /* brilho roxo central pra dar profundidade/glow consistente */
  .grade-glow{ position:absolute; inset:0; z-index:4; pointer-events:none;
    background:radial-gradient(72% 60% at 50% 44%, rgba(123,52,214,.26), transparent 72%);
    mix-blend-mode:overlay; opacity:.6; }
  /* grão fino extra unificando textura */
  .grade-grain{ position:absolute; inset:0; z-index:9; pointer-events:none; opacity:.30; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px 200px; }
  /* vinheta mais funda pra fechar as bordas igual em todos */
  .grade-vinh{ position:absolute; inset:0; z-index:9; pointer-events:none;
    background:radial-gradient(122% 92% at 50% 42%, transparent 50%, rgba(0,0,0,.58) 100%); }
`;
const INJECT = `
  const s = document.querySelector('.slide');
  if (s) {
    for (const c of ['grade-col','grade-glow','grade-grain','grade-vinh']) {
      const d = document.createElement('div'); d.className = c; s.appendChild(d);
    }
  }
`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (let i = 0; i < files.length; i++) {
  const html = 'file://' + path.join(__dirname, files[i]).replace(/\\/g, '/');
  await page.goto(html, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: GRADE });
  await page.evaluate(INJECT);
  await page.waitForTimeout(700);
  const out = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.locator('.slide').first().screenshot({ path: out });
  console.log(`${files[i]} -> slide-${String(i + 1).padStart(2, '0')}.png`);
}
await browser.close();
console.log(`${files.length} slides (grade final) -> ${outDir}`);
process.exit(0);
