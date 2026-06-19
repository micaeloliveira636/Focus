import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'sharp', 'lib', 'index.js'));

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; }
    h /= 6;
  }
  return [h * 360, s, l];
}
function hue2rgb(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q - p) * 6 * t; if (t < 1/2) return q; if (t < 2/3) return p + (q - p) * (2/3 - t) * 6; return p; }
function hslToRgb(h, s, l) {
  h /= 360; let r, g, b;
  if (s === 0) { r = g = b = l; }
  else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q; r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1/3); }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const { data, info } = await sharp(path.join(__dirname, 'astro-src.png')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
let hit = 0;
for (let i = 0; i < data.length; i += ch) {
  const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
  // so o teal/ciano/azul saturado (deixa laranja, verde, branco/cinza)
  if (s > 0.12 && h >= 150 && h <= 255) {
    const [nr, ng, nb] = hslToRgb(266, 0.60, l); // roxo Focus, mantem a luminancia
    data[i] = nr; data[i + 1] = ng; data[i + 2] = nb; hit++;
  }
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toFile(path.join(__dirname, 'astro-purple.png'));
console.log('pixels recoloridos:', hit, '/', (data.length / ch));
process.exit(0);
