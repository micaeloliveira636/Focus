// logo-roxo.js — símbolo do lobo em ROXO (#692ABF), fundo transparente. Pra fundos claros.
import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, '..', '..');
const b64 = fs.readFileSync(path.join(raiz, 'identidade', 'logo-simbolo.png')).toString('base64');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const dataUrl = await page.evaluate(async (b64) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height); const p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const maxc = Math.max(p[i], p[i+1], p[i+2]);
    const a = maxc <= 60 ? 0 : Math.min(255, (maxc - 60) * 2.8); // threshold alto mata o fundo
    p[i]=105; p[i+1]=42; p[i+2]=191; p[i+3]=a; // roxo Focus
  }
  ctx.putImageData(d, 0, 0); return c.toDataURL('image/png');
}, b64);
await browser.close();
fs.writeFileSync(path.join(raiz, 'identidade', 'logo-simbolo-roxo.png'), Buffer.from(dataUrl.split(',')[1], 'base64'));
console.log('Salvo: identidade/logo-simbolo-roxo.png');
process.exit(0);
