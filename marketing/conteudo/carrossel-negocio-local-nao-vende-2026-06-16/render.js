// render.js — tira screenshot 1080x1350 de cada .slide do carrossel.html
// Reutiliza o playwright-core de comercial/coletor (via NODE_PATH ou require resolvido aqui).
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
// resolve o playwright-core já instalado no coletor
const pwPath = path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core');
const { chromium } = require(pwPath);

const html = 'file://' + path.join(__dirname, 'carrossel.html').replace(/\\/g, '/');
const outDir = path.join(__dirname, 'instagram');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000); // garante fontes carregadas

const n = await page.locator('.slide').count();
for (let i = 0; i < n; i++) {
  const file = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.locator('.slide').nth(i).screenshot({ path: file });
  console.log(`slide-${String(i + 1).padStart(2, '0')}.png`);
}

await browser.close();
console.log(`\n${n} slides → ${outDir}`);
process.exit(0);
