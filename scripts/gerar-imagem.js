// gerar-imagem.js — gera foto realista via OpenAI Images API (modelo gpt-image-1).
// Usado pela skill /carrossel (carrossel com foto IA).
//
// Uso:
//   node --env-file=.env scripts/gerar-imagem.js "PROMPT EM INGLÊS" "caminho/saida.png" [tamanho]
//
// tamanho (opcional): 1024x1536 (retrato, padrão p/ capa 4:5) | 1024x1024 | 1536x1024 | auto
//
// Requer OPENAI_API_KEY no .env da raiz.

const [, , prompt, saida, tamanhoArg] = process.argv;

if (!prompt || !saida) {
  console.error('Uso: node --env-file=.env scripts/gerar-imagem.js "PROMPT" "saida.png" [tamanho]');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey.startsWith('sk-cole') || apiKey.length < 20) {
  console.error('ERRO: OPENAI_API_KEY ausente ou não configurada no .env da raiz.');
  process.exit(1);
}

const size = tamanhoArg || '1024x1536';

const fs = await import('fs');
const path = await import('path');

console.log(`Gerando imagem (${size})...`);

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'gpt-image-1',
    prompt,
    size,
    n: 1,
    quality: 'high',
  }),
});

if (!res.ok) {
  const txt = await res.text();
  console.error(`ERRO da API (${res.status}): ${txt.slice(0, 500)}`);
  process.exit(1);
}

const data = await res.json();
const b64 = data?.data?.[0]?.b64_json;
if (!b64) {
  console.error('ERRO: resposta sem imagem.', JSON.stringify(data).slice(0, 300));
  process.exit(1);
}

const dir = path.dirname(saida);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(saida, Buffer.from(b64, 'base64'));
console.log(`Imagem salva em: ${saida}`);
