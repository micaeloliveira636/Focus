import sharp from '../../../../comercial/coletor/node_modules/sharp/lib/index.js';
import fs from 'fs'; import path from 'path';
const dir = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
// pares por cena (corte 4:5 central como vai aparecer)
const groups=[['s3',['m01','m16']],['s4',['m02','m17']],['s5',['m03','m18']],['s6',['m04','m19']],['s7',['m05','m20']]];
const tw=300, th=375, pad=10, labelH=24;
const flat=[]; groups.forEach(([s,arr])=>arr.forEach(m=>flat.push([s,m])));
const cols=2; // par lado a lado por linha = cena
const rows=groups.length;
const W=cols*(tw+pad)+pad, H=rows*(th+labelH+pad)+pad;
const comps=[];
for(let r=0;r<groups.length;r++){
  const [s,arr]=groups[r];
  for(let c=0;c<arr.length;c++){
    const m=arr[c];
    const buf=await sharp(path.join(dir,m+'.jpeg')).resize(tw,th,{fit:'cover',position:'centre'}).toBuffer();
    const x=pad+c*(tw+pad), y=pad+r*(th+labelH+pad);
    comps.push({input:buf,left:x,top:y});
    const svg=Buffer.from(`<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="17" font-family="monospace" font-size="15" fill="#9B5FE0">${s} · ${m}</text></svg>`);
    comps.push({input:svg,left:x,top:y+th});
  }
}
await sharp({create:{width:W,height:H,channels:3,background:'#000'}}).composite(comps).png().toFile(path.join(dir,'_sheet2.png'));
console.log('ok');
