import { chromium } from 'playwright-core';
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPosts = path.join(__dirname,'..','..','identidade','referencias','capturas-2026-06-17','posts');
const ctx = await chromium.launchPersistentContext(path.join(__dirname,'.perfil-chrome'),{channel:'chrome',headless:true,viewport:{width:1320,height:1500},deviceScaleFactor:2,ignoreDefaultArgs:['--enable-automation'],args:['--disable-blink-features=AutomationControlled'],locale:'pt-BR'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function box(page){return await page.evaluate(()=>{
  const vw=innerWidth,vh=innerHeight;
  const imgs=[...document.querySelectorAll('article img, main img')].filter(im=>/cdninstagram|fbcdn/.test(im.currentSrc||im.src||'')).map(im=>{const r=im.getBoundingClientRect();const vis=Math.max(0,Math.min(r.right,vw)-Math.max(r.left,0))*Math.max(0,Math.min(r.bottom,vh)-Math.max(r.top,0));return{x:r.x,y:r.y,w:r.width,h:r.height,vis};})
   .filter(r=>r.w>250&&r.h>250&&r.y<660)  // SÓ região do post (acima de comentários/sugestões)
   .sort((p,q)=>q.vis-p.vis);
  return imgs[0]||null;});}
async function next(page){for(const l of['Avançar','Next','Próximo']){const b=page.locator(`button[aria-label="${l}"], [aria-label="${l}"][role="button"]`).first();if(await b.count().catch(()=>0))return b;}return null;}
for(const code of process.argv.slice(2)){
  const dir=path.join(outPosts,code); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
  const page=await ctx.newPage();
  await page.goto(`https://www.instagram.com/p/${code}/`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(5000);
  for(const txt of['Agora não','Not Now']){const b=page.locator(`button:has-text("${txt}")`).first();if(await b.count().catch(()=>0)){await b.click().catch(()=>{});await page.waitForTimeout(400);}}
  let n=0; for(let i=0;i<20;i++){await page.waitForTimeout(900);const b=await box(page);n++;const f=path.join(dir,`slide-${String(n).padStart(2,'0')}.png`);
    if(b){const clip={x:Math.max(0,b.x),y:Math.max(0,b.y),width:Math.min(b.w,1320-Math.max(0,b.x)),height:Math.min(b.h,1500-Math.max(0,b.y))};await page.screenshot({path:f,clip}).catch(()=>page.screenshot({path:f}));}else await page.screenshot({path:f});
    const nx=await next(page); if(!nx)break; await nx.click().catch(()=>{}); await page.waitForTimeout(700);}
  console.log(`${code}: ${n} slides`); await page.close(); await sleep(2500);
}
await ctx.close(); process.exit(0);
