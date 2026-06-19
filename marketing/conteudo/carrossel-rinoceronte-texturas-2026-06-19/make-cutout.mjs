import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'sharp', 'lib', 'index.js'));

// recorta o ceu (claro) deixando transparente; rinoceronte/chao ficam opacos.
// como o cutout fica POR CIMA do mesmo bg, area transparente revela pixel identico:
// so muda onde a palavra estiver entre o bg e o cutout (ceu mostra texto, chifre tampa).
const { data, info } = await sharp(path.join(__dirname, 'rino-src.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const ch = info.channels; // 4
const T_HI = 192, T_LO = 162; // rampa de luminancia (mais alta: mantem o lombo iluminado opaco, tira so o ceu)
for (let i = 0; i < data.length; i += ch) {
  const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  let a;
  if (lum >= T_HI) a = 0;
  else if (lum <= T_LO) a = 255;
  else a = Math.round(255 * (T_HI - lum) / (T_HI - T_LO));
  data[i + 3] = a;
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toFile(path.join(__dirname, 'rino-cutout.png'));
console.log('cutout pronto', info.width, info.height);
process.exit(0);
