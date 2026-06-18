import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'sharp', 'lib', 'index.js'));

const src = path.join(process.env.HOME, 'Downloads', 'ChatGPT Image 18 de jun. de 2026, 12_55_36.png');
const W = 1854, H = 848;
const sliceW = Math.floor(W / 3);      // 618
const sliceH = Math.round(sliceW * 1.25); // 772 (4:5)
const top = Math.floor((H - sliceH) / 2); // 38
fs.mkdirSync(path.join(__dirname, 'slice-test'), { recursive: true });

for (let i = 0; i < 3; i++) {
  const left = i * sliceW;
  await sharp(src)
    .extract({ left, top, width: sliceW, height: sliceH })
    .resize(1080, 1350, { kernel: 'lanczos3' })
    .png().toFile(path.join(__dirname, 'slice-test', `slice-${i + 1}.png`));
  console.log(`slice-${i + 1}: x=${left} w=${sliceW} h=${sliceH}`);
}
process.exit(0);
