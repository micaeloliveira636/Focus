// Renderiza a versão A/B: troca a pasta de imagens (pecas-gpt / pecas-meta / pecas)
// Uso: node render-ab.js <pasta-imagens> <sufixo-saida>
//   node render-ab.js pecas-gpt  gpt   -> instagram-gpt/slide-XX.png
//   node render-ab.js pecas-meta meta  -> instagram-meta/slide-XX.png
//   node render-ab.js pecas      final -> instagram/slide-XX.png
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pwPath = path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core');
const { chromium } = require(pwPath);

const srcFolder = process.argv[2] || 'pecas';
const suffix = process.argv[3] || 'final';
const outDir = path.join(__dirname, suffix === 'final' ? 'instagram' : `instagram-${suffix}`);

// lê o html e reescreve pecas/ -> pasta escolhida
let htmlTxt = fs.readFileSync(path.join(__dirname, 'carrossel.html'), 'utf8');
if (srcFolder !== 'pecas') htmlTxt = htmlTxt.replace(/pecas\//g, `${srcFolder}/`);
const tmp = path.join(__dirname, `.carrossel-${suffix}.html`);
fs.writeFileSync(tmp, htmlTxt);

fs.mkdirSync(outDir, { recursive: true });
const html = 'file://' + tmp.replace(/\\/g, '/');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const n = await page.locator('.slide').count();
for (let i = 0; i < n; i++) {
  await page.locator('.slide').nth(i).screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  console.log(`[${suffix}] slide-${String(i + 1).padStart(2, '0')}.png`);
}
await browser.close();
fs.unlinkSync(tmp);
console.log(`${n} slides (${srcFolder}) -> ${outDir}`);
process.exit(0);
