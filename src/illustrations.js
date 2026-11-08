/* =========================================================
   SVG illustrations: hero lens, before/after, risk rooms
   ========================================================= */
const FONT = 'font-family="Inter,Segoe UI,system-ui,sans-serif"';
const hash = (a,b)=>{ const s = Math.sin(a*127.1 + b*311.7)*43758.5453; return s - Math.floor(s); };
function shadeHex(hex, v){ const n = parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255; const f = v>0 ? (c)=>c+(255-c)*v : (c)=>c*(1+v); return '#'+[r,g,b].map(c=>Math.round(Math.max(0,Math.min(255,f(c)))).toString(16).padStart(2,'0')).join(''); }
const pts = a => a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');

function persp(hz){ const K = (600-hz)*1.5; return (X,Z)=>[400 + X*400/Z, hz + K/Z]; }
function tileQuad(hz, w, i, k){ const P = persp(hz), z1 = 1.5+k*w, z2 = z1+w, x1 = i*w, x2 = x1+w; return [P(x1,z1),P(x2,z1),P(x2,z2),P(x1,z2)]; }
function tileCenter(hz, w, i, k){ const P = persp(hz); return P(i*w+w/2, 1.5+k*w+w/2); }
function floorTiles(hz, w, base, grout, fillFn){
  let s = '';
  for (let k=0;k<22;k++) for (let i=-14;i<14;i++){
    const q = tileQuad(hz, w, i, k);
    const xs = q.map(p=>p[0]); if (Math.max(...xs) < 0 || Math.min(...xs) > 800) continue;
    if (q[2][1] < hz+1) continue;
    const f = (fillFn && fillFn(i,k)) || shadeHex(base, (hash(i,k)-.5)*.08);
    s += `<polygon points="${pts(q)}" fill="${f}" stroke="${grout}" stroke-width="${Math.max(.5, 3/(1.5+k*w)).toFixed(2)}"/>`;
  }
  return s;
}
function tagSVG(x, y, text, col, anchor='l'){
  const w = text.length*6.9 + 30, ox = anchor==='r' ? -w : 0;
  return `<g transform="translate(${x+ox},${y})"><rect x="0" y="-15" rx="13" width="${w}" height="28" fill="rgba(7,11,20,.86)" stroke="${col}" stroke-width="1.5"/><circle cx="14" cy="-1" r="4.5" fill="${col}"/><text x="25" y="3.6" font-size="12.5" font-weight="600" fill="#fff" ${FONT}>${text}</text></g>`;
}
function pin(x, y, col){ return `<circle cx="${x}" cy="${y}" r="7" fill="${col}" stroke="#fff" stroke-width="2"/><circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${col}" stroke-width="2" opacity=".5"/>`; }
function line(x1,y1,x2,y2,col){ return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 3"/>`; }
function defs(p){
  return `<defs>
  <linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4eee3"/><stop offset="1" stop-color="#e3d8c6"/></linearGradient>
  <radialGradient id="${p}v" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
  <radialGradient id="${p}st"><stop offset="0" stop-color="#7d6a43" stop-opacity=".55"/><stop offset=".65" stop-color="#8f7a4d" stop-opacity=".28"/><stop offset="1" stop-color="#8f7a4d" stop-opacity="0"/></radialGradient>
  <radialGradient id="${p}sc"><stop offset="0" stop-color="#111"/><stop offset=".5" stop-color="#3a2a1e" stop-opacity=".8"/><stop offset="1" stop-color="#3a2a1e" stop-opacity="0"/></radialGradient>
  <radialGradient id="${p}wa"><stop offset="0" stop-color="#9fd4ff" stop-opacity=".8"/><stop offset="1" stop-color="#5aa9e6" stop-opacity=".35"/></radialGradient>
  <radialGradient id="${p}th"><stop offset="0" stop-color="#fff6b0"/><stop offset=".3" stop-color="#ff9a3d"/><stop offset=".65" stop-color="#d43f8d"/><stop offset="1" stop-color="#2b1a6b"/></radialGradient>
  <linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4ea"/><stop offset="1" stop-color="#cfe6fb"/></linearGradient>
  <linearGradient id="${p}plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e2dc"/></linearGradient>
  <pattern id="${p}brick" width="60" height="28" patternUnits="userSpaceOnUse"><rect width="60" height="28" fill="#a95f43"/><path d="M0 0H60M0 14H60M30 0V14M0 14V28M60 14V28" stroke="#d9c7ae" stroke-width="3"/></pattern>
  <filter id="${p}blur"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="${p}blur2"><feGaussianBlur stdDeviation="2"/></filter>
  </defs>`;
}
function shell(p, hz, o={}){
  return `<rect width="800" height="${hz}" fill="${o.wall||`url(#${p}w)`}"/>
  ${o.wallExtra||''}
  <rect y="${hz-1}" width="800" height="${601-hz}" fill="${o.grout||'#bfb4a1'}"/>
  ${floorTiles(hz, o.tw||.75, o.floor||'#e8e0d0', o.grout||'#c4b9a5', o.fill)}
  ${o.noSkirt?'':`<rect y="${hz-10}" width="800" height="10" fill="${o.skirt||'#d6cab6'}"/>`}`;
}
const vign = p => `<rect width="800" height="600" fill="url(#${p}v)" pointer-events="none"/>`;

/* ---------- category before / after ---------- */
const BA = {
 tiles(p, bad){
   const hz = 210, w = .75;
   const badT = {'-1,0':1,'0,0':1,'1,1':1,'-2,1':1,'2,0':1};
   let s = defs(p) + shell(p, hz, {tw:w, floor:'#ece4d4', fill:(i,k)=> bad && badT[i+','+k] ? shadeHex('#ece4d4',-.06) : null});
   s += `<rect x="520" y="110" width="230" height="92" rx="4" fill="#8a6446"/><rect x="530" y="122" width="100" height="70" fill="#9a7352"/><rect x="640" y="122" width="100" height="70" fill="#9a7352"/><rect x="80" y="40" width="140" height="100" fill="#fff" stroke="#c9b9a0" stroke-width="6"/><path d="M90 130l40-50 30 30 20-20 30 40z" fill="#9cc3b0"/>`;
   if (bad){
     const c1 = tileQuad(hz,w,1,1), c2 = tileQuad(hz,w,-1,0), lift = tileQuad(hz,w,0,0);
     const crack = (q,a,b)=>{ const A=[q[0][0]+(q[1][0]-q[0][0])*a, q[0][1]+(q[1][1]-q[0][1])*a], Bp=[q[3][0]+(q[2][0]-q[3][0])*b, q[3][1]+(q[2][1]-q[3][1])*b]; const m1=[A[0]*.65+Bp[0]*.35+8, A[1]*.65+Bp[1]*.35], m2=[A[0]*.3+Bp[0]*.7-10, A[1]*.3+Bp[1]*.7]; return `<path d="M${A}L${m1}L${m2}L${Bp}" fill="none" stroke="#5a4a3a" stroke-width="2.2" stroke-linejoin="round"/>`; };
     s += crack(c1,.2,.8) + crack(c2,.7,.25);
     s += `<polygon points="${pts(lift.map(p=>[p[0],p[1]+6]))}" fill="rgba(0,0,0,.35)" filter="url(#${p}blur2)"/>`;
     s += `<polygon points="${pts(lift.map((p,i)=>[p[0]+(i===1||i===2?3:0), p[1]-(i<2?4:12)]))}" fill="#efe7d8" stroke="#a89c86" stroke-width="2"/>`;
     const hc = tileCenter(hz,w,-2,1);
     s += `<g stroke="#ff5d6c" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><path d="M${hc[0]-30} ${hc[1]-30}a40 40 0 0 1 60 0"/><path d="M${hc[0]-48} ${hc[1]-48}a64 64 0 0 1 96 0" opacity=".6"/></g>`;
     s += pin(hc[0],hc[1],'#ff5d6c') + tagSVG(hc[0]-20, hc[1]-70, 'Hollow tile — "tock" sound', '#ff5d6c', 'r');
     const lc = tileCenter(hz,w,0,0); s += tagSVG(lc[0]+40, lc[1]-10, 'Lifted edge — tenting', '#ffb547');
     const cc = tileCenter(hz,w,1,1); s += tagSVG(cc[0]+20, cc[1]-48, 'Crack across tile', '#ffb547');
   } else {
     const hc = tileCenter(hz,w,-2,1);
     s += `<path d="M${hc[0]+150} ${hc[1]-200}L${hc[0]+6} ${hc[1]-8}" stroke="#2a3245" stroke-width="7" stroke-linecap="round"/><circle cx="${hc[0]}" cy="${hc[1]-2}" r="10" fill="#9aa6bf"/>`;
     s += tagSVG(hc[0]-30, hc[1]+40, 'Every tile tap-tested · solid', '#3ddc97', 'r') + tagSVG(470, 270, 'Level within 2 mm', '#3ddc97');
   }
   return s + vign(p);
 },
 damp(p, bad){
   const hz = 450;
   let s = defs(p) + shell(p, hz);
   s += `<rect x="470" y="130" width="190" height="140" fill="#fff" stroke="#c9b9a0" stroke-width="7"/><path d="M482 258l50-70 40 45 30-30 46 55z" fill="#a9c7d6"/><rect x="560" y="360" width="160" height="90" rx="4" fill="#8a6446"/><rect x="600" y="300" width="14" height="60" fill="#c9b9a0"/><path d="M580 300h54l-12-40h-30z" fill="#f2e3c6"/>`;
   if (bad){
     s += `<g filter="url(#${p}blur)"><ellipse cx="170" cy="360" rx="170" ry="120" fill="url(#${p}st)"/><ellipse cx="250" cy="300" rx="120" ry="110" fill="url(#${p}st)"/><ellipse cx="90" cy="260" rx="90" ry="100" fill="url(#${p}st)"/><ellipse cx="80" cy="40" rx="160" ry="70" fill="url(#${p}st)"/></g>`;
     s += `<path d="M10 205c40-20 70 10 110-8s60 12 100-4 50 30 90 40 30 60 50 100" fill="none" stroke="#7d6a43" stroke-width="2.5" opacity=".55"/>`;
     s += `<g fill="#f6f1e6" stroke="#b8a888" stroke-width="1.5"><path d="M120 330l30-12 14 22-26 16z"/><path d="M200 370l26-6 6 24-28 4z"/><path d="M70 300l22-10 12 18-24 10z"/></g><g fill="rgba(0,0,0,.18)"><path d="M126 340l26-10 10 16z"/><path d="M206 380l22-4 4 14z"/></g>`;
     let dots = ''; for (let i=0;i<60;i++){ dots += `<circle cx="${30+hash(i,1)*300}" cy="${405+hash(i,2)*36}" r="${1+hash(i,3)*2.5}" fill="#fff" opacity=".85"/>`; }
     for (let i=0;i<46;i++){ dots += `<circle cx="${300+Math.cos(i)*hash(i,4)*55}" cy="${210+Math.sin(i*1.3)*hash(i,5)*40}" r="${1+hash(i,6)*3}" fill="#1f2a1c" opacity="${.4+hash(i,7)*.5}"/>`; }
     s += dots;
     s += pin(170,300,'#4fb3ff') + tagSVG(190, 300, 'Seepage through external wall', '#4fb3ff');
     s += tagSVG(40, 470, 'Peeling paint · salt deposits', '#ffb547');
     s += pin(300,210,'#ff5d6c') + tagSVG(318, 180, 'Mould growth', '#ff5d6c');
   } else {
     s += tagSVG(120, 280, 'Moisture 9% · dry wall', '#3ddc97') + tagSVG(120, 330, 'Waterproofing verified', '#3ddc97');
   }
   return s + vign(p);
 },
 electrical(p, bad){
   const hz = 480;
   let s = defs(p) + shell(p, hz);
   const plate = (rot)=>`<g transform="rotate(${rot} 400 260)"><rect x="230" y="170" width="340" height="180" rx="16" fill="url(#${p}plate)" stroke="#cfcfc8" stroke-width="2"/>
     ${[0,1,2,3].map(i=>`<rect x="${258+i*44}" y="196" width="34" height="56" rx="5" fill="#f1f1ec" stroke="#cfcfc8"/><rect x="${264+i*44}" y="${i%2?224:202}" width="22" height="22" rx="3" fill="#e4e4de"/>`).join('')}
     <g><circle cx="300" cy="300" r="32" fill="#f1f1ec" stroke="#cfcfc8"/><circle cx="300" cy="286" r="7" fill="#333"/><circle cx="288" cy="310" r="5" fill="#333"/><circle cx="312" cy="310" r="5" fill="#333"/></g>
     <g><circle cx="420" cy="300" r="32" fill="#f1f1ec" stroke="#cfcfc8"/><circle cx="420" cy="286" r="7" fill="#333"/><circle cx="408" cy="310" r="5" fill="#333"/><circle cx="432" cy="310" r="5" fill="#333"/></g>
     <rect x="474" y="196" width="72" height="56" rx="6" fill="#f1f1ec" stroke="#cfcfc8"/><rect x="490" y="206" width="40" height="18" rx="3" fill="#2a3245"/><text x="510" y="219" text-anchor="middle" font-size="10" fill="#ffd84f" ${FONT}>REG</text></g>`;
   if (bad){
     s += `<path d="M228 176l344 -10 4 190z" fill="rgba(0,0,0,.18)" filter="url(#${p}blur2)"/>` + plate(-3);
     s += `<ellipse cx="296" cy="300" rx="62" ry="54" fill="url(#${p}sc)" opacity=".9"/>`;
     s += `<path d="M330 352c10 40-20 60 0 100M346 352c18 30 4 60 30 96" fill="none" stroke="#e46a2c" stroke-width="5"/><path d="M362 350c10 40 30 50 20 96" fill="none" stroke="#3b78d8" stroke-width="5"/><circle cx="330" cy="452" r="4" fill="#d9a441"/>`;
     s += `<path d="M270 262l10 18 18-6-12 16 16 12-20 0 0 20-10-18-18 8 12-16-16-10 20-2z" fill="#ffd84f" stroke="#ff9a3d" stroke-width="2"/>`;
     s += `<g transform="translate(600 70)"><rect width="170" height="120" rx="10" fill="#0a1220" stroke="#ff5d6c" stroke-width="2"/><rect x="10" y="10" width="150" height="82" rx="4" fill="#2b1a6b"/><circle cx="70" cy="56" r="30" fill="url(#${p}th)"/><text x="85" y="110" text-anchor="middle" font-size="12" font-weight="700" fill="#ffb3ba" ${FONT}>Thermal · 74°C</text></g>`;
     s += tagSVG(40, 140, 'Scorched socket — loose terminal', '#ff5d6c');
     s += tagSVG(400, 420, 'Exposed live conductors', '#ffd84f');
     s += tagSVG(470, 160, 'No earth continuity', '#ffb547');
   } else {
     s += plate(0);
     s += `<g transform="translate(372 262)"><rect width="96" height="74" rx="14" fill="#f8f8f6" stroke="#cfcfc8" stroke-width="2"/><circle cx="24" cy="26" r="8" fill="#3ddc97"/><circle cx="48" cy="26" r="8" fill="#3ddc97"/><circle cx="72" cy="26" r="8" fill="#d6d6d0"/><text x="48" y="58" text-anchor="middle" font-size="11" font-weight="700" fill="#2a3245" ${FONT}>CORRECT</text></g>`;
     s += tagSVG(60, 120, 'Earth & polarity correct', '#3ddc97') + tagSVG(420, 420, 'RCCB trips in 22 ms', '#3ddc97');
   }
   return s + vign(p);
 },
 plumbing(p, bad){
   const hz = 480;
   let s = defs(p) + shell(p, hz);
   s += `<rect x="110" y="110" width="500" height="230" fill="url(#${p}brick)"/><rect x="110" y="110" width="500" height="230" fill="none" stroke="#d4c6ae" stroke-width="10"/>`;
   const pipe = `<path d="M110 210H500a20 20 0 0 1 20 20V340" fill="none" stroke="#e9e3c9" stroke-width="22"/><path d="M110 210H500a20 20 0 0 1 20 20V340" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" transform="translate(-4 -5)"/><rect x="490" y="196" width="30" height="30" rx="5" fill="#d9d0b0"/><rect x="250" y="198" width="22" height="26" rx="3" fill="#d9d0b0"/>`;
   s += `<g transform="translate(640 380)"><rect x="-6" y="-60" width="12" height="40" fill="#b9c1cc"/><path d="M0 -40h40a10 10 0 0 1 10 10v18" fill="none" stroke="#b9c1cc" stroke-width="14" stroke-linecap="round"/><rect x="-22" y="-74" width="44" height="14" rx="5" fill="#9aa6bf"/></g>`;
   if (bad){
     s += `<g filter="url(#${p}blur)"><ellipse cx="505" cy="260" rx="70" ry="110" fill="#2b2015" opacity=".45"/><ellipse cx="470" cy="420" rx="120" ry="40" fill="url(#${p}st)"/></g>` + pipe;
     s += `<g fill="#6fb7ff"><path d="M508 236q6 12 0 18q-6-6 0-18z"/><path d="M500 280q6 12 0 18q-6-6 0-18z" opacity=".8"/><path d="M512 320q6 12 0 18q-6-6 0-18z" opacity=".6"/></g>`;
     s += `<path d="M690 368v70" stroke="#6fb7ff" stroke-width="2" stroke-dasharray="4 6"/><ellipse cx="690" cy="560" rx="80" ry="16" fill="url(#${p}wa)"/>`;
     s += pin(505,212,'#2ee6d6') + tagSVG(140, 150, 'Leaking joint inside the wall', '#2ee6d6');
     s += tagSVG(420, 520, 'Stain spreads below', '#ffb547');
     s += tagSVG(560, 300, 'Pressure 0.6 bar — weak flow', '#ff5d6c');
   } else {
     s += pipe + `<circle cx="505" cy="211" r="26" fill="none" stroke="#3ddc97" stroke-width="4"/>`;
     s += `<path d="M690 368c0 30 4 60 0 112" stroke="#6fb7ff" stroke-width="9" stroke-linecap="round" opacity=".9"/>`;
     s += tagSVG(140, 150, 'Pressure test: 0% drop in 30 min', '#3ddc97') + tagSVG(500, 300, 'Flow 2.5 bar · even', '#3ddc97');
   }
   return s + vign(p);
 },
 doors(p, bad){
   const hz = 480;
   let s = defs(p) + shell(p, hz);
   const win = (rot)=>`<g transform="rotate(${rot} 230 360)"><rect x="240" y="100" width="320" height="250" fill="url(#${p}sky)"/><ellipse cx="330" cy="170" rx="50" ry="16" fill="#fff" opacity=".8"/><ellipse cx="460" cy="210" rx="40" ry="12" fill="#fff" opacity=".7"/>
     <rect x="240" y="100" width="320" height="250" fill="none" stroke="#3b4456" stroke-width="12"/><path d="M400 100v250" stroke="#3b4456" stroke-width="10"/><rect x="385" y="210" width="8" height="34" rx="3" fill="#9aa6bf"/></g>`;
   s += `<rect x="222" y="82" width="356" height="286" fill="#cfc3b0"/><rect x="214" y="352" width="372" height="18" fill="#bcae96"/>`;
   if (bad){
     s += `<path d="M234 92L566 92L566 100L234 96z" fill="#fff8d0"/><path d="M558 96L566 96L566 358L560 358z" fill="#fff8d0" opacity=".9"/>` + win(1.4);
     s += `<g filter="url(#${p}blur)"><ellipse cx="400" cy="420" rx="170" ry="50" fill="url(#${p}st)"/></g><g stroke="#8b7650" stroke-width="3" fill="none" opacity=".55"><path d="M280 372c-4 20 6 30 0 60"/><path d="M340 372c6 24-4 40 2 70"/><path d="M450 372c-6 18 6 34 0 56"/><path d="M520 372c4 22-6 28 0 50"/></g>`;
     s += pin(562,220,'#b48cff') + tagSVG(586, 220, '3 mm gap · no sealant', '#b48cff');
     s += tagSVG(240, 445, 'Rain ingress below sill', '#4fb3ff');
     s += tagSVG(20, 60, 'Sash misaligned — lock jams', '#ffb547');
   } else {
     s += win(0) + `<rect x="232" y="92" width="336" height="266" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>`;
     s += tagSVG(586, 220, 'Plumb · sealed', '#3ddc97') + tagSVG(30, 60, 'Lock engages smoothly', '#3ddc97');
   }
   return s + vign(p);
 },
 walls(p, bad){
   const hz = 480;
   let s = defs(p) + shell(p, hz);
   s += `<rect x="60" y="110" width="170" height="370" fill="#a07a5a"/><rect x="74" y="124" width="142" height="356" fill="#b58e6c"/><circle cx="196" cy="300" r="7" fill="#d9c7a0"/>`;
   if (bad){
     s += `<path d="M230 110l18-14 6-20 22-10 4-24 24-12 10-30" fill="none" stroke="#4a3b2e" stroke-width="3.2" stroke-linejoin="round"/><path d="M276 66l20 4 16 14" fill="none" stroke="#4a3b2e" stroke-width="1.8"/>`;
     s += `<path d="M600 120l10 14-6 12 12 10M620 180l-8 10 4 16" fill="none" stroke="#6b5a48" stroke-width="1.4" opacity=".7"/>`;
     s += `<ellipse cx="560" cy="300" rx="110" ry="70" fill="#000" opacity=".12" filter="url(#${p}blur)" transform="translate(10 12)"/><ellipse cx="560" cy="300" rx="104" ry="64" fill="#efe7da"/><ellipse cx="540" cy="282" rx="70" ry="36" fill="#fff" opacity=".45" filter="url(#${p}blur)"/><path d="M500 270l40 26-12 30" fill="none" stroke="#7a6a58" stroke-width="1.6"/>`;
     let b = ''; for (let i=0;i<14;i++) b += `<circle cx="${360+hash(i,8)*120}" cy="${320+hash(i,9)*110}" r="${3+hash(i,10)*7}" fill="#f7f1e6" stroke="#cdbfa6"/>`;
     s += b + `<g filter="url(#${p}blur)"><ellipse cx="560" cy="10" rx="200" ry="40" fill="url(#${p}st)"/></g>`;
     s += pin(256,74,'#ff7a90') + tagSVG(280, 40, 'Diagonal crack at opening · 2.5 mm', '#ff7a90');
     s += tagSVG(470, 400, 'Hollow plaster bulge', '#ffb547', 'l');
     s += tagSVG(250, 470, 'Paint blistering', '#ffb547');
   } else {
     s += tagSVG(280, 60, 'Cracks gauged & repaired', '#3ddc97') + tagSVG(470, 300, 'Plaster sound · flat', '#3ddc97');
   }
   return s + vign(p);
 },
 wet(p, bad){
   const hz = 370, w = .45;
   let wt = '<g>'; for (let y=0;y<hz;y+=56) for (let x=0;x<800;x+=56) wt += `<rect x="${x+1.5}" y="${y+1.5}" width="53" height="53" fill="${shadeHex('#f2f5f7',(hash(x,y)-.5)*.04)}"/>`; wt += '</g>';
   const dark = bad ? '#4a5560' : '#c2cbd2';
   let s = defs(p) + shell(p, hz, {wall:'#d0d8de', wallExtra:wt, floor:'#b7c4cc', grout:dark, tw:w, noSkirt:true});
   s += `<g><rect x="95" y="215" width="70" height="120" rx="8" fill="#fafafa" stroke="#d7dde2" stroke-width="2"/><path d="M80 330h170c0 70-40 110-90 110h-10c-40 0-70-40-70-110z" fill="#fff" stroke="#d7dde2" stroke-width="2"/><ellipse cx="165" cy="332" rx="86" ry="18" fill="#f2f4f6" stroke="#d7dde2" stroke-width="2"/><rect x="120" y="430" width="70" height="70" fill="#fff" stroke="#d7dde2" stroke-width="2"/></g>`;
   s += `<ellipse cx="560" cy="510" rx="44" ry="14" fill="#8f9aa6"/><g stroke="#5c6670" stroke-width="3">${[-24,-12,0,12,24].map(x=>`<path d="M${560+x} 502v16"/>`).join('')}</g>`;
   s += `<g><rect x="560" y="150" width="160" height="34" rx="8" fill="#fff" stroke="#d7dde2" stroke-width="2"/><path d="M600 150v-30h30" fill="none" stroke="#b9c1cc" stroke-width="8"/></g>`;
   if (bad){
     s += `<ellipse cx="330" cy="470" rx="150" ry="36" fill="url(#${p}wa)"/><ellipse cx="300" cy="462" rx="60" ry="8" fill="#fff" opacity=".5"/>`;
     s += `<g stroke="#ff5d6c" stroke-width="3" fill="none" stroke-linecap="round"><path d="M430 470l-60 0M380 460l-12 10 12 10"/></g>`;
     s += `<path d="M120 500h70" stroke="#222" stroke-width="3"/>`;
     let m = ''; for (let i=0;i<40;i++) m += `<circle cx="${4+hash(i,11)*780}" cy="${hz-6+hash(i,12)*10}" r="${1+hash(i,13)*2.5}" fill="#1f2a1c" opacity=".55"/>`;
     s += m;
     s += tagSVG(330, 420, 'Water pools — slope runs away from drain', '#4fb3ff');
     s += tagSVG(20, 560, 'Gap at WC base · open grout', '#ff5d6c');
     s += tagSVG(470, 115, 'Leaking basin waste', '#ffb547');
   } else {
     s += `<g stroke="#2ee6d6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><path d="M300 480q100 10 220 30M330 520q90 0 180 -4M320 445q120 20 200 55"/><path d="M506 500l14 10-14 10" /></g>`;
     s += tagSVG(240, 420, 'Slope 1:100 to drain', '#3ddc97') + tagSVG(470, 115, 'Joints sealed · no leaks', '#3ddc97') + tagSVG(20, 560, 'Flood test passed (24 hr)', '#3ddc97');
   }
   return s + vign(p);
 }
};

/* ---------- Hero lens ---------- */
function heroBase(){
  const p = 'hb', hz = 450;
  let s = defs(p) + `<rect width="600" height="600" fill="#0c1424"/>`;
  s += `<g transform="scale(.75 1)">` + shell(p, hz, {tw:.75}) + `</g>`;
  s += `<rect width="600" height="26" fill="#f7f3ec"/><rect y="24" width="600" height="6" fill="#e3d9c8"/>`;
  s += `<path d="M420 30v50" stroke="#2a3245" stroke-width="2"/><path d="M396 80h48l-8 24h-32z" fill="#2a3245"/><ellipse cx="420" cy="106" rx="30" ry="6" fill="#fff4c9" opacity=".8"/>`;
  s += `<rect x="60" y="110" width="170" height="190" fill="url(#${p}sky)"/><ellipse cx="120" cy="160" rx="34" ry="10" fill="#fff" opacity=".8"/><rect x="60" y="110" width="170" height="190" fill="none" stroke="#3b4456" stroke-width="9"/><path d="M145 110v190" stroke="#3b4456" stroke-width="7"/><rect x="50" y="296" width="190" height="12" fill="#cbbda5"/>`;
  s += `<path d="M30 100h40v220H30z" fill="#c45b4b" opacity=".85"/><path d="M220 100h40v220h-40z" fill="#c45b4b" opacity=".85"/>`;
  s += `<rect x="300" y="140" width="110" height="80" fill="#fff" stroke="#c9b9a0" stroke-width="5"/><path d="M308 212l30-36 20 20 16-14 28 30z" fill="#9cc3b0"/>`;
  s += `<rect x="455" y="230" width="58" height="40" rx="5" fill="#fafaf6" stroke="#d0cbbf"/><rect x="463" y="238" width="12" height="20" rx="2" fill="#e6e3da"/><rect x="480" y="238" width="12" height="20" rx="2" fill="#e6e3da"/><circle cx="502" cy="250" r="6" fill="#e6e3da"/>`;
  s += `<rect x="98" y="372" width="34" height="26" rx="4" fill="#fafaf6" stroke="#d0cbbf"/><circle cx="115" cy="385" r="3" fill="#555"/>`;
  s += `<g><rect x="250" y="340" width="260" height="64" rx="14" fill="#5d6b8a"/><rect x="236" y="300" width="290" height="58" rx="16" fill="#6a7899"/><rect x="226" y="330" width="40" height="80" rx="12" fill="#5d6b8a"/><rect x="496" y="330" width="40" height="80" rx="12" fill="#5d6b8a"/><rect x="290" y="316" width="70" height="40" rx="10" fill="#f5a65b"/></g>`;
  s += `<g><path d="M546 450h40l-6-50h-28z" fill="#b5643c"/><circle cx="566" cy="380" r="34" fill="#3f7d4e"/><circle cx="548" cy="350" r="22" fill="#4b8d5a"/><circle cx="582" cy="356" r="20" fill="#4b8d5a"/></g>`;
  return s;
}
const HERO_DEFECTS = [
  {x:150, y:70, t:'Seepage behind fresh paint'},
  {x:470, y:180, t:'Concealed pipe leak'},
  {x:115, y:385, t:'Socket overheating · no earth'},
  {x:300, y:520, t:'Hollow tiles under the sofa'},
  {x:262, y:84, t:'Hairline crack under putty'},
  {x:236, y:250, t:'Window seal gap'}
];
function heroXray(){
  const p = 'hx';
  let s = defs(p) + `<rect width="600" height="600" fill="#061424"/>`;
  let g = ''; for (let i=0;i<=600;i+=30) g += `<path d="M${i} 0V600M0 ${i}H600" stroke="#2ee6d6" stroke-opacity=".07"/>`;
  s += g;
  s += `<g fill="none" stroke="#2ee6d6" stroke-opacity=".55" stroke-width="1.5"><rect x="60" y="110" width="170" height="190"/><path d="M145 110v190"/><rect x="300" y="140" width="110" height="80"/><rect x="455" y="230" width="58" height="40" rx="5"/><rect x="98" y="372" width="34" height="26" rx="4"/><rect x="236" y="300" width="290" height="110" rx="16"/><path d="M0 30H600M0 450H600"/><path d="M546 450h40l-6-50h-28z"/></g>`;
  // floor grid
  s += `<g transform="scale(.75 1)" opacity=".9">${floorTiles(450,.75,'#0a1d30','#2ee6d6',(i,k)=> (k<=1 && i>=-1 && i<=1) ? '#5a1424' : '#0a1d30')}</g>`;
  [[-1,0],[0,0],[0,1]].forEach(([i,k])=>{ const c = tileCenter(450,.75,i,k); s += `<text x="${c[0]*.75}" y="${c[1]+4}" text-anchor="middle" font-size="11" font-weight="800" fill="#ff7a8a" ${FONT}>HOLLOW</text>`; });
  // damp thermal
  s += `<g filter="url(#${p}blur)"><ellipse cx="150" cy="70" rx="130" ry="60" fill="#3a1fa8" opacity=".85"/><ellipse cx="130" cy="80" rx="70" ry="34" fill="#4fb3ff" opacity=".7"/><ellipse cx="236" cy="260" rx="26" ry="60" fill="#4f8cff" opacity=".6"/></g>`;
  // pipes
  s += `<path d="M600 190H470V30" fill="none" stroke="#4fb3ff" stroke-width="8"/><path d="M600 206H486V30" fill="none" stroke="#ff7a3d" stroke-width="6"/><g filter="url(#${p}blur)"><ellipse cx="470" cy="180" rx="44" ry="56" fill="#4fb3ff" opacity=".8"/></g><circle cx="470" cy="180" r="9" fill="#fff"/>`;
  // wiring
  s += `<path d="M484 230V40H420V30M484 40H115V372" fill="none" stroke="#ffd84f" stroke-width="2.5" stroke-dasharray="7 4"/><g filter="url(#${p}blur)"><circle cx="115" cy="385" r="30" fill="url(#${p}th)"/></g><text x="148" y="410" font-size="12" font-weight="700" fill="#ffb3ba" ${FONT}>68°C</text>`;
  // crack
  s += `<path d="M230 110l14-12 6-16 18-6 4-18 18-10" fill="none" stroke="#ff5d6c" stroke-width="3"/>`;
  // labels
  s += tagSVG(160, 128, 'Seepage behind paint', '#4fb3ff');
  s += tagSVG(456, 120, 'Pipe leak', '#2ee6d6', 'r');
  s += tagSVG(150, 440, 'Loose wire · no earth', '#ff5d6c');
  s += tagSVG(380, 560, 'Hollow tiles', '#ff5d6c', 'r');
  s += tagSVG(300, 60, 'Hairline crack', '#ff7a90');
  s += tagSVG(252, 260, 'Seal gap', '#b48cff');
  return s;
}

/* ---------- Risk room (640x400) ---------- */
function riskRoom(p, mode){
  let s = defs(p) + `<rect width="640" height="400" fill="#0c1424"/>`;
  s += `<rect x="0" y="0" width="640" height="330" fill="url(#${p}w)"/>`;
  let wt = ''; for (let y=24;y<330;y+=34) for (let x=0;x<232;x+=34) wt += `<rect x="${x+1}" y="${y+1}" width="32" height="32" fill="#e9eef1"/>`;
  s += `<rect x="0" y="24" width="233" height="306" fill="#cdd6dc"/>` + wt;
  s += `<rect x="233" y="0" width="20" height="400" fill="#c6b9a4"/>`;
  s += `<rect width="640" height="24" fill="#f7f3ec"/><rect y="22" width="640" height="4" fill="#ddd2bf"/>`;
  s += `<rect x="0" y="330" width="640" height="70" fill="#d9cfbf"/>`;
  for (let x=0;x<640;x+=64) s += `<path d="M${x} 330l${(x-320)*.15} 70" stroke="#c4b9a5"/>`;
  s += `<path d="M0 352H640M0 378H640" stroke="#c4b9a5"/>`;
  s += `<rect x="40" y="250" width="60" height="80" rx="6" fill="#fff" stroke="#d7dde2"/><rect x="30" y="300" width="100" height="40" rx="18" fill="#fff" stroke="#d7dde2"/><rect x="150" y="150" width="70" height="50" rx="6" fill="#fff" stroke="#d7dde2"/>`;
  s += `<rect x="296" y="70" width="128" height="120" fill="url(#${p}sky)"/><rect x="296" y="70" width="128" height="120" fill="none" stroke="#3b4456" stroke-width="6"/><path d="M360 70v120" stroke="#3b4456" stroke-width="5"/><rect x="288" y="188" width="144" height="8" fill="#cbbda5"/>`;
  s += `<rect x="440" y="270" width="170" height="44" rx="10" fill="#5d6b8a"/><rect x="430" y="246" width="190" height="36" rx="12" fill="#6a7899"/><rect x="466" y="256" width="44" height="26" rx="6" fill="#f5a65b"/>`;
  s += `<rect x="280" y="292" width="22" height="18" rx="3" fill="#fafaf6" stroke="#d0cbbf"/>`;
  s += `<rect x="520" y="90" width="80" height="60" fill="#fff" stroke="#c9b9a0" stroke-width="4"/>`;
  if (mode === 'A'){
    const L = (k, inner)=>`<g data-k="${k}" style="opacity:0;transition:opacity .6s">${inner}</g>`;
    s += L('grout', `<ellipse cx="160" cy="362" rx="70" ry="12" fill="url(#${p}wa)"/>`);
    s += L('damp', `<g filter="url(#${p}blur)"><ellipse cx="560" cy="200" rx="90" ry="100" fill="url(#${p}st)"/></g>`);
    s += L('pipe', `<rect x="40" y="110" width="90" height="80" fill="url(#${p}brick)"/><path d="M40 150h90" stroke="#e9e3c9" stroke-width="10"/><path d="M40 110l14 10-8 12 12 6M130 190l-12-8 6-10" stroke="#555" fill="none"/>`);
    s += L('tiles', `<path d="M400 340l20 20-6 14 14 18M470 336l-10 24 18 10M520 350l14 12" stroke="#5a4a3a" stroke-width="2.4" fill="none"/>`);
    s += L('socket', `<ellipse cx="291" cy="301" rx="22" ry="20" fill="url(#${p}sc)"/><path d="M300 280l6 8 8-2-5 7 6 5-9 0 0 8-5-8-8 3 5-7-7-4 9-1z" fill="#ffd84f"/>`);
    s += L('mould', Array.from({length:40},(_,i)=>`<circle cx="${520+hash(i,21)*100}" cy="${130+hash(i,22)*150}" r="${1+hash(i,23)*3}" fill="#1f2a1c" opacity=".6"/>`).join(''));
    s += L('window', `<g stroke="#8b7650" stroke-width="2.5" fill="none" opacity=".6"><path d="M310 198c-3 20 4 30 0 50"/><path d="M360 198c4 20-4 30 0 60"/><path d="M410 198c-3 16 4 30 0 46"/></g>`);
    s += L('ceiling', `<g filter="url(#${p}blur)"><ellipse cx="120" cy="24" rx="110" ry="30" fill="url(#${p}st)"/></g><path d="M120 60v6M120 90v6M120 120v6" stroke="#6fb7ff" stroke-width="3"/><path d="M98 316h44l-6 20h-32z" fill="#4f8cff"/>`);
    s += L('crack', `<path d="M424 70l10-12 4-14 14-6 2-14 12-8" fill="none" stroke="#4a3b2e" stroke-width="2.6"/><path d="M253 120l30 20 10 30" stroke="#4a3b2e" stroke-width="2" fill="none"/>`);
  } else {
    const ok = (x,y)=>`<g data-ok style="opacity:0;transition:opacity .6s"><circle cx="${x}" cy="${y}" r="13" fill="#3ddc97"/><path d="M${x-6} ${y}l4 4 8-9" stroke="#03141a" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
    s += ok(160,350) + ok(560,200) + ok(85,150) + ok(470,350) + ok(291,280) + ok(360,215) + ok(120,40);
  }
  return s;
}
