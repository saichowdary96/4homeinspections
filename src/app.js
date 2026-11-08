/* =========================================================
   Page logic — a single, linear journey:
   hero quote (answers what / why / price) → scroll story → what you get → book
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 1 - Math.pow(1 - t, 3);
function tween(ms, fn, done){ const t0 = performance.now(); const step = now => { const t = Math.min(1, (now - t0) / ms); fn(ease(t)); if (t < 1) requestAnimationFrame(step); else if (done) done(); }; requestAnimationFrame(step); }
const lakh = n => n >= 100000 ? '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L' : '₹' + Math.round(n / 1000) + 'k';

$$('[data-i]').forEach(el => { el.innerHTML = icon(el.dataset.i); el.style.display = 'inline-flex'; });

/* ---------- rendered-image queue (all imagery comes from the same 3D engine) ---------- */
const SHOTS = {}, shotQ = []; let shotBusy = false, GL = null;
function queueShot(key, opts, cb, prio){
  if (SHOTS[key]){ cb && cb(SHOTS[key]); return; }
  const ex = shotQ.find(t => t.key === key);
  if (ex){ cb && ex.cbs.push(cb); if (prio){ shotQ.splice(shotQ.indexOf(ex), 1); shotQ.unshift(ex); } return; }
  const t = {key, opts, cbs: cb ? [cb] : []}; prio ? shotQ.unshift(t) : shotQ.push(t); pump();
}
function pump(){
  if (shotBusy || !shotQ.length || !GL) return;
  const sr = document.getElementById('stage').getBoundingClientRect();
  if (sr.top < innerHeight && sr.bottom > 0){ setTimeout(pump, 700); return; } // never hitch the live 3D story
  shotBusy = true;
  setTimeout(() => { const t = shotQ.shift(); try { const r = t.opts.tool ? {url: HL.engine.toolShot(t.opts.tool)} : HL.engine.shot(t.opts); SHOTS[t.key] = r; t.cbs.forEach(f => f(r)); } catch (e){ console.error(e); } shotBusy = false; pump(); }, 40);
}
const glReady = HL.ready.then(v => { GL = !!v; if (!GL) document.body.classList.add('nogl'); pump(); return GL; });

/* ---------- in-view helper (IntersectionObserver + scroll fallback) ---------- */
const viewQ = [];
function onView(el, fn, frac = .88){
  const item = {el, fn, frac, done: false};
  item.fire = () => { if (item.done) return; item.done = true; fn(el); }; viewQ.push(item);
  if ('IntersectionObserver' in window){ const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); item.fire(); } }, {threshold: .12}); io.observe(el); }
  checkView();
}
function checkView(){ const h = innerHeight; for (const it of viewQ){ if (it.done) continue; const r = it.el.getBoundingClientRect(); if (r.top < h * it.frac && r.bottom > 0 && (r.width || r.height)) it.fire(); } }
addEventListener('scroll', checkView, {passive: true}); addEventListener('resize', checkView); addEventListener('load', checkView); setInterval(checkView, 700);
$$('.rv').forEach(el => onView(el, x => x.classList.add('in')));

/* ---------- nav + progress ---------- */
const nav = $('#nav'), prog = $('#progress');
addEventListener('scroll', () => { nav.classList.toggle('scrolled', scrollY > 30); prog.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%'; }, {passive: true});

/* ---------- auto-hiding chrome: out of the way while reading, back on scroll-up ---------- */
(function(){
  let lastY = scrollY;
  addEventListener('scroll', () => { const y = scrollY, dy = y - lastY; if (Math.abs(dy) > 6){ document.body.classList.toggle('navhide', dy > 0 && y > 120); lastY = y; } }, {passive: true});
})();

/* ---------- personalised plan: one tap updates every price on the page ---------- */
function renderPlan(){
  const p = planCalc(PLAN);
  const val = {fee: inr(p.fee), hi: lakh(p.hi), lo: lakh(p.lo), defects: p.defects, hours: p.hours, label: p.label, payer: p.payer, caughtVal: p.caughtVal, caughtNote: p.caughtNote, payerLong: p.payerLong};
  $$('[data-plan]').forEach(el => { const v = val[el.dataset.plan]; if (v !== undefined && el.textContent !== String(v)){ el.textContent = v; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } });
}
[['#planType', 'type', v => v], ['#planBhk', 'bhk', v => +v]].forEach(([sel, k, f]) => $(sel).addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; $$('button', $(sel)).forEach(x => x.classList.toggle('on', x === b)); PLAN[k] = f(b.dataset.v); renderPlan();
}));
renderPlan();

