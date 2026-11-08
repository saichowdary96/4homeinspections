import { initStory } from './story.js';

let resolve; const ready = new Promise(r => resolve = r);
window.HL = {ready, story: null, engine: null};
function boot(){
  let v = null;
  try { v = initStory(); } catch (e){ console.error(e); }
  window.HL.story = v; window.HL.engine = v && v.engine; resolve(v);
}
// let the page paint first, then build the 3D home
// (after first paint & when the browser is idle, so phones stay responsive while the page loads)
const later = () => ('requestIdleCallback' in window) ? requestIdleCallback(boot, {timeout: 900}) : setTimeout(boot, 120);
if (document.readyState === 'complete') later(); else addEventListener('load', later, {once: true});
