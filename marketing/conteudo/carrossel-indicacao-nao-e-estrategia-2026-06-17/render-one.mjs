import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'playwright-core'));

const file = process.argv[2] || 'capa.html';
const out = process.argv[3] || ('mock/' + file.replace('.html', '.png'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await page.goto('file:///' + path.join(__dirname, file).replace(/\\/g, '/'));
await page.waitForTimeout(900);
const el = await page.$('.slide');
await el.screenshot({ path: path.join(__dirname, out) });
await browser.close();
console.log('render:', out);
process.exit(0);
