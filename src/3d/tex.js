/* Procedural PBR textures & decals (canvas-generated, no external assets) */
// three.js is injected rather than imported so this module can also run inside the
// texture worker, which has no DOM and must not pull three.js into its bundle.
let T = null;
export function setThree(t){ T = t; }
// In raster mode (the worker) build() returns plain typed arrays instead of textures.
let RAW = false;
export function setRaw(v){ RAW = v; }

let SEED = 1337;
export function rnd(){ SEED = (SEED * 16807) % 2147483647; return (SEED - 1) / 2147483646; }
export const rr = (a, b) => a + rnd() * (b - a);
const mod = (a, n) => ((a % n) + n) % n;
function h2(x, y, s = 0){ let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 2246822519); n = Math.imul(n ^ (n >>> 13), 1274126177); n ^= n >>> 16; return (n >>> 0) / 4294967295; }
export function vnoise(x, y, per = 256, s = 0){
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const x0 = mod(xi, per), x1 = mod(xi + 1, per), y0 = mod(yi, per), y1 = mod(yi + 1, per);
  const a = h2(x0, y0, s), b = h2(x1, y0, s), c = h2(x0, y1, s), d = h2(x1, y1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, oct = 4, per = 256, s = 0){ let t = 0, a = .5, f = 1, n = 0; for (let i = 0; i < oct; i++){ t += a * vnoise(x * f, y * f, per * f, s + i * 17); n += a; a *= .5; f *= 2; } return t / n; }
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const hex = h => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];

/* generic per-pixel texture builder: fn(u,v) -> [r,g,b,height,rough,alpha?] */
let TEX_SCALE = 1;
export function setTexScale(s){ TEX_SCALE = s; }
export function getTexScale(){ return TEX_SCALE; }
// Rasters produced by the worker, and the textures already made from them.
const RAWCACHE = new Map(), TEXCACHE = new Map();
export const keyOf = (name, args) => name + ':' + JSON.stringify(args);
let CURKEY = null;
export function build(size, fn, {normal = 0, rough = true, alpha = false, wrap = true} = {}){
  const key = CURKEY; CURKEY = null;
  if (key && !RAW){
    const done = TEXCACHE.get(key); if (done) return done;
    const raw = RAWCACHE.get(key);
    if (raw){ RAWCACHE.delete(key); const out = fromRaster(raw); TEXCACHE.set(key, out); return out; }
  }
  size = Math.max(96, Math.round(size * TEX_SCALE / 8) * 8);
  const W = size, H = size, n = W * H;
  const col = new Uint8ClampedArray(n * 4), hgt = new Float32Array(n), rgh = new Uint8ClampedArray(n * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){
    const i = y * W + x, o = fn(x / W, y / H, x, y);
    col[i*4] = o[0] * 255; col[i*4+1] = o[1] * 255; col[i*4+2] = o[2] * 255; col[i*4+3] = alpha ? (o[5] ?? 1) * 255 : 255;
    hgt[i] = o[3] ?? 0;
    const r = (o[4] ?? .5) * 255; rgh[i*4] = rgh[i*4+1] = rgh[i*4+2] = r; rgh[i*4+3] = 255;
  }
  const nrm = normal ? heightToNormal(hgt, W, H, normal) : null;
  // Worker path: hand back transferable pixel data, no DOM or three.js involved.
  if (RAW) return {W, H, wrap, col, rgh: rough ? rgh : null, nrm};
  const out = {map: toTex(col, W, H, true, wrap)};
  if (rough) out.rough = toTex(rgh, W, H, false, wrap);
  if (nrm) out.normal = toTex(nrm, W, H, false, wrap);
  if (key) TEXCACHE.set(key, out);
  return out;
}
function fromRaster(r){
  const out = {map: toTex(r.col, r.W, r.H, true, r.wrap)};
  if (r.rgh) out.rough = toTex(r.rgh, r.W, r.H, false, r.wrap);
  if (r.nrm) out.normal = toTex(r.nrm, r.W, r.H, false, r.wrap);
  return out;
}
function heightToNormal(h, W, H, k){
  const d = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++){
    const l = h[y*W + mod(x-1,W)], r = h[y*W + mod(x+1,W)], u = h[mod(y-1,H)*W + x], b = h[mod(y+1,H)*W + x];
    let nx = (l - r) * k, ny = (u - b) * k, nz = 1; const L = Math.hypot(nx, ny, nz); nx /= L; ny /= L; nz /= L;
    const i = (y*W + x) * 4; d[i] = (nx*.5+.5)*255; d[i+1] = (ny*.5+.5)*255; d[i+2] = (nz*.5+.5)*255; d[i+3] = 255;
  }
  return d;
}
function toTex(data, W, H, srgb, wrap){
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  c.getContext('2d').putImageData(new ImageData(data, W, H), 0, 0);
  return canvasTex(c, srgb, wrap);
}
export function canvasTex(c, srgb = true, wrap = true){
  const t = new T.CanvasTexture(c);
  if (srgb) t.colorSpace = T.SRGBColorSpace;
  if (wrap) t.wrapS = t.wrapT = T.RepeatWrapping;
  t.anisotropy = 8; t.needsUpdate = true;
  return t;
}
export function canvas2d(W, H, draw){ const c = document.createElement('canvas'); c.width = W; c.height = H; draw(c.getContext('2d'), W, H); return c; }

