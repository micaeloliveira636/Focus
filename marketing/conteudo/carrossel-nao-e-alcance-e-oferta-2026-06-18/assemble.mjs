import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharp = require(path.resolve(__dirname, '..', '..', '..', 'comercial', 'coletor', 'node_modules', 'sharp', 'lib', 'index.js'));
const DL = path.join(process.env.HOME, 'Downloads');

// GPT (png 4:5) -> copia direto ; Meta (jpeg 9:16) -> converte
const jobs = [
  ['gpt', 'ChatGPT Image 18 de jun. de 2026, 17_01_30.png', 's1'],
  ['meta', 'a-real-vintage-pa-amplifier-and-speaker-stack-on-a.jpeg', 's2'],
  ['gpt', 'ChatGPT Image 18 de jun. de 2026, 17_24_57.png', 's3'],
  ['meta', 'a-real-vintage-illuminated-cinema-marquee-sign-on-.jpeg', 's5'],
  ['gpt', 'ChatGPT Image 18 de jun. de 2026, 17_28_32.png', 's6'],
  ['meta', 'a-real-vintage-conical-metal-public-address-horn-m.jpeg', 's7'],
];
for (const [, file, s] of jobs) {
  await sharp(path.join(DL, file)).png().toFile(path.join(__dirname, 'pecas', `${s}.png`));
  console.log(`${s} <- ${file.slice(0, 28)}`);
}
process.exit(0);
