// remove-bg.js — recorta o sujeito (remove fundo) de uma imagem. Roda local.
// Uso: node remove-bg.js <entrada.png> <saida.png>
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
const [, , inp, out] = process.argv;
if (!inp || !out) { console.log('Uso: node remove-bg.js <entrada> <saida>'); process.exit(1); }
console.log('Removendo fundo de', inp, '...');
const blob = await removeBackground(inp);
const buf = Buffer.from(await blob.arrayBuffer());
fs.writeFileSync(out, buf);
console.log('Salvo:', out);
process.exit(0);