/* ---------------- surfaces ---------------- */
// polished vitrified marble tiles: 4x4 tiles per texture (texture = 2.4 m)
export function marbleTiles(base = 0xece5d8, n = 4, size = 1024){
  const B = hex(base), g = .006;
  return build(size, (u, v) => {
    const tu = u * n, tv = v * n, ix = Math.floor(tu), iy = Math.floor(tv), lu = tu - ix, lv = tv - iy;
    const edge = Math.min(lu, 1 - lu, lv, 1 - lv);
    if (edge < g) return [.80, .77, .71, 0, .85];
    const s = ix * 7 + iy * 13, ox = h2(ix, iy, 3) * 10, oy = h2(ix, iy, 5) * 10, ang = h2(ix, iy, 9) * 3;
    const w = fbm(lu * 2 + ox, lv * 2 + oy, 4, 64, s);
    const vein = Math.pow(1 - Math.abs(Math.sin((lu * Math.cos(ang) + lv * Math.sin(ang)) * 5 + w * 7)), 26);
    const vein2 = Math.pow(1 - Math.abs(Math.sin((lu * 1.7 - lv) * 3 + w * 9)), 60) * .6;
    const cloud = fbm(lu * 4 + ox, lv * 4 + oy, 3, 64, s + 1) - .5;
    const k = 1 + cloud * .06 - (vein * .16 + vein2 * .1) + (h2(ix, iy, 11) - .5) * .03;
    const bev = smooth(0, .02, edge);
    return [B[0] * k, B[1] * k * .995, B[2] * k * .985, bev, .08 + vein * .06];
  }, {normal: 3});
}
// laminate wood planks: texture = 1.2 m, 6 rows
export function woodPlanks(size = 1024){
  const rows = 6;
  return build(size, (u, v) => {
    const r = Math.floor(v * rows), lv = v * rows - r;
    const off = h2(r, 1, 77), len = .5;
    const pu = (u + off) / len, pi = Math.floor(pu), lu = pu - pi, id = r * 31 + mod(pi, 2 / len);
    const edge = Math.min(lv, 1 - lv) * 0.2, edgeU = Math.min(lu, 1 - lu) * len;
    if (edge < .0035 || edgeU < .0025) return [.28, .19, .12, 0, .8];
    const tone = h2(id, 2, 5);
    const ring = fbm(lu * 2 + tone * 9, lv * 3, 4, 64, id) * 9 + lv * 5;
    const grain = Math.pow(.5 + .5 * Math.sin(ring * 6.283), 3);
    const fine = fbm(lu * 40, lv * 2, 2, 512, id + 3);
    // scalars instead of .map()+spread: those allocated three arrays per pixel,
    // 1.8M for a 768px texture. Same operands, same left-to-right order.
    const t1 = 0.82 + tone * .3, t2 = 1 - grain * .22 - fine * .12;
    return [.66 * t1 * t2, .48 * t1 * t2, .32 * t1 * t2, .6 + grain * .2 - fine * .2, .42 + grain * .12];
  }, {normal: 2});
}
// square matte/gloss tiles (bathroom floor, kitchen, balcony, wall)
export function plainTiles({base = 0xb9bdbf, nx = 2, ny = 2, size = 512, grout = 0x9a9a96, gw = .012, rough = .55, speck = .06, bump = .4, var: vr = .04}){
  const B = hex(base), G = hex(grout);
  return build(size, (u, v) => {
    const tu = u * nx, tv = v * ny, ix = Math.floor(tu), iy = Math.floor(tv), lu = tu - ix, lv = tv - iy;
    const edge = Math.min(lu / ny * nx, (1 - lu) / ny * nx, lv, 1 - lv);
    if (Math.min(lu, 1 - lu) * (1 / nx) < gw / 2 || Math.min(lv, 1 - lv) * (1 / ny) < gw / 2) return [G[0], G[1], G[2], 0, .9];
    const n1 = fbm(u * 24, v * 24, 3, 24, 7), sp = vnoise(u * 300, v * 300, 300, 2) > .82 ? -speck : 0;
    const k = 1 + (n1 - .5) * vr * 2 + sp + (h2(ix, iy, 4) - .5) * vr;
    return [B[0] * k, B[1] * k, B[2] * k, .6 + n1 * bump * .4, rough + (n1 - .5) * .1];
  }, {normal: 2.5});
}
// rectangular wall tiles (w x h in texture fraction)
export function wallTiles({base = 0xf2f2ef, cols = 2, rows = 1, size = 512, grout = 0xd9d8d2, rough = .12, stagger = false}){
  const B = hex(base), G = hex(grout), gw = .006;
  return build(size, (u, v) => {
    const r = Math.floor(v * rows), lv = v * rows - r;
    const uu = stagger && r % 2 ? u + .5 / cols : u;
    const tu = uu * cols, ix = Math.floor(tu), lu = tu - ix;
    if (Math.min(lu, 1 - lu) / cols < gw || Math.min(lv, 1 - lv) / rows < gw) return [G[0], G[1], G[2], 0, .8];
    const e = Math.min(Math.min(lu, 1 - lu) / cols, Math.min(lv, 1 - lv) / rows);
    const k = 1 + (h2(ix, r, 3) - .5) * .03 + (fbm(u * 8, v * 8, 2, 8, 1) - .5) * .02;
    return [B[0] * k, B[1] * k, B[2] * k, smooth(0, .012, e), rough];
  }, {normal: 3});
}
export function paint(size = 512){
  // rough: false here and below — only tm() and granite sample a roughnessMap, so for
  // every other surface the roughness canvas was built, uploaded and never read.
  return build(size, (u, v) => { const n = fbm(u * 16, v * 16, 4, 16, 2), m = fbm(u * 90, v * 90, 2, 90, 9); const k = .97 + n * .04; return [k, k, k, n * .5 + m * .5, .82 + m * .1]; }, {normal: .9, rough: false});
}
export function fabric(size = 256){
  return build(size, (u, v) => {
    const f = 32, a = Math.sin(u * f * 6.283), b = Math.sin(v * f * 6.283);
    const w = (a * (b > 0 ? 1 : -1)) * .5 + .5, fuzz = fbm(u * 64, v * 64, 2, 64, 4);
    const k = .82 + w * .12 + fuzz * .12;
    return [k, k, k, w * .7 + fuzz * .3, .95];
  }, {normal: 1.6, rough: false});
}
export function granite(size = 512){
  return build(size, (u, v) => {
    const n = fbm(u * 10, v * 10, 4, 10, 3), s = vnoise(u * 260, v * 260, 260, 5), s2 = vnoise(u * 140, v * 140, 140, 8);
    let c = .07 + n * .06; let r = .22;
    if (s > .86){ c = .55 + s * .3; r = .15; } else if (s2 > .9){ c = .3; }
    return [c, c * .98, c * .95, n * .3, r];
  }, {normal: .5});
}
export function veneer(size = 512, tone = [.62, .45, .30]){
  return build(size, (u, v) => {
    const ring = fbm(u * 3, v * .6, 4, 3, 21) * 10 + u * 14;
    const g = Math.pow(.5 + .5 * Math.sin(ring * 6.283), 2.4), f = fbm(u * 80, v * 4, 2, 80, 2);
    const k = 1 - g * .2 - f * .1;
    return [tone[0] * k, tone[1] * k, tone[2] * k, g * .4 + f * .3, .5];
  }, {normal: 1, rough: false});
}
export function rugTex(size = 512){
  return build(size, (u, v) => {
    const e = Math.min(u, 1 - u, v, 1 - v), fuzz = fbm(u * 120, v * 120, 2, 120, 1);
    let c = [.40, .43, .47];
    if (e < .05) c = [.22, .24, .28]; else if (e < .065) c = [.80, .74, .62];
    else { const p = Math.sin(u * 40) * Math.sin(v * 40); if (p > .6) c = [.48, .51, .55]; }
    const k = .85 + fuzz * .3; return [c[0] * k, c[1] * k, c[2] * k, fuzz, 1];
  }, {rough: false, wrap: false}); // the rug material samples only .map
}