/* ---------- the tour: one stop per swipe / scroll / arrow key, with an exit at any time ---------- */
(function(){
  const xp = $('#story'), pagesEl = $('#steps'), cap = $('#cap'), capIn = $('#capIn'), sprog = $('#sprog'),
        chips = $('#chips'), holdBtn = $('#hold'), ctrl = $('#xpCtrl'), nextBtn = $('#xpNext'), fallback = $('#stageFallback');
  const PAGES = ['intro', ...STORY, 'outro'];
  const TL = [0, 1500, 6400], DUR = 7800;           // problem → proof → fixed (ms)
  const allLo = DEFECTS.reduce((s, d) => s + d.cost[0], 0), allHi = DEFECTS.reduce((s, d) => s + d.cost[1], 0);
  const ROOMN = {living: 'Living room', bedroom: 'Bedroom', bathroom: 'Bathroom', kitchen: 'Kitchen', utility: 'Entrance', balcony: 'Balcony'};
  const LATER = {damp: 'Mould behind the wardrobe; plaster crumbling off the wall.', window: 'The frame swells and the wall below stains and flakes.', pipe: 'Tiles lift and the neighbour’s wall turns damp too.', slope: 'Water seeps into the flat below — the whole bathroom has to be redone.', socket: 'The scorching spreads; one fault could make an appliance live.', tiles: 'Cracks spread across the room as more tiles fail.', crack: 'The crack widens and races towards the ceiling.'};
  pagesEl.innerHTML = PAGES.map(k => `<div class="xp-page" data-step="${k}"></div>`).join('');
  sprog.innerHTML = STORY.map(() => '<i><b></b></i>').join('');
  chips.innerHTML = ['Problem', 'Proof', 'Fixed'].map((t, i) => `<button data-ph="${i}"><i></i>${t}</button>`).join('');
  $$('[data-i]', xp).forEach(el => { if (!el.innerHTML) el.innerHTML = icon(el.dataset.i); });
  const kin = t => t.split(' ').map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
  const vib = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e){} };

  function captionHTML(k, ph, later){
    if (k === 'intro') return `<span class="k" style="--c:var(--accent)">HomeLens · virtual home inspection</span>
      <h2>${kin('This flat passed its handover check.')}</h2><p>Swipe up to walk through what our inspector found.</p><div class="cue"><i></i>Swipe up</div>`;
    if (k === 'outro') return `<span class="k" style="--c:var(--accent)">Inspection complete</span>
      <h2>${kin('10 hidden defects in a “perfect” flat.')}</h2>
      <p class="cmpl"><span class="bad">If missed: <b>${lakh(allLo)}–${lakh(allHi)}</b></span><span class="good">Inspection: <b data-plan="fee">₹5,500</b></span></p>
      <div class="cap-cta"><a href="#book" class="btn btn-primary">Book my inspection</a><a href="#value" class="btn btn-ghost">What’s included</a></div>`;
    const d = DEFECTS.find(x => x.id === k), c = CAT[d.cat], s = STORY_TXT[k], n = STORY.indexOf(k) + 1;
    if (later) return `<span class="k" style="--c:var(--bad)">${n}/${STORY.length} · 3 years later</span><h2>${d.title}</h2><p>${LATER[k]}</p><p class="cline bad">Repair bill: <b id="laterCost">${lakh(d.cost[0])}</b></p>`;
    if (ph === 0) return `<span class="k" style="--c:${c.color}">${n}/${STORY.length} · ${ROOMN[d.room]}</span><h2>${kin(d.title)}</h2><p>${s.line}</p><p class="cline bad">If missed: <b>${lakh(d.cost[0])}–${lakh(d.cost[1])}</b> · ${s.miss}</p>`;
    if (ph === 1) return `<span class="k" style="--c:var(--warn)">${n}/${STORY.length} · ${s.toolName}</span><h2>${d.title}</h2><p>${s.found}</p>`;
    return `<span class="k" style="--c:var(--good)">${n}/${STORY.length} · ✓ Fixed before handover</span><h2>${d.title}</h2><p>${d.fixText}</p><p class="cline good">Found by inspection: <b data-plan="caughtVal">₹0</b> · <span data-plan="caughtNote">your builder fixes it</span></p>`;
  }
  let capKey = '', capT = null;
  function setCaption(k, ph, later){
    const ck = k + ph + (later ? 'L' : ''); if (ck === capKey) return; capKey = ck;
    cap.classList.add('swap'); clearTimeout(capT);
    capT = setTimeout(() => { capIn.innerHTML = captionHTML(k, ph, later); renderPlan(); cap.classList.remove('swap'); }, capIn.innerHTML ? 200 : 0);
  }

  let idx = -1, key = null, ph = -1, t0 = 0, pausedAt = 0, holding = false, holdF = 0, holdRaf = 0;
  const isDefect = () => STORY.includes(key);
  function setPhase(p){
    if (p === ph) return; ph = p;
    $$('button', chips).forEach((b, i) => { b.classList.toggle('on', i === p); b.classList.toggle('done', i < p); });
    ctrl.classList.toggle('fixed', p === 2);
    setCaption(key, p);
    if (HL.story) HL.story.setPhase(p);
    else if (GL === false){ const cat = DEFECTS.find(d => d.id === key).cat; fallback.innerHTML = BA[cat]('s' + cat + p, p < 2); }
    if (p === 1) vib(12);
  }
  function activate(i){
    if (i === idx) return; idx = i; key = PAGES[i]; ph = -1; holding = false;
    xp.dataset.page = key;
    if (HL.story) HL.story.activate(key);
    vib(8);
    const si = STORY.indexOf(key);
    $$('i', sprog).forEach((seg, j) => { seg.firstChild.style.width = (key === 'outro' || j < si ? 100 : 0) + '%'; });
    sprog.classList.toggle('show', si >= 0);
    ctrl.classList.toggle('show', si >= 0);
    nextBtn.classList.toggle('last', key === 'outro');
    if (si >= 0){ t0 = performance.now(); pausedAt = 0; setPhase(0); }
    else { setCaption(key, 0); if (GL === false) fallback.innerHTML = BA.damp('sx', false); }
  }
  // timeline: phases play automatically; the visitor can jump with the chips
  (function tick(now){
    requestAnimationFrame(tick);
    if (!isDefect() || holding) return;
    const el = (pausedAt || now) - t0;
    const p = el < TL[1] ? 0 : el < TL[2] ? 1 : 2;
    if (p !== ph) setPhase(p);
    const seg = $$('i', sprog)[STORY.indexOf(key)]; if (seg) seg.firstChild.style.width = Math.min(100, el / DUR * 100) + '%';
    nextBtn.classList.toggle('nudge', el > DUR);
  })(performance.now());
  chips.addEventListener('click', e => { const b = e.target.closest('[data-ph]'); if (!b || !isDefect()) return; t0 = performance.now() - TL[+b.dataset.ph] - 20; pausedAt = 0; setPhase(+b.dataset.ph); });

  // hold to fast-forward: watch the problem get worse, and the bill grow
  function holdStart(e){
    if (!isDefect() || ph === 2) return; e.preventDefault();
    holding = true; pausedAt = performance.now(); holdBtn.classList.add('down'); setCaption(key, ph, true);
    const d = DEFECTS.find(x => x.id === key), start = performance.now(), f0 = holdF;
    cancelAnimationFrame(holdRaf);
    const step = now => { if (!holding) return; holdF = Math.min(1, f0 + (now - start) / 2200); HL.story && HL.story.age(holdF); holdBtn.style.setProperty('--p', holdF);
      const c = $('#laterCost'); if (c) c.textContent = lakh(d.cost[0] + (d.cost[1] - d.cost[0]) * holdF);
      if (holdF < 1){ if (Math.random() < .08) vib(6); holdRaf = requestAnimationFrame(step); } else vib([20, 40, 20]); };
    holdRaf = requestAnimationFrame(step);
  }
  function holdEnd(){
    if (!holding) return; holding = false; holdBtn.classList.remove('down');
    t0 += performance.now() - pausedAt; pausedAt = 0; setCaption(key, ph);
    cancelAnimationFrame(holdRaf); const start = performance.now(), f0 = holdF;
    const back = now => { holdF = Math.max(0, f0 * (1 - (now - start) / 500)); HL.story && HL.story.age(holdF); holdBtn.style.setProperty('--p', holdF); if (holdF > 0 && !holding) holdRaf = requestAnimationFrame(back); };
    holdRaf = requestAnimationFrame(back);
  }
  holdBtn.addEventListener('pointerdown', holdStart);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => holdBtn.addEventListener(ev, holdEnd));
  holdBtn.addEventListener('contextmenu', e => e.preventDefault());

  // navigation: native scroll-snap does the swiping; buttons + keys for everyone else
  const h = () => xp.clientHeight;
  const go = i => xp.scrollTo({top: Math.max(0, Math.min(PAGES.length - 1, i)) * h(), behavior: 'smooth'});
  function exitTour(){ const v = $('#value'); scrollTo({top: v.getBoundingClientRect().top + scrollY, behavior: 'smooth'}); }
  $('#xpExit').addEventListener('click', exitTour);
  nextBtn.addEventListener('click', () => idx >= PAGES.length - 1 ? exitTour() : go(idx + 1));
  addEventListener('keydown', e => {
    const r = xp.getBoundingClientRect(); if (r.bottom < innerHeight * .5 || r.top > innerHeight * .5) return;
    if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)){ e.preventDefault(); idx >= PAGES.length - 1 ? exitTour() : go(idx + 1); }
    if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)){ e.preventDefault(); go(idx - 1); }
    if (e.key === 'Escape') exitTour();
  });
  let ticking = false;
  function onXpScroll(){ const i = Math.round(xp.scrollTop / h()); if (Math.abs(xp.scrollTop - i * h()) < h() * .3) activate(i); }
  xp.addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(() => { ticking = false; onXpScroll(); }); } }, {passive: true});
  // chrome stays hidden while the tour fills the screen
  const chrome = () => { const r = xp.getBoundingClientRect(); document.body.classList.toggle('immersive', r.bottom > innerHeight * .5); };
  addEventListener('scroll', chrome, {passive: true}); chrome();

  // look around: tilt the phone (gyroscope) or move the mouse
  const motionBtn = $('#xpMotion');
  const onTilt = e => { if (e.gamma == null) return; HL.story && HL.story.parallax(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30))); };
  let motionOn = false;
  function enableMotion(){
    const go = () => { addEventListener('deviceorientation', onTilt); motionOn = true; motionBtn.classList.add('on'); };
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(r => r === 'granted' && go()).catch(() => {});
    else go();
  }
  if ('DeviceOrientationEvent' in window && (navigator.maxTouchPoints > 1)){ motionBtn.hidden = false;
    motionBtn.addEventListener('click', () => { if (motionOn){ removeEventListener('deviceorientation', onTilt); motionOn = false; motionBtn.classList.remove('on'); HL.story && HL.story.parallax(0, 0); } else enableMotion(); }); }
  $('#stage').addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); HL.story && HL.story.parallax(((e.clientX - r.left) / r.width - .5) * 1.2, ((e.clientY - r.top) / r.height - .5) * .8); });

  activate(0);
  HL.ready.then(() => { const i = idx; idx = -1; activate(i); });
})();

