/* Tour controller: drives the 3D engine for each page of the swipeable experience */
import { createEngine } from './engine.js';

const $ = (s, r = document) => r.querySelector(s);

export function initStory(){
  const stage = $('#stage'), canvas = $('#scene'), loader = $('#loader');
  let E;
  try {
    const t = document.createElement('canvas'); if (!(t.getContext('webgl2') || t.getContext('webgl'))) throw new Error('no webgl');
    // phones, tablets (incl. iPadOS which reports as Mac) and low-memory devices get the lighter render path
    const touch = navigator.maxTouchPoints > 1 || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
    E = createEngine(canvas, {low: touch || Math.min(innerWidth, innerHeight) < 600 || (navigator.deviceMemory && navigator.deviceMemory < 4)});
  } catch (e){ console.warn(e); loader.classList.add('gone'); return null; }
  loader.classList.add('gone');
  E.on('lost', () => { loader.innerHTML = '<span>The 3D view was paused by your device.</span><button class="btn btn-primary btn-sm" onclick="location.reload()">Reload</button>'; loader.classList.remove('gone'); });

  const pinsEl = $('#hotspots'), fade = $('#xfade');
  let key = null, phase = -1, showPins = false;
  const sideMQ = matchMedia('(orientation: landscape) and (max-height: 560px)');
  // keep the problem in the upper-middle of the screen, clear of the caption at the bottom
  const lift = () => sideMQ.matches ? .06 : stage.clientHeight > stage.clientWidth ? .15 : .1;
  // desktop & landscape phones: caption column on the left, scene shifted right
  const wide = () => stage.clientWidth >= 1024 || sideMQ.matches;
  const side = () => wide() ? 'left' : 'bottom';
  new ResizeObserver(() => { if (key) E.setPanel(true, side(), lift()); }).observe(stage);

  /* numbered pins on the summary page */
  const pins = DEFECTS.map((d, i) => {
    const el = document.createElement('div'); el.className = 'pin hidden'; el.style.setProperty('--c', CAT[d.cat].color);
    el.innerHTML = `<span class="pin-n">${i + 1}</span><span class="pin-l">${d.short}</span>`; pinsEl.appendChild(el); return el;
  });
  const ring = document.createElement('div'); ring.className = 'focus-ring'; ring.innerHTML = '<i></i>'; pinsEl.appendChild(ring);
  E.on('frame', () => {
    DEFECTS.forEach((d, i) => { const p = E.project(E.focus(d.id)); pins[i].style.transform = `translate(${p.x}px,${p.y}px)`; pins[i].classList.toggle('hidden', !showPins || !p.vis); });
    if (key && DEFECTS.some(d => d.id === key) && phase === 0){ const p = E.project(E.focus(key)); ring.style.transform = `translate(${p.x}px,${p.y}px)`; ring.classList.toggle('show', p.vis); }
    else ring.classList.remove('show');
  });

  let fadeT1, fadeT2;
  function crossfade(fn, slow){
    clearTimeout(fadeT1); clearTimeout(fadeT2);
    try { fade.src = canvas.toDataURL('image/jpeg', .82); fade.classList.remove('out', 'slow'); fade.classList.add('on'); if (slow) fade.classList.add('slow'); } catch (e){}
    fn(); fadeT1 = setTimeout(() => { fade.classList.add('out'); fadeT2 = setTimeout(() => fade.classList.remove('on', 'out', 'slow'), slow ? 950 : 750); }, slow ? 120 : 60);
  }

  function activate(k){
    if (k === key) return; key = k; phase = -1;
    E.clearAction(); E.age(k, 0);
    if (k === 'intro' || k === 'outro'){
      showPins = k === 'outro';
      crossfade(() => { E.setAll('bad'); E.goOverview(true); E.setPanel(true, side(), lift() * .7); E.setAuto(true); }, true);
      return;
    }
    showPins = false;
    // dissolve between rooms instead of flying the camera through walls
    crossfade(() => { E.setAll('bad'); E.goView(k, true); E.setPanel(true, side(), lift()); }, true);
  }
  function setPhase(ph){
    if (!DEFECTS.some(d => d.id === key) || ph === phase) return;
    const d = DEFECTS.find(x => x.id === key), a = d.action, prev = phase; phase = ph;
    if (ph < 2 && E.state[key] !== 'bad'){ E.clearAction(); crossfade(() => E.setDefect(key, 'bad')); }
    if (ph === 0) E.clearAction();
    if (ph === 1){
      E.clearAction();
      if (a.type === 'tap') E.autoTap(); else if (a.type === 'moisture') E.autoMoist(); else if (a.type === 'flood') E.flood(key); else E.startAction(a.type);
    }
    if (ph === 2){ E.clearAction(); E.age(key, 0); if (prev !== 2) crossfade(() => E.setDefect(key, 'good')); }
  }
  return {engine: E, activate, setPhase, age: f => key && E.age(key, f), parallax: (x, y) => E.setParallax(x, y)};
}