/* ---------------- defect decals ---------------- */
// damp patch: rising damp + seepage with tide lines, efflorescence, mould, peeling paint
export function dampDecal(size = 768){
  return build(size, (u, v) => {
    const prof = Math.pow(v, .9) * .95 + (1 - Math.abs(u - .45) * 1.6) * .25 - .25;
    const n = fbm(u * 3.5, v * 3.5, 5, 64, 31);
    const m = prof + (n - .5) * .7;
    const edgeFade = smooth(0, .12, Math.min(u, 1 - u)) * smooth(0, .08, 1 - v + .08);
    let a = smooth(.30, .40, m) * edgeFade;
    if (a <= .001) return [0, 0, 0, 0, .8, 0];
    // scalar channels instead of c.map(): the arrays cost about five allocations per
    // pixel and dominated this texture. Same operands, same order, same output.
    let c0 = .52, c1 = .44, c2 = .30, al = a * .55, hgt = 0, rgh = .85;
    const tide = Math.pow(Math.abs(Math.sin(m * 52)), 10) * smooth(.3, .5, m) * (1 - smooth(.5, .8, m));
    c0 = c0 - tide * .18; c1 = c1 - tide * .16; c2 = c2 - tide * .12; al = Math.min(1, al + tide * .45);
    const inner = smooth(.45, .75, m), iq = inner * .6;
    c0 = mix(c0, .40, iq); c1 = mix(c1, .37, iq); c2 = mix(c2, .30, iq); al = Math.min(.85, al + inner * .2);
    // efflorescence (salt) near the floor
    const salt = fbm(u * 26, v * 26, 3, 256, 5);
    if (v > .72 && salt > .58){ const s = smooth(.58, .7, salt) * smooth(.72, .9, v); c0 = mix(c0, .95, s); c1 = mix(c1, .95, s); c2 = mix(c2, .95, s); al = Math.max(al, s * .9); hgt += s * .5; }
    // peeling paint flakes
    const peel = fbm(u * 9 + 3, v * 9, 3, 64, 12);
    if (m > .48 && peel > .62){ const p = smooth(.62, .66, peel); c0 = mix(c0, .86, p); c1 = mix(c1, .80, p); c2 = mix(c2, .68, p); al = Math.max(al, p); hgt += p * (1 - smooth(.64, .7, peel)) * 2 + p * .4; rgh = .95; }
    // mould colonies
    const mo = fbm(u * 7 + 9, v * 7 + 2, 3, 64, 40), dots = vnoise(u * 160, v * 160, 160, 3);
    if (mo > .55 && dots > .72 && m > .42){ const d = smooth(.72, .82, dots) * smooth(.55, .65, mo); c0 = mix(c0, .08, d); c1 = mix(c1, .1, d); c2 = mix(c2, .07, d); al = Math.max(al, d); }
    return [c0, c1, c2, hgt, rgh, al];
  }, {normal: 4, alpha: true, rough: false, wrap: false});
}
// crack with chipped paint edge (drawn on canvas), returns {map, normal}
export function crackDecal(size = 512, start = [.92, .95], dir = -2.35, len = 70, w0 = 5){
  const pts = [];
  const hc = canvas2d(size, size, (g, W) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, W, W);
    const walk = (x, y, a, n, w, depth) => {
      const p = [[x, y]];
      for (let i = 0; i < n; i++){ a += rr(-.45, .45); a = mix(a, dir, .12); x += Math.cos(a) * 6; y += Math.sin(a) * 6; p.push([x, y]);
        if (depth < 2 && rnd() < .06) walk(x, y, a + rr(-1.1, 1.1), n * .35, w * .55, depth + 1); }
      pts.push({p, w});
    };
    walk(start[0] * W, start[1] * W, dir, len, w0, 0);
    pts.forEach(({p, w}) => { // chipped edge (raised) then groove (deep)
      g.lineJoin = g.lineCap = 'round';
      g.strokeStyle = '#a8a8a8'; g.lineWidth = w * 2.6; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
      g.strokeStyle = '#000'; g.lineWidth = w; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    });
  });
  const cc = canvas2d(size, size, (g) => {
    pts.forEach(({p, w}) => {
      g.lineJoin = g.lineCap = 'round';
      g.strokeStyle = 'rgba(230,222,206,.9)'; g.lineWidth = w * 2.8; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
      g.strokeStyle = 'rgba(120,108,92,.9)'; g.lineWidth = w * 1.5; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
      g.strokeStyle = 'rgba(28,22,18,1)'; g.lineWidth = w * .8; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    });
  });
  return {map: canvasTex(cc, true, false), normal: normalFromCanvas(hc, 6)};
}
export function normalFromCanvas(c, k){
  const W = c.width, H = c.height, d = c.getContext('2d').getImageData(0, 0, W, H).data, h = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) h[i] = d[i * 4] / 255;
  return toTex(heightToNormal(h, W, H, k), W, H, false, false);
}
export function tileCrack(size = 256){
  return canvas2d(size, size, (g, W) => {
    g.lineCap = g.lineJoin = 'round';
    const p = [[W * .05, W * .3]]; let x = W * .05, y = W * .3;
    while (x < W * .95){ x += rr(10, 22); y += rr(-14, 18); p.push([x, y]); }
    const br = [[p[4][0], p[4][1]], [p[4][0] + 30, p[4][1] + 60], [p[4][0] + 26, W]], br2 = [[p[7][0], p[7][1]], [p[7][0] - 20, p[7][1] - 50], [p[7][0] - 10, 0]];
    [[18, 'rgba(255,255,255,.5)'], [8, 'rgba(18,14,10,.97)']].forEach(([w, s]) => { g.strokeStyle = s; g.lineWidth = w; [p, br, br2].forEach(L => { g.beginPath(); L.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.stroke(); }); });
    g.fillStyle = 'rgba(40,32,24,.95)'; g.beginPath(); g.moveTo(p[2][0], p[2][1]); g.lineTo(p[2][0] + 34, p[2][1] - 8); g.lineTo(p[2][0] + 16, p[2][1] + 28); g.fill(); g.beginPath(); g.moveTo(p[6][0] - 10, p[6][1]); g.lineTo(p[6][0] + 22, p[6][1] + 6); g.lineTo(p[6][0] + 4, p[6][1] + 24); g.fill();
  });
}
export function scorch(size = 256){
  return build(size, (u, v) => {
    const d = Math.hypot(u - .5, (v - .55) * 1.1), n = fbm(u * 8, v * 8, 4, 8, 6);
    const up = Math.max(0, .55 - v) * .5;
    const a = clamp(1 - smooth(.05, .42 + up, d + (n - .5) * .25)) * .95;
    const c = .04 + n * .08;
    return [c, c * .9, c * .8, 0, .9, a];
  }, {alpha: true, rough: false, wrap: false});
}
export function streaks(size = 512){
  return canvas2d(size, size, (g, W) => {
    const blot = g.createRadialGradient(W * .5, 0, 10, W * .5, 0, W * .55);
    blot.addColorStop(0, 'rgba(120,98,60,.55)'); blot.addColorStop(1, 'rgba(120,98,60,0)');
    g.fillStyle = blot; g.fillRect(0, 0, W, W);
    for (let i = 0; i < 26; i++){
      let x = rr(.1, .9) * W, y = 0; const L = rr(.3, .95) * W, w = rr(3, 10);
      g.strokeStyle = `rgba(${rr(85,115)|0},${rr(70,90)|0},50,${rr(.18,.4)})`; g.lineWidth = w; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x, y); while (y < L){ y += 12; x += rr(-2.5, 2.5); g.lineTo(x, y); } g.stroke();
    }
    for (let i = 0; i < 14; i++){ g.fillStyle = 'rgba(230,224,210,.9)'; const x = rr(.2, .8) * W, y = rr(.02, .25) * W; g.beginPath(); g.ellipse(x, y, rr(6, 20), rr(4, 12), rr(0, 3), 0, 7); g.fill(); g.strokeStyle = 'rgba(90,75,55,.6)'; g.lineWidth = 1.5; g.stroke(); }
  });
}
export function wetStain(size = 512){
  return build(size, (u, v) => {
    const n = fbm(u * 4, v * 4, 4, 4, 51), d = Math.hypot((u - .5) * 1.2, (v - .62) * .9);
    const a = clamp(smooth(.5, .2, d + (n - .5) * .35)) * .75;
    const gl = (Math.abs(((u * 3.33) % 1) - .5) > .48 || Math.abs(((v * 1.67) % 1) - .5) > .48) ? .35 : 0; // wet grout lines darker
    const c = .16 + n * .08;
    return [c, c * 1.05, c * 1.1, 0, .2, Math.min(1, a + gl * a * 2)];
  }, {alpha: true, rough: false, wrap: false});
}
export function blob(size = 256, s = 1){
  return build(size, (u, v) => {
    const n = fbm(u * 3, v * 3, 4, 3, s), d = Math.hypot(u - .5, v - .5);
    const a = clamp(1 - smooth(.15, .5, d + (n - .5) * .3));
    return [1, 1, 1, 0, 0, a];
  }, {alpha: true, rough: false, wrap: false}).map;
}
export function arrowsTex(){
  const c = canvas2d(128, 256, (g, W, H) => {
    g.strokeStyle = 'rgba(46,230,214,.95)'; g.lineWidth = 10; g.lineCap = g.lineJoin = 'round';
    for (let i = 0; i < 2; i++){ const y = 50 + i * 128; g.beginPath(); g.moveTo(24, y + 30); g.lineTo(64, y - 10); g.lineTo(104, y + 30); g.stroke(); }
  });
  const t = canvasTex(c); t.wrapS = T.ClampToEdgeWrapping; return t;
}
export function textTex(text, color = '#ff4d5e', w = 256, h = 96, bg = 'rgba(0,0,0,0)'){
  return canvasTex(canvas2d(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.font = `800 ${h * .42}px Inter, Segoe UI, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = color; g.fillText(text, w / 2, h / 2); }), true, false);
}

/* ---------------- images (screen content, art, leaf) ---------------- */
export function landscape(W = 512, H = 288){
  return canvasTex(canvas2d(W, H, (g) => {
    const s = g.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#2f6fb0'); s.addColorStop(.55, '#f3b47a'); s.addColorStop(1, '#f7d7a8'); g.fillStyle = s; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,240,200,.9)'; g.beginPath(); g.arc(W * .7, H * .52, 22, 0, 7); g.fill();
    [['#4a5d7a', .62, 70], ['#2f3e57', .72, 50], ['#1d2737', .85, 40]].forEach(([c, y, a]) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 16) g.lineTo(x, H * y - Math.sin(x * .013 + y * 9) * a * .5 - Math.sin(x * .041) * a * .2); g.lineTo(W, H); g.fill(); });
  }), true, false);
}
export function painting(W = 384, H = 480, pal = ['#d9c7a7', '#c26b4a', '#2f4858', '#e9e1d2', '#86a397']){
  return canvasTex(canvas2d(W, H, (g) => {
    g.fillStyle = pal[3]; g.fillRect(0, 0, W, H);
    g.fillStyle = pal[0]; g.beginPath(); g.arc(W * .35, H * .38, W * .26, 0, 7); g.fill();
    g.fillStyle = pal[1]; g.fillRect(W * .45, H * .45, W * .4, H * .38);
    g.fillStyle = pal[2]; g.beginPath(); g.moveTo(0, H); g.quadraticCurveTo(W * .5, H * .55, W, H * .82); g.lineTo(W, H); g.fill();
    g.strokeStyle = pal[4]; g.lineWidth = 10; g.beginPath(); g.arc(W * .7, H * .25, W * .12, 0, 4); g.stroke();
    for (let i = 0; i < 4000; i++){ g.fillStyle = `rgba(0,0,0,${rnd() * .04})`; g.fillRect(rnd() * W, rnd() * H, 2, 2); }
  }), true, false);
}
export function leafTex(){
  return canvasTex(canvas2d(256, 256, (g, W) => {
    const grd = g.createLinearGradient(0, 0, W, W); grd.addColorStop(0, '#4f8f4a'); grd.addColorStop(1, '#25532a');
    g.fillStyle = grd; g.beginPath(); g.moveTo(W / 2, 4);
    g.bezierCurveTo(W * .98, W * .2, W * .95, W * .75, W / 2, W - 4); g.bezierCurveTo(W * .05, W * .75, W * .02, W * .2, W / 2, 4); g.fill();
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 5; i++){ const y = W * (.25 + i * .12); g.beginPath(); g.ellipse(W * .1, y, W * .14, 6, .4, 0, 7); g.fill(); g.beginPath(); g.ellipse(W * .9, y, W * .14, 6, -.4, 0, 7); g.fill(); }
    g.globalCompositeOperation = 'source-over'; g.strokeStyle = 'rgba(190,230,170,.5)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W / 2, 8); g.lineTo(W / 2, W - 8); g.stroke();
  }), true, false);
}
export function thermalScreen(){
  return canvasTex(canvas2d(256, 192, (g, W, H) => {
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#22106a'); gr.addColorStop(.5, '#b0287a'); gr.addColorStop(1, '#f39a2a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const b = g.createRadialGradient(W * .4, H * .55, 4, W * .4, H * .55, 60); b.addColorStop(0, '#0a0a40'); b.addColorStop(1, 'rgba(10,10,64,0)'); g.fillStyle = b; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2 - 10, H / 2); g.lineTo(W / 2 + 10, H / 2); g.moveTo(W / 2, H / 2 - 10); g.lineTo(W / 2, H / 2 + 10); g.stroke();
    g.fillStyle = '#fff'; g.font = '700 16px monospace'; g.fillText('14.8°C', 10, 22);
  }), true, false);
}
export function lcdTex(text, color = '#3ddc97', W = 256, H = 128){
  return canvasTex(canvas2d(W, H, (g) => { g.fillStyle = '#0b1414'; g.fillRect(0, 0, W, H); g.fillStyle = color; g.font = `700 ${H * .55}px monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 4); }), true, false);
}
export function gaugeFace(){
  return canvasTex(canvas2d(256, 256, (g, W) => {
    g.fillStyle = '#f7f7f2'; g.beginPath(); g.arc(W / 2, W / 2, W / 2, 0, 7); g.fill();
    g.strokeStyle = '#222'; g.lineWidth = 3;
    for (let i = 0; i <= 40; i++){ const a = Math.PI * .75 + i / 40 * Math.PI * 1.5, r1 = W * .42, r2 = i % 5 ? W * .38 : W * .34; g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * r1, W / 2 + Math.sin(a) * r1); g.lineTo(W / 2 + Math.cos(a) * r2, W / 2 + Math.sin(a) * r2); g.stroke(); }
    g.strokeStyle = '#d33'; g.lineWidth = 8; g.beginPath(); g.arc(W / 2, W / 2, W * .44, Math.PI * 1.9, Math.PI * 2.25); g.stroke();
    g.fillStyle = '#222'; g.font = '700 22px Arial'; g.textAlign = 'center'; g.fillText('bar', W / 2, W * .72);
  }), true, false);
}
export function crackCard(){
  return canvasTex(canvas2d(512, 160, (g, W, H) => {
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#111'; g.font = '700 16px Arial';
    [.1, .2, .3, .5, .7, 1, 1.5, 2, 2.5, 3, 4, 5].forEach((mm, i) => { const x = 24 + i * 40; g.fillRect(x, 20, Math.max(1, mm * 2.2), 70); g.fillText(mm, x - 4, 120); });
    g.font = '700 14px Arial'; g.fillText('CRACK WIDTH  mm', 24, 148);
  }), true, false);
}

