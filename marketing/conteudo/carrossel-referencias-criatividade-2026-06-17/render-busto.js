// Renderiza a versão de BUSTOS (arquivos individuais que usam pecas/sXX-cena.png).
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
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
for (let i = 0; i < files.length; i++) {
  const html = 'file://' + path.join(__dirname, files[i]).replace(/\\/g, '/');
  await page.goto(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const out = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.locator('.slide').first().screenshot({ path: out });
  console.log(`${files[i]} -> slide-${String(i + 1).padStart(2, '0')}.png`);
}
await browser.close();
console.log(`${files.length} slides -> ${outDir}`);
process.exit(0);
