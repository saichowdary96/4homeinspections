/* Geometry helpers + inspection tool models */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as TX from './tex.js';

export const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
export function std(color, o = {}){ return new THREE.MeshStandardMaterial(Object.assign({color, roughness: .6, metalness: 0}, o)); }
export function phys(color, o = {}){ return new THREE.MeshPhysicalMaterial(Object.assign({color, roughness: .3, metalness: 0}, o)); }

function place(m, x, y, z, parent, shadow = true){ m.position.set(x, y, z); if (shadow){ m.castShadow = true; m.receiveShadow = true; } if (parent) parent.add(m); return m; }
export const mesh = (g, mat, x, y, z, parent, sh) => place(new THREE.Mesh(g, mat), x, y, z, parent, sh);
// boxes positioned by their bottom (y)
export const box = (w, h, d, mat, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y + h / 2, z, p);
export const rbox = (w, h, d, r, mat, x, y, z, p, seg = 3) => mesh(new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)), mat, x, y + h / 2, z, p);
export const cyl = (rt, rb, h, mat, x, y, z, p, seg = 28) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y + h / 2, z, p);
export const sph = (r, mat, x, y, z, p, ws = 24, hs = 16) => mesh(new THREE.SphereGeometry(r, ws, hs), mat, x, y, z, p);
export function lathe(profile, mat, x, y, z, p, seg = 40){ return mesh(new THREE.LatheGeometry(profile.map(([a, b]) => new THREE.Vector2(a, b)), seg), mat, x, y, z, p); }
export function tube(pts, r, mat, p, seg = 48, rs = 10){ const c = new THREE.CatmullRomCurve3(pts.map(q => new THREE.Vector3(...q))); return mesh(new THREE.TubeGeometry(c, seg, r, rs, false), mat, 0, 0, 0, p); }
export function plane(w, h, mat, x, y, z, rx = 0, ry = 0, p, sh = false){ const m = mesh(new THREE.PlaneGeometry(w, h), mat, x, y, z, p, false); m.rotation.set(rx, ry, 0); m.receiveShadow = sh; return m; }
export function group(parent, x = 0, y = 0, z = 0){ const g = new THREE.Group(); g.position.set(x, y, z); if (parent) parent.add(g); return g; }
export function decalMat(map, o = {}){ return new THREE.MeshStandardMaterial(Object.assign({map, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, roughness: .9}, o)); }

/* ---------- shared tool materials ---------- */
const M = {
  rubber: std(0x22262e, {roughness: .85}),
  rubber2: std(0x34393f, {roughness: .8}),
  orange: std(0xf28c28, {roughness: .45}),
  yellow: std(0xf5c518, {roughness: .4}),
  white: std(0xf4f4f1, {roughness: .35}),
  steel: std(0xd0d5dc, {roughness: .22, metalness: 1}),
  chrome: std(0xffffff, {roughness: .08, metalness: 1}),
  brass: std(0xc9a24a, {roughness: .3, metalness: 1}),
  glass: phys(0x111418, {roughness: .02, metalness: .2, clearcoat: 1}),
  green: std(0x1f7a4d, {roughness: .45}),
};
export const ledMat = (c, on = true) => std(on ? c : 0x3a3a3a, {emissive: on ? c : 0x000000, emissiveIntensity: on ? 2.2 : 0, roughness: .3});