/* ---------------- worker-backed prewarming ---------------- */
// The builders below do all the per-pixel work (about a second on a fast desktop and
// several times that on a phone). prewarm() runs them inside a worker so the main
// thread stays free, and buildHouse() then finds the pixels already waiting and only
// has to upload them. If the worker is unavailable or fails for any reason the cache
// simply stays empty and every builder computes synchronously, exactly as before.
function memo(name, fn){
  return function(...args){ CURKEY = keyOf(name, args); try { return fn.apply(null, args); } finally { CURKEY = null; } };
}
marbleTiles = memo('marbleTiles', marbleTiles);
woodPlanks = memo('woodPlanks', woodPlanks);
plainTiles = memo('plainTiles', plainTiles);
wallTiles = memo('wallTiles', wallTiles);
paint = memo('paint', paint);
fabric = memo('fabric', fabric);
granite = memo('granite', granite);
veneer = memo('veneer', veneer);
rugTex = memo('rugTex', rugTex);
dampDecal = memo('dampDecal', dampDecal);
scorch = memo('scorch', scorch);
wetStain = memo('wetStain', wetStain);
blob = memo('blob', blob);

export const RASTERISED = {marbleTiles, woodPlanks, plainTiles, wallTiles, paint, fabric, granite, veneer, rugTex, dampDecal, scorch, wetStain, blob};

