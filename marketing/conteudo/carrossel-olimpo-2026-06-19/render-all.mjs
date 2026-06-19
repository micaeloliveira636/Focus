import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core'));

const file = process.argv[2] || 'carrossel.html';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await page.goto('file:///' + path.join(__dirname, file).replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
fs.mkdirSync(path.join(__dirname, 'mock'), { recursive: true });
const n = await page.locator('.slide').count();
for (let i = 0; i < n; i++) {
  await page.locator('.slide').nth(i).screenshot({ path: path.join(__dirname, 'mock', `s${i + 1}.png`) });
  console.log(`s${i + 1}.png`);
}
await browser.close();
process.exit(0);