export function thermalCamera(){
  const g = new THREE.Group();
  rbox(.11, .1, .2, .02, M.rubber, 0, .1, 0, g);
  rbox(.115, .03, .19, .01, M.orange, 0, .2, 0, g);
  const grip = rbox(.07, .16, .08, .02, M.rubber2, 0, -.02, .05, g); grip.rotation.x = -.25;
  cyl(.034, .036, .04, M.rubber, 0, .15, -.11, g).rotation.x = Math.PI / 2;
  const lens = cyl(.026, .026, .006, M.glass, 0, .15, -.132, g); lens.rotation.x = Math.PI / 2;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.085, .065), new THREE.MeshBasicMaterial({map: TX.thermalScreen(), toneMapped: false}));
  scr.position.set(0, .155, .101); g.add(scr);
  box(.02, .012, .03, M.yellow, 0, .07, -.015, g);
  return g;
}
export function moistureMeter(text = '27%', color = '#ffb547'){
  const g = new THREE.Group();
  rbox(.07, .15, .03, .012, M.orange, 0, 0, 0, g);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(.05, .03), new THREE.MeshBasicMaterial({map: TX.lcdTex(text, color), toneMapped: false}));
  lcd.position.set(0, .11, .0155); g.add(lcd);
  [-.012, .012].forEach(x => { cyl(.007, .007, .006, M.rubber, x, .05, .016, g).rotation.x = Math.PI / 2; cyl(.0022, .0018, .035, M.steel, x * 1.4, .15, 0, g); });
  return g;
}
export function tapRod(){
  const g = new THREE.Group();
  cyl(.016, .016, .22, M.rubber, 0, 0, 0, g);
  cyl(.009, .009, .45, M.steel, 0, .22, 0, g); cyl(.006, .006, .35, M.chrome, 0, .67, 0, g);
  sph(.022, M.steel, 0, 1.04, 0, g);
  return g;
}
export function socketTester(pattern = ['#3ddc97', null, '#ff4d5e']){
  const g = new THREE.Group();
  rbox(.075, .06, .045, .014, M.white, 0, 0, 0, g);
  const leds = pattern.map((c, i) => sph(.0055, ledMat(c || '#555', !!c), -.02 + i * .02, .04, .0225, g, 12, 8));
  [[0, .016], [-.011, -.004], [.011, -.004]].forEach(([x, y], i) => { const p = cyl(i ? .0025 : .0035, i ? .0025 : .0035, .02, M.brass, x, .03 + y - .01, -.032, g); p.rotation.x = Math.PI / 2; p.position.set(x, .03 + y, -.032); });
  g.userData.leds = leds;
  return g;
}
export function clampMeter(){
  const g = new THREE.Group();
  rbox(.07, .16, .035, .014, M.yellow, 0, 0, 0, g);
  const jaw = new THREE.Mesh(new THREE.TorusGeometry(.035, .012, 12, 32, Math.PI * 1.7), M.rubber); jaw.position.set(0, .2, 0); jaw.rotation.z = -Math.PI * .35; jaw.castShadow = true; g.add(jaw);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(.05, .03), new THREE.MeshBasicMaterial({map: TX.lcdTex('230V', '#ffd84f'), toneMapped: false})); lcd.position.set(0, .12, .018); g.add(lcd);
  cyl(.013, .013, .006, M.rubber, 0, .06, .018, g).rotation.x = Math.PI / 2;
  return g;
}
export function laserLevel(lines = true){
  const g = new THREE.Group();
  rbox(.09, .1, .09, .012, M.green, 0, 0, 0, g); rbox(.1, .02, .1, .008, M.rubber, 0, -.01, 0, g);
  [[0, .06, .046, 0], [.046, .06, 0, Math.PI / 2]].forEach(([x, y, z, r]) => { const w = new THREE.Mesh(new THREE.PlaneGeometry(.04, .035), new THREE.MeshStandardMaterial({color: 0x99ffcc, emissive: 0x33ff99, emissiveIntensity: .8, roughness: .1})); w.position.set(x, y, z); w.rotation.y = r; g.add(w); });
  if (lines){ const lm = new THREE.MeshBasicMaterial({color: 0x37ff8b, transparent: true, opacity: .85, toneMapped: false}); const a = new THREE.Mesh(new THREE.PlaneGeometry(.3, .003), lm); a.position.set(0, .06, .15); a.rotation.x = -Math.PI / 2; g.add(a); const b = new THREE.Mesh(new THREE.PlaneGeometry(.003, .3), lm); b.position.set(0, .06, .15); b.rotation.x = -Math.PI / 2; g.add(b); }
  return g;
}
export function pressureGauge(){
  const g = new THREE.Group();
  const body = cyl(.055, .055, .03, M.steel, 0, 0, 0, g); body.rotation.x = Math.PI / 2; body.position.set(0, .1, 0);
  const face = new THREE.Mesh(new THREE.CircleGeometry(.048, 40), new THREE.MeshStandardMaterial({map: TX.gaugeFace(), roughness: .3})); face.position.set(0, .1, .016); g.add(face);
  const needle = box(.003, .04, .002, std(0xcc2222), 0, .1, .018, g); needle.geometry.translate(0, -.02 + .02, 0); needle.rotation.z = .6;
  const gl = new THREE.Mesh(new THREE.CircleGeometry(.05, 40), phys(0xffffff, {transparent: true, opacity: .15, roughness: 0, clearcoat: 1})); gl.position.set(0, .1, .02); g.add(gl);
  cyl(.009, .009, .05, M.brass, 0, .0, 0, g); cyl(.014, .014, .015, M.brass, 0, -.015, 0, g);
  tube([[0, -.02, 0], [0, -.08, .02], [.08, -.12, .05], [.18, -.1, .02]], .008, std(0x1a1d22, {roughness: .5}), g, 24, 8);
  return g;
}
export function borescope(){
  const g = new THREE.Group();
  rbox(.1, .14, .03, .015, M.rubber, 0, 0, 0, g);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.08, .06), new THREE.MeshBasicMaterial({map: TX.landscape(256, 192), toneMapped: false})); scr.position.set(0, .095, .016); g.add(scr);
  rbox(.04, .09, .03, .01, M.rubber2, 0, -.08, 0, g);
  tube([[0, -.08, 0], [0, -.2, .02], [.12, -.26, .06], [.25, -.18, .05], [.32, -.05, .02]], .005, std(0x111317, {roughness: .4}), g, 48, 8);
  cyl(.008, .008, .025, M.steel, .32, -.06, .02, g);
  sph(.004, ledMat('#fff6d0'), .32, -.033, .02, g, 8, 6);
  return g;
}
export function crackGauge(){
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({map: TX.crackCard(), transparent: true, roughness: .2});
  const c = new THREE.Mesh(new RoundedBoxGeometry(.2, .065, .002, 2, .0008), m); g.add(c);
  return g;
}
export const TOOL_BUILDERS = {thermalCamera, moistureMeter, tapRod, socketTester, clampMeter, laserLevel, pressureGauge, borescope, crackGauge};
