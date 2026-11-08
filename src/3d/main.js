import { initStory, isLowEnd } from './story.js';
import * as TX from './tex.js';

let resolve; const ready = new Promise(r => resolve = r);
window.HL = {ready, story: null, engine: null};
function boot(){
  let v = null;
  try { v = initStory(); } catch (e){ console.error(e); }
  window.HL.story = v; window.HL.engine = v && v.engine; resolve(v);
}
// Rasterise the heavy textures in a worker first, so the second or so of per-pixel
// work happens off the main thread and the page stays responsive while it runs.
// The scale must match what the engine will use, or the prewarmed pixels are wasted.
// prewarm() always resolves — on any failure the textures are built synchronously.
function start(){
  try {
    TX.setTexScale(isLowEnd() ? .6 : 1);
    TX.prewarm().then(boot, boot);
  } catch (e){ boot(); }
}
// let the page paint first, then build the 3D home
// (after first paint & when the browser is idle, so phones stay responsive while the page loads)
const later = () => ('requestIdleCallback' in window) ? requestIdleCallback(start, {timeout: 900}) : setTimeout(start, 120);
if (document.readyState === 'complete') later(); else addEventListener('load', later, {once: true});
