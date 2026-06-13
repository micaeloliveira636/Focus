import { chromium } from 'playwright-core';
import { pathToFileURL } from 'url';
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname,'saidas','dossie-saara');
const userDataDir = path.join(__dirname, '.perfil-chrome');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// 1) amostra a cor roxa do logo
const b = await chromium.launch({ channel:'chrome', headless:true });
const pg = await b.newPage({ viewport:{width:400,height:400} });
await pg.setContent(`<canvas id="c" width="382" height="352"></canvas>`);
const hex = await pg.evaluate(async ()=>{
  const img = new Image();
  await new Promise(r=>{ img.onload=r; img.src='file:///C:/Users/Pichau/Focus/identidade/logo.png'; });
  const c=document.getElementById('c'); c.width=img.width; c.height=img.height;
  const ctx=c.getContext('2d'); ctx.drawImage(img,0,0);
  const d=ctx.getImageData(0,0,img.width,img.height).data;
  let best=null,bestS=0;
  for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],bl=d[i+2];
    // procura roxo saturado: r e b altos, g baixo
    const sat=(r+bl)-2*g; if(sat>bestS && r>80 && bl>100 && g<r){bestS=sat;best=[r,g,bl];}}
  const h=best?('#'+best.map(x=>x.toString(16).padStart(2,'0')).join('')):'?';
  return h;
});
console.log('ROXO_AMOSTRADO='+hex);
await b.close();

// 2) captura anúncios de concorrentes do nicho
const ctx = await chromium.launchPersistentContext(userDataDir, {
  channel:'chrome', headless:true, viewport:{width:1280,height:1700},
  ignoreDefaultArgs:['--enable-automation'], args:['--disable-blink-features=AutomationControlled'], locale:'pt-BR'
});
async function cap(q, arq){
  const p = await ctx.newPage();
  await p.goto(`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(q)}&search_type=keyword_unordered&media_type=all`,{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(8000);
  await p.screenshot({path:path.join(out,arq), fullPage:false});
  console.log('cap '+q+' -> '+arq); await p.close();
}
await cap('alongamento de cílios', 'ads-q1.png');
await sleep(2500);
await cap('extensão de cílios zona norte', 'ads-q2.png');
await ctx.close(); process.exit(0);
