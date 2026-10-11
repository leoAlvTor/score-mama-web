const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE});
 const out=__dirname;
 const base=process.env.PREVIEW_BASE_URL;assert(base,'Set PREVIEW_BASE_URL to the running preview');
 const errors=[];
 for(const width of [390,1280]){
  const page=await browser.newPage({viewport:{width,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['index.html','guia.html']){
   await page.goto(`${base}/${route}`,{waitUntil:'networkidle'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} overflow ${width}`);
   await page.screenshot({path:`${out}/${route==='index.html'?'inicio':'guia'}-${width}.png`});
   if(route==='guia.html'){
    if(width===390){assert(!(await page.locator('.guide-index details').getAttribute('open')));await page.locator('.guide-index summary').click();}
    await page.locator('.guide-index a[href="#atenciones"]').click();
    await page.waitForTimeout(500);
    await page.screenshot({path:`${out}/atenciones-${width}.png`});
    const link=page.locator('#atenciones [data-enlarge]').first();await link.click();
    assert(await page.locator('#image-dialog').evaluate(d=>d.open));
    await page.locator('#image-zoom').click();assert(await page.locator('#image-dialog').evaluate(d=>d.classList.contains('is-zoomed')));
    await page.screenshot({path:`${out}/ampliacion-${width}.png`});
    await page.keyboard.press('Escape');assert(!(await page.locator('#image-dialog').evaluate(d=>d.open)));
    assert(await link.evaluate(e=>e===document.activeElement));
    for(const id of ['pendientes','compartir','buscar']){
      await page.goto(`${base}/guia.html#${id}`,{waitUntil:'networkidle'});await page.waitForTimeout(1200);
      await page.screenshot({path:`${out}/${id}-${width}.png`});
    }
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% overflow');
    await page.screenshot({path:`${out}/guia-text200-${width}.png`});
   }
  }
  await page.close();
 }
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});
 await nojs.goto(`${base}/guia.html`);assert(await nojs.locator('.nav-links a[href="guia.html"]').isVisible());
 await nojs.locator('.guide-index a[href="#buscar"]').click();assert(nojs.url().endsWith('#buscar'));
 await nojs.locator('#buscar [data-enlarge]').first().click();assert(nojs.url().endsWith('.webp'));
 await nojs.goto(`${base}/index.html`);assert(await nojs.locator('noscript a').count()===3);
 await nojs.close();
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(`${base}/index.html`,{waitUntil:'networkidle'});
 await reduced.locator('.feature-video').first().scrollIntoViewIfNeeded();await reduced.waitForTimeout(500);
 assert(await reduced.locator('.feature-video').evaluateAll(v=>v.every(e=>e.paused)));
 // Drive observer boundaries using the real script: a video dropping from 70% to 40% must pause.
 const mock=await browser.newPage();await mock.addInitScript(()=>{
  window.observers=[];window.IntersectionObserver=class {constructor(cb,opts){this.cb=cb;this.opts=opts;window.observers.push(this);}observe(){}unobserve(){}};
  HTMLMediaElement.prototype.load=function(){};HTMLMediaElement.prototype.play=function(){this.dataset.played='yes';return Promise.resolve()};HTMLMediaElement.prototype.pause=function(){this.dataset.played='no'};
 });
 await mock.goto(`${base}/index.html`);
 const transition=await mock.evaluate(()=>{
  const video=document.querySelector('.feature-video');const player=observers.find(o=>o.opts.threshold);
  player.cb([{target:video,isIntersecting:true,intersectionRatio:.7}]);const started=video.dataset.played;
  player.cb([{target:video,isIntersecting:true,intersectionRatio:.4}]);return [started,video.dataset.played];
 });assert.deepEqual(transition,['yes','no']);
 assert.deepEqual(errors,[]);
 await browser.close();fs.writeFileSync(`${out}/browser-checks.json`,JSON.stringify({passed:true,widths:[390,1280],textScale:'200%',noJavaScript:true,dialogEscapeAndFocus:true,reducedMotion:true,videoThresholdPause:true,errors},null,2));
 console.log('PASS: mobile/desktop, anchors, zoom/Escape/focus, 200% text, no JS, reduced motion and video pause.');
})().catch(e=>{console.error(e);process.exit(1)});
