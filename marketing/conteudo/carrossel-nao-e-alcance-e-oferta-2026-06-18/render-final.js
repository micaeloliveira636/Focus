// Render FINAL com acabamento (grade 13.8): textura + tinta roxa unificada + glow central
// + grao + vinheta/sombra TRABALHADA, tudo POR BAIXO do texto. Mesmo passe do carrossel
// dos bustos. Uso: node render-final.js
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

const GRADE = `
  /* desliga grao/vinheta cru do html, a grade repoe mais forte */
  .grain, .vinh { display:none !important; }
  /* foto: contraste + leve dessaturacao + micro-blur cinematografico */
  .bg{ filter: saturate(.97) contrast(1.09) brightness(.94) blur(.7px) !important; transform:scale(1.03); }

  .gr-tex, .gr-tint, .gr-glow, .gr-shadow{ position:absolute; inset:0; z-index:2; pointer-events:none; }
  .gr-grain, .gr-vinh{ position:absolute; inset:0; z-index:9; pointer-events:none; }
  .gr-tex span{ position:absolute; inset:0; background-position:center; background-size:cover; display:block; }
  .gr-plastic{ background-image:url('../../../identidade/textura-plastic.png'); mix-blend-mode:overlay; opacity:.09; }
  .gr-scratch{ background-image:url('../../../identidade/textura-scratched.jpg'); mix-blend-mode:soft-light; opacity:.08; }
  .gr-fabric{ background-image:url('../../../identidade/textura-fabric.jpg'); mix-blend-mode:soft-light; opacity:.05; }
  /* tinta roxa unificadora LEVE (sweet spot .12, igual aos bustos) */
  .gr-tint{ background:#5a2bb0; mix-blend-mode:color; opacity:.12; }
  /* luz: glow roxo central pra dar profundidade/foco */
  .gr-glow{ background:radial-gradient(56% 46% at 50% 45%, rgba(150,80,230,.26), transparent 70%); mix-blend-mode:screen; opacity:.55; }
  /* SOMBRA trabalhada: escurece topo, base e laterais pra moldar a luz no centro */
  .gr-shadow{ background:
      linear-gradient(180deg, rgba(0,0,0,.42) 0%, transparent 19%, transparent 58%, rgba(0,0,0,.64) 100%),
      linear-gradient(90deg, rgba(0,0,0,.38) 0%, transparent 22%, transparent 78%, rgba(0,0,0,.38) 100%); }
  .gr-grain{ opacity:.5; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:200px 200px; }
  .gr-vinh{ background:radial-gradient(116% 84% at 50% 42%, transparent 40%, rgba(0,0,0,.68) 100%); }
`;
const INJECT = `
  for (const s of document.querySelectorAll('.slide')) {
    const mk = (cls, html='') => { const d=document.createElement('div'); d.className=cls; d.innerHTML=html; s.appendChild(d); };
    mk('gr-tex', '<span class="gr-plastic"></span><span class="gr-scratch"></span><span class="gr-fabric"></span>');
    mk('gr-tint'); mk('gr-glow'); mk('gr-shadow'); mk('gr-grain'); mk('gr-vinh');
  }
`;

const html = 'file://' + path.join(__dirname, 'carrossel.html').replace(/\\/g, '/');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: GRADE });
await page.evaluate(INJECT);
await page.waitForTimeout(900);
const n = await page.locator('.slide').count();
for (let i = 0; i < n; i++) {
  await page.locator('.slide').nth(i).screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  console.log(`grade -> slide-${String(i + 1).padStart(2, '0')}.png`);
}
await browser.close();
console.log(`${n} slides (grade final) -> ${outDir}`);
process.exit(0);
