import sharp from '../../../../comercial/coletor/node_modules/sharp/lib/index.js';
import fs from 'fs'; import path from 'path';
const dir = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const files = fs.readdirSync(dir).filter(f=>/^m\d+\.jpeg$/.test(f)).sort();
const cols=5, tw=240, th=300, pad=8, labelH=22;
const rows=Math.ceil(files.length/cols);
const W=cols*(tw+pad)+pad, H=rows*(th+labelH+pad)+pad;
const comps=[];
for(let i=0;i<files.length;i++){
  const buf=await sharp(path.join(dir,files[i])).resize(tw,th,{fit:'cover'}).toBuffer();
  const c=i%cols, r=Math.floor(i/cols);
  const x=pad+c*(tw+pad), y=pad+r*(th+labelH+pad);
  const label=files[i].replace('.jpeg','');
  const svg=Buffer.from(`<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="16" font-family="monospace" font-size="15" fill="#fff">${label}</text></svg>`);
  comps.push({input:buf,left:x,top:y});
  comps.push({input:svg,left:x,top:y+th});
}
await sharp({create:{width:W,height:H,channels:3,background:'#000'}}).composite(comps).png().toFile(path.join(dir,'_sheet.png'));
console.log('ok',W,H);
