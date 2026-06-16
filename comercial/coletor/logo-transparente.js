// logo-transparente.js — tira o fundo escuro da logo da Focus.
// A logo é traço roxo brilhante sobre fundo quase-preto texturizado.
// Em vez de "recortar", uso alpha = brilho do pixel (blend tipo screen):
// fundo escuro some, o traço roxo brilha sobre qualquer fundo.
//
// Uso: node logo-transparente.js
// Entrada: ../../identidade/logo.png
// Saída:   ../../identidade/logo-transp.png  (master reutilizável)
//          saidas/dossie-saara/logo.png       (sobrescreve a do dossiê)

import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(__dirname, '..', '..');
const entrada = path.join(raiz, 'identidade', 'logo.png');

const b64 = fs.readFileSync(entrada).toString('base64');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();

const dataUrl = await page.evaluate(async (b64) => {
  const img = new Image();
  img.src = 'data:image/png;base64,' + b64;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const d = ctx.getImageData(0, 0, c.width, c.height);
  const p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], g = p[i + 1], b = p[i + 2];
    const maxc = Math.max(r, g, b);
    // brilho vira opacidade; ruído quase-preto (<14) some de vez
    let a = maxc <= 14 ? 0 : Math.min(255, (maxc - 14) * 1.6);
    p[i + 3] = a;
  }
  ctx.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}, b64);

await browser.close();

const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
const saidaMaster = path.join(raiz, 'identidade', 'logo-transp.png');
const saidaDossie = path.join(__dirname, 'saidas', 'dossie-saara', 'logo.png');
fs.writeFileSync(saidaMaster, buf);
fs.writeFileSync(saidaDossie, buf);
console.log('Logo transparente salva em:');
console.log('  ' + saidaMaster);
console.log('  ' + saidaDossie);
process.exit(0);