$$('a[href="#story"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollTo({top: 0, behavior: 'smooth'}); $('#story').scrollTo({top: 0, behavior: 'smooth'}); }));

/* ---------- what you get ---------- */
(function(){
  $('#checklist').innerHTML = CATS.map(c => `<li style="--c:${c.color}"><span class="ic">${icon(c.icon)}</span><div><b>${c.name}</b><span>${c.wrong.slice(0, 2).map(x => x.split(/[—;,(]/)[0].trim()).join(' · ')}</span></div><em>${c.checkpoints}</em></li>`).join('');
  const thumb = (a, b) => `<svg viewBox="0 0 58 44" width="58" height="44"><rect width="58" height="44" fill="${b}"/><ellipse cx="26" cy="22" rx="22" ry="16" fill="${a}" opacity=".7"/></svg>`;
  const rows = [
    ['Hidden pipe leak · Bathroom', 'Thermal image + moisture 31%', 'h', 'High', 'pipe', thumb('#4fb3ff', '#2b1a6b')],
    ['Overheating fuse board', '74 °C · RCCB failed 30 mA test', 'h', 'High', 'db', thumb('#ff5d6c', '#3a1f2a')],
    ['Hollow tiles ×4 · Living', 'Tap test, plotted on plan', 'm', 'Moderate', 'tiles', thumb('#f5a65b', '#3a2c1e')],
    ['Window seal gap · Bedroom', 'Spray test: water ingress', 'l', 'Minor', 'window', thumb('#b48cff', '#251c3a')]
  ];
  $('#reportMock').innerHTML = `<div class="rm-head"><div><div style="font-size:11px;color:var(--dim);letter-spacing:.1em;text-transform:uppercase">Inspection report</div><b style="font-size:15px">Flat 1204 · Tower B</b></div><div class="rm-counts"><b style="color:#ff9aa4">6</b> high · <b style="color:#ffd08a">18</b> mod · <b style="color:#a9c5ff">22</b> minor</div></div>
    ${rows.map(r => `<div class="rm-row"><div class="rm-thumb" data-thumb="${r[4]}">${r[5]}</div><div><b>${r[0]}</b><span>${r[1]}</span></div><span class="sevtag ${r[2]}">${r[3]}</span></div>`).join('')}
    <p class="fine" style="margin-top:8px">46 defects · 212 photos · 18 thermal images — sample report</p>`;
  glReady.then(gl => { if (!gl) return; $$('#reportMock [data-thumb]').forEach(el => { const id = el.dataset.thumb; queueShot('thumb_' + id, {view: id, w: 320, h: 240, states: {[id]: 'bad'}}, r => { el.innerHTML = `<img src="${r.url}" alt="">`; }); }); });
})();

/* ---------- FAQ ---------- */
(function(){
  const el = $('#faqList');
  el.innerHTML = FAQ.map((f, i) => `<div class="qa"><button aria-expanded="false">${f.q}<i></i></button><div class="ans"><div><p>${f.a}</p></div></div></div>`).join('');
  el.addEventListener('click', e => { const b = e.target.closest('.qa button'); if (!b) return; const q = b.parentElement, open = !q.classList.contains('open'); $$('.qa', el).forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', false); }); if (open){ q.classList.add('open'); b.setAttribute('aria-expanded', true); } });
})();

/* ---------- sticky booking bar: only after the experience, never over the visuals ---------- */
(function(){
  const bar = $('#stickyCta'), book = $('#book'), story = $('#story'), quote = $('#quote');
  const vis = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  const upd = () => { const st = story.getBoundingClientRect();
    bar.classList.toggle('show', st.bottom < innerHeight * .4 && !vis(book) && !vis(quote)); };
  addEventListener('scroll', upd, {passive: true}); upd();
})();

/* ---------- forms ---------- */
$$('.pick').forEach(p => p.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', p).forEach(x => x.classList.toggle('on', x === b)); }));
const dateIn = $('#bookForm [name=date]'); dateIn.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
function validate(form){
  let ok = true;
  $$('[required]', form).forEach(i => { const f = i.closest('.f'); const bad = !i.value.trim() || (i.name === 'phone' && i.value.replace(/\D/g, '').length < 10); f.classList.toggle('err', bad); if (bad) ok = false; });
  return ok;
}
const picked = (form, name) => { const b = $(`.pick[data-name="${name}"] .on`, form); return b ? b.textContent : ''; };
// NOTE: forms are front-end only. Connect to your CRM / booking backend before going live.
$('#bookForm').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target; if (!validate(f)) return;
  const d = new FormData(f), p = planCalc(PLAN), ref = 'HL-' + Math.floor(100000 + Math.random() * 900000);
  const when = d.get('date') ? ' on ' + new Date(d.get('date')).toLocaleDateString('en-IN', {weekday: 'short', day: 'numeric', month: 'short'}) : '';
  $('#bookCard').innerHTML = `<div class="success"><div class="tick">${icon('check')}</div><h3 style="font-size:26px">You’re booked in, ${d.get('name').split(' ')[0]}.</h3>
    <p style="color:var(--muted);margin:10px auto 22px;max-width:420px">${p.label} in ${d.get('city')}${when} · ${inr(p.fee)}. We’ll call ${d.get('phone')} to confirm your slot.</p>
    <span class="chip">Reference ${ref}</span><p class="fine" style="margin-top:20px">Tip: keep your floor plan handy for the visit.</p></div>`;
});
const modal = $('#consult');
$$('[data-consult]').forEach(b => b.addEventListener('click', () => { modal.classList.add('open'); setTimeout(() => $('#consultForm [name=name]')?.focus(), 200); }));
modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) modal.classList.remove('open'); });
addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
$('#consultForm').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target; if (!validate(f)) return; const d = new FormData(f);
  $('#consultBody').innerHTML = `<div class="success" style="padding:20px 0 0"><div class="tick">${icon('phone')}</div><h3 style="font-size:24px">We’ll call you, ${d.get('name').split(' ')[0]}.</h3><p style="color:var(--muted);margin-top:10px">An inspector will ring ${d.get('phone')} this ${picked(f, 'time').toLowerCase()}. No obligation.</p><button class="btn btn-primary" style="margin-top:22px" data-close>Done</button></div>`;
});
