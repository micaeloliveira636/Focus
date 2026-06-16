// dossie-pdf.js — renderiza o HTML do dossiê em PDF A4 + previews PNG das páginas.
// Uso: node dossie-pdf.js --slug saara
import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = {};
const a = process.argv.slice(2);
for (let i = 0; i < a.length; i++) if (a[i].startsWith('--')) { args[a[i].slice(2)] = a[i + 1]; i++; }
const slug = args.slug || 'saara';

const dir = path.join(__dirname, 'saidas', `dossie-${slug}`);
const html = path.join(dir, `dossie-${slug}.html`);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.goto('file://' + html.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// PDF A4
await page.pdf({
  path: path.join(dir, `dossie-${slug}.pdf`),
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});
console.log(`PDF → dossie-${slug}.pdf`);

// previews PNG por página
const secs = await page.locator('.pagina').count();
for (let i = 0; i < secs; i++) {
  await page.locator('.pagina').nth(i).screenshot({ path: path.join(dir, `preview-p${i + 1}.png`) });
  console.log(`preview → preview-p${i + 1}.png`);
}

await browser.close();
process.exit(0);
