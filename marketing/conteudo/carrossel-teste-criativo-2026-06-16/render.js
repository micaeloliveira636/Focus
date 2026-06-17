import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pwPath = path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core');
const { chromium } = require(pwPath);
const html = 'file://' + path.join(__dirname, 'carrossel.html').replace(/\\/g, '/');
const outDir = path.join(__dirname, 'instagram');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const n = await page.locator('.slide').count();
for (let i = 0; i < n; i++) {
  await page.locator('.slide').nth(i).screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
  console.log(`slide-${String(i + 1).padStart(2, '0')}.png`);
}
await browser.close();
console.log(`${n} slides → ${outDir}`);
process.exit(0);
