import sharp from '../../../../comercial/coletor/node_modules/sharp/lib/index.js';
import path from 'path'; import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
const base = path.resolve(dir,'..');
const picks={s1:'m14',s2:'m15',s3:'m01',s4:'m02',s5:'m03',s6:'m04',s7:'m05'};
for(const [s,m] of Object.entries(picks)){
  const src=path.join(dir,m+'.jpeg');
  for(const out of ['pecas-meta','pecas']){
    await sharp(src).png().toFile(path.join(base,out,s+'.png'));
  }
  console.log(s,'<-',m);
}