// Must mirror the calls buildHouse() makes. A mismatch is harmless: that texture is
// simply built on the main thread as before.
const PREWARM = [
  ['paint', [512]],
  ['marbleTiles', [0xece5d8, 4, 768]],
  ['woodPlanks', [768]],
  ['plainTiles', [{base: 0x9a9d9a, nx: 2, ny: 2, rough: .7, speck: .05, grout: 0x7d7f7c}]],
  ['plainTiles', [{base: 0x9c9c98, nx: 2, ny: 2, rough: .45, speck: .08, grout: 0x7c7c78}]],
  ['plainTiles', [{base: 0xa86a4d, nx: 2, ny: 2, rough: .85, speck: .1, grout: 0x7a5442, var: .08}]],
  ['plainTiles', [{base: 0xc4bcae, nx: 2, ny: 2, rough: .7, grout: 0xa39a8a}]],
  ['wallTiles', [{base: 0xdcdedb, cols: 2, rows: 1, grout: 0xc4c4bd}]],
  ['wallTiles', [{base: 0x7f9c8f, cols: 4, rows: 8, stagger: true, grout: 0xe6e3dc, rough: .1}]],
  ['dampDecal', [640]],
  ['dampDecal', [384]],
  ['granite', [512]],
  ['veneer', [512, [.72, .55, .38]]],
  ['veneer', [512, [.42, .28, .18]]],
  ['rugTex', []],
  ['fabric', [256]],
  ['blob', [256, 3]],
  ['blob', [256, 7]],
  ['blob', [256, 11]],
  ['scorch', [256]],
  ['scorch', [128]],
  ['wetStain', [256]],
  ['wetStain', []],
];

export function prewarm(timeoutMs = 10000){
  return new Promise(resolve => {
    let w = null, url = null, left = PREWARM.length, settled = false;
    const finish = () => {
      if (settled) return; settled = true;
      clearTimeout(timer);
      try { if (w) w.terminate(); } catch (e){}
      try { if (url) URL.revokeObjectURL(url); } catch (e){}
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    try {
      const src = typeof document !== 'undefined' && document.getElementById('tex-worker');
      if (!src || typeof Worker === 'undefined' || typeof Blob === 'undefined') return finish();
      url = URL.createObjectURL(new Blob([src.textContent], {type: 'text/javascript'}));
      w = new Worker(url);
      w.onerror = finish;
      w.onmessage = e => {
        const d = e.data;
        if (d && d.key && d.raster) RAWCACHE.set(d.key, d.raster);
        if (--left <= 0) finish();
      };
      w.postMessage({scale: TEX_SCALE, jobs: PREWARM.map(([name, args]) => ({key: keyOf(name, args), name, args}))});
    } catch (e){ finish(); }
  });
}
