/* The apartment: architecture, furnishing, defects (bad / fixed / thermal states) */
import * as THREE from 'three';
import * as TX from './tex.js';
import {std, phys, box, rbox, cyl, sph, lathe, tube, plane, group, mesh, decalMat} from './models.js';

export const H = 2.7, T = 0.14;
const PI = Math.PI;

export function buildHouse(){
  const root = new THREE.Group();
  const house = group(root);
  const defects = {};
  const thermalExtras = group(root); thermalExtras.visible = false; thermalExtras.userData.thermalOnly = true;
  const pick = [], tiles = [], ceilings = [], lights = [];
  const refs = {};
  const D = id => (defects[id] = defects[id] || {bad: group(house), good: group(house), therm: group(root), id});
  const temp = (m, t) => { m.traverse(o => { if (o.isMesh) o.userData.temp = t; }); return m; };
  const decal = m => { m.userData.decal = true; m.castShadow = false; m.receiveShadow = false; return m; };

  /* ---------------- materials ---------------- */
  const paintT = TX.paint(512);
  const mWall = std(0xddd5c7, {map: paintT.map, normalMap: paintT.normal, normalScale: new THREE.Vector2(.4, .4), roughness: .92, envMapIntensity: .55});
  mWall.map.repeat.set(3, 2); mWall.normalMap.repeat.set(3, 2);
  const mWallExt = std(0xd6cdbd, {map: paintT.map, normalMap: paintT.normal, roughness: .95});
  const mCap = std(0x242b39, {roughness: .9});
  const mSkirt = std(0xe9e4da, {roughness: .45});
  const mCeil = std(0xe2ded6, {roughness: .95, side: THREE.FrontSide, envMapIntensity: .4});
  const mGrout = std(0xbdb5a6, {roughness: .9});
  const tm = (t, o = {}) => std(0xffffff, Object.assign({map: t.map, normalMap: t.normal, roughnessMap: t.rough, roughness: 1}, o));
  const marble = TX.marbleTiles(0xece5d8, 4, 768); const mMarble = tm(marble, {envMapIntensity: .7, color: 0xe8e2d8}); mMarble.userData.S = 2.4;
  const wood = TX.woodPlanks(768); const mWood = tm(wood); mWood.userData.S = 1.2;
  const bathF = TX.plainTiles({base: 0x9a9d9a, nx: 2, ny: 2, rough: .7, speck: .05, grout: 0x7d7f7c}); const mBathF = tm(bathF); mBathF.userData.S = .6;
  const kitF = TX.plainTiles({base: 0x9c9c98, nx: 2, ny: 2, rough: .45, speck: .08, grout: 0x7c7c78}); const mKitF = tm(kitF); mKitF.userData.S = 1.2;
  const balF = TX.plainTiles({base: 0xa86a4d, nx: 2, ny: 2, rough: .85, speck: .1, grout: 0x7a5442, var: .08}); const mBalF = tm(balF); mBalF.userData.S = .6;
  const utilF = TX.plainTiles({base: 0xc4bcae, nx: 2, ny: 2, rough: .7, grout: 0xa39a8a}); const mUtilF = tm(utilF); mUtilF.userData.S = .6;
  const bathW = TX.wallTiles({base: 0xdcdedb, cols: 2, rows: 1, grout: 0xc4c4bd}); const mBathW = tm(bathW, {envMapIntensity: .55, color: 0xe6e6e2}); mBathW.userData.S = .6;
  const splash = TX.wallTiles({base: 0x7f9c8f, cols: 4, rows: 8, stagger: true, grout: 0xe6e3dc, rough: .1}); const mSplash = tm(splash, {envMapIntensity: 1.2}); mSplash.userData.S = .6;
  const fab = TX.fabric(256);
  const F = (c, rep = 6) => { const m = std(c, {map: fab.map.clone(), normalMap: fab.normal.clone(), roughness: .95}); m.map.repeat.set(rep, rep); m.normalMap.repeat.set(rep, rep); m.map.needsUpdate = m.normalMap.needsUpdate = true; return m; };
  const mSofa = F(0x8d857a), mMustard = F(0xc49a2c), mTeal = F(0x3e6e72), mLinen = F(0xf2efe8, 4), mDuvet = F(0xa9b8c6, 4), mThrow = F(0xb3603e), mHead = F(0x6f6a64), mCurtain = F(0xe8e0d0, 10), mTowel = F(0xf0ece4, 3), mChair = F(0x5b6670);
  const oakT = TX.veneer(512, [.72, .55, .38]), walT = TX.veneer(512, [.42, .28, .18]);
  const mOak = std(0xffffff, {map: oakT.map, normalMap: oakT.normal, roughness: .5});
  const mWalnut = std(0xffffff, {map: walT.map, normalMap: walT.normal, roughness: .45});
  const gr = TX.granite(512); const mGranite = std(0xffffff, {map: gr.map, roughnessMap: gr.rough, roughness: 1, envMapIntensity: 1.3});
  const mSteel = std(0xcfd4da, {roughness: .25, metalness: 1});
  const mChrome = std(0xffffff, {roughness: .06, metalness: 1});
  const mBlack = std(0x15171b, {roughness: .4});
  const mMetalBlack = std(0x1c1e22, {roughness: .35, metalness: .6});
  const mCeramic = phys(0xf7f7f4, {roughness: .12, clearcoat: .8});
  const mWhiteGloss = std(0xf4f3ef, {roughness: .3});
  const mCab = std(0xe6e1d8, {roughness: .4});
  const mMirror = std(0xe8eef4, {roughness: .02, metalness: 1});
  const mGlass = phys(0xcfe6f2, {roughness: .03, metalness: 0, transparent: true, opacity: .18, depthWrite: false});
  const mAlu = std(0x3c424d, {roughness: .35, metalness: .7});
  const mPot = std(0xe9e4dc, {roughness: .5});
  const mTerra = std(0xa95a39, {roughness: .8});
  const mLeaf = std(0xffffff, {map: TX.leafTex(), alphaTest: .5, side: THREE.DoubleSide, roughness: .6});
  const mStem = std(0x3e6b36, {roughness: .7});
  const mWater = phys(0x4a5f6b, {roughness: .01, metalness: .1, transparent: true, opacity: .82, clearcoat: 1, depthWrite: false, envMapIntensity: 2.2});
  const mWet = new THREE.MeshBasicMaterial({color: 0x000000, map: TX.blob(256, 11), transparent: true, opacity: .55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2});
  const mLampShade = std(0xf3ead8, {emissive: 0xffd9a0, emissiveIntensity: .42, roughness: .9, side: THREE.DoubleSide});
  const mBulb = std(0xffffff, {emissive: 0xfff1d6, emissiveIntensity: 1.6});
  temp(new THREE.Mesh(), 0); // noop
  [mLampShade, mBulb].forEach(m => m.userData.temp = .95);
  mWater.userData.temp = .2; mGlass.userData.temp = .3;

  /* ---------------- helpers ---------------- */
  function worldUV(g, S, mode){ // mode 'xz' floor, 'x' wall along x, 'z' wall along z
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++){
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (mode === 'xz') uv.setXY(i, x / S, -z / S); else if (mode === 'x') uv.setXY(i, x / S, y / S); else uv.setXY(i, -z / S, y / S);
    }
    uv.needsUpdate = true; return g;
  }
  function floor(x1, z1, x2, z2, mat, room, y = 0){
    const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1); g.rotateX(-PI / 2); g.translate((x1 + x2) / 2, y, (z1 + z2) / 2);
    const m = new THREE.Mesh(worldUV(g, mat.userData.S, 'xz'), mat); m.receiveShadow = true; m.userData.room = room; m.userData.temp = .42;
    house.add(m); pick.push(m); return m;
  }
  function clad(axis, fixed, a, b, y0, y1, side, mat){ // tile / splash cladding on a wall face
    const off = side * (T / 2 + .006), len = b - a, c = (a + b) / 2;
    const g = new THREE.PlaneGeometry(len, y1 - y0);
    if (axis === 'x'){ if (side < 0) g.rotateY(PI); g.translate(c, (y0 + y1) / 2, fixed + off); }
    else { g.rotateY(side > 0 ? PI / 2 : -PI / 2); g.translate(fixed + off, (y0 + y1) / 2, c); }
    const m = new THREE.Mesh(worldUV(g, mat.userData.S, axis), mat); m.receiveShadow = true; m.userData.temp = .44; house.add(m); return m;
  }
  const noSkirt = [[-1.5, -4.5, 1.5, -1.5]];
  function wbox(len, h, y0, axis, fixed, center, inner){
    if (len <= .001 || h <= .001) return;
    const faces = axis === 'x'
      ? [mWall, mWall, mCap, mWall, inner === -1 ? mWallExt : mWall, inner === 1 ? mWallExt : mWall]
      : [inner === -1 ? mWallExt : mWall, inner === 1 ? mWallExt : mWall, mCap, mWall, mWall, mWall];
    const m = new THREE.Mesh(new THREE.BoxGeometry(axis === 'x' ? len : T, h, axis === 'x' ? T : len), faces);
    m.position.set(axis === 'x' ? center : fixed, y0 + h / 2, axis === 'x' ? fixed : center);
    m.castShadow = m.receiveShadow = true; m.userData.wall = true; m.userData.temp = .45; house.add(m);
    if (y0 === 0){
      [1, -1].forEach(s => {
        if (inner && s !== inner) return;
        const px = axis === 'x' ? center : fixed + s * (T / 2 + .006), pz = axis === 'x' ? fixed + s * (T / 2 + .006) : center;
        if (noSkirt.some(([a, b, c, d]) => px > a && px < c && pz > b && pz < d)) return;
        box(axis === 'x' ? len : .012, .08, axis === 'x' ? .012 : len, mSkirt, px, 0, pz, house);
      });
    }
  }
  function frameAround(axis, fixed, a, b, top, sides = [1, -1]){
    const w = .07, d = .018;
    sides.forEach(s => {
      const off = s * (T / 2 + d / 2);
      if (axis === 'x'){ box(w, top, d, mSkirt, a - w / 2, 0, fixed + off, house); box(w, top, d, mSkirt, b + w / 2, 0, fixed + off, house); box(b - a + 2 * w, w, d, mSkirt, (a + b) / 2, top, fixed + off, house); }
      else { box(d, top, w, mSkirt, fixed + off, 0, a - w / 2, house); box(d, top, w, mSkirt, fixed + off, 0, b + w / 2, house); box(d, w, b - a + 2 * w, mSkirt, fixed + off, top, (a + b) / 2, house); }
    });
  }
  function windowAt(axis, fixed, a, b, sill, top, inner){
    const w = b - a, h = top - sill, c = (a + b) / 2, g = group(house);
    const along = (len, ht, off, yy, dz = 0) => axis === 'x' ? box(len, ht, .05, mAlu, c + off, yy, fixed + dz, g) : box(.05, ht, len, mAlu, fixed + dz, yy, c + off, g);
    along(w, .05, 0, sill); along(w, .05, 0, top - .05); along(.05, h, -w / 2 + .025, sill); along(.05, h, w / 2 - .025, sill);
    along(.04, h - .1, -.03, sill + .05, -.012); along(.04, h - .1, .03, sill + .05, .012);
    const gl = axis === 'x' ? box(w - .1, h - .1, .012, mGlass, c, sill + .05, fixed, g) : box(.012, h - .1, w - .1, mGlass, fixed, sill + .05, c, g);
    gl.castShadow = false;
    const s = inner || 1; // inner granite sill
    if (axis === 'x') box(w + .12, .03, .1, mGranite, c, sill - .03, fixed + s * (T / 2 + .03), g); else box(.1, .03, w + .12, mGranite, fixed + s * (T / 2 + .03), sill - .03, c, g);
    return g;
  }
  function wall(axis, fixed, a, b, ops = [], inner = 0){
    ops.sort((p, q) => p.a - q.a); let cur = a;
    for (const o of ops){
      if (o.a > cur) wbox(o.a - cur, H, 0, axis, fixed, (cur + o.a) / 2, inner);
      const top = o.top || 2.1;
      wbox(o.b - o.a, H - top, top, axis, fixed, (o.a + o.b) / 2, inner);
      if (o.type === 'window'){ const sill = o.sill ?? .9; wbox(o.b - o.a, sill, 0, axis, fixed, (o.a + o.b) / 2, inner); o.ref = windowAt(axis, fixed, o.a, o.b, sill, top, inner); }
      if (o.type === 'door' && o.frame !== false) frameAround(axis, fixed, o.a, o.b, top, inner ? [inner] : [1, -1]);
      cur = o.b;
    }
    if (b > cur) wbox(b - cur, H, 0, axis, fixed, (cur + b) / 2, inner);
  }
  function ceiling(x1, z1, x2, z2, lightsAt = []){
    const g = new THREE.PlaneGeometry(x2 - x1, z2 - z1); g.rotateX(PI / 2); g.translate((x1 + x2) / 2, H - .002, (z1 + z2) / 2);
    const m = new THREE.Mesh(g, mCeil); m.userData.temp = .5; house.add(m); ceilings.push(m);
    lightsAt.forEach(([x, z]) => { const d = cyl(.06, .06, .01, mBulb, x, H - .012, z, house); d.castShadow = false; d.material = mBulb; });
  }
  function leafPlant(x, z, s = 1, potH = .45){
    const g = group(house, x, 0, z);
    lathe([[0, 0], [.17 * s, 0], [.2 * s, potH * .9], [.21 * s, potH], [.18 * s, potH], [.17 * s, potH * .95], [0, potH * .95]], mPot, 0, 0, 0, g);
    for (let i = 0; i < 11; i++){
      const a = i / 11 * PI * 2 + TX.rr(-.2, .2), L = TX.rr(.45, .8) * s, el = TX.rr(.5, 1.1);
      const tip = [Math.cos(a) * L * .55, potH + L * Math.sin(el) * .9, Math.sin(a) * L * .55];
      tube([[0, potH * .9, 0], [tip[0] * .4, potH + L * .5, tip[2] * .4], tip], .008 * s, mStem, g, 12, 5);
      const lf = plane(.42 * s, .48 * s, mLeaf, tip[0], tip[1], tip[2], 0, 0, g); lf.castShadow = true;
      lf.lookAt(g.position.x + tip[0] * 3, tip[1] + .5, g.position.z + tip[2] * 3); lf.rotateX(-.9);
    }
    return g;
  }
  function puddle(cx, cz, rx, rz, seed = 1, y = .003, mat = mWater, parent = house){
    const s = new THREE.Shape(), N = 48;
    for (let i = 0; i <= N; i++){ const a = i / N * PI * 2, r = 1 + (TX.vnoise(Math.cos(a) * 2 + seed, Math.sin(a) * 2, 64, seed) - .5) * .5; const px = Math.cos(a) * rx * r, pz = Math.sin(a) * rz * r; i ? s.lineTo(px, pz) : s.moveTo(px, pz); }
    const g = new THREE.ShapeGeometry(s); g.rotateX(-PI / 2); const m = new THREE.Mesh(g, mat); m.position.set(cx, y, cz); m.receiveShadow = true; m.userData.temp = .2; parent.add(m);
    if (mat === mWater){ const h = new THREE.Mesh(new THREE.PlaneGeometry(rx * 3, rz * 3.2), mWet); h.rotation.x = -PI / 2; h.position.set(cx, y - .001, cz); h.userData.decal = true; parent.add(h); }
    return m;
  }
  const blobT = TX.blob(256, 3), blobT2 = TX.blob(256, 7);
  // scorch() and wetStain() are pure hash noise with fixed seeds, so the same size
  // always produces the same image. Build each once and share it between defects.
  const scorchT = TX.scorch(256).map, wetStainT = TX.wetStain(256).map;
  function thermPlane(parent, w, h, x, y, z, ry, t, rx = 0, map = blobT){
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({map, color: new THREE.Color().setScalar(t), transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -6}));
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.userData.thermalOnly = true; parent.add(m); return m;
  }

  /* ---------------- slab, floors ---------------- */
  const slab = box(12.4, .32, 9.4, std(0x323a48, {roughness: .9}), 0, -.325, 0, house); slab.userData.temp = .4;
  box(5.9, .32, 1.95, std(0x323a48, {roughness: .9}), -3.25, -.325, 5.42, house);
  // living floor split around the tile-defect zone (x -0.6..2.4, z 2.4..4.2)
  floor(-6, 0, -.6, 4.5, mMarble, 'living'); floor(2.4, 0, 6, 4.5, mMarble, 'utility'); floor(-.6, 0, 2.4, 2.4, mMarble, 'living'); floor(-.6, 4.2, 2.4, 4.5, mMarble, 'living');
  const groutBed = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.8), mGrout); groutBed.rotation.x = -PI / 2; groutBed.position.set(.9, -.003, 3.3); house.add(groutBed);
  floor(-1.5, -1.5, 1.5, 0, mMarble, 'living');
  floor(-6, -4.5, -1.5, 0, mWood, 'bedroom');
  floor(-1.5, -4.5, 1.5, -1.5, mBathF, 'bathroom', .004);
  floor(1.5, -4.5, 6, 0, mKitF, 'kitchen');
  floor(2.5, 0, 6, 2.5, mUtilF, 'utility', .003);
  floor(-6, 4.5, -.5, 6.35, mBalF, 'balcony');

  /* ---------------- walls ---------------- */
  wall('x', -4.5, -6 - T / 2, 6 + T / 2, [{a: -4.6, b: -2.8, type: 'window'}, {a: .5, b: 1.15, type: 'window', sill: 1.75}], 1);
  wall('z', -6, -4.5 + T / 2, 4.5 - T / 2, [], 1);
  wall('z', 6, -4.5 + T / 2, 4.5 - T / 2, [{a: -3.0, b: -1.8, type: 'window', sill: 1.1}, {a: .7, b: 1.7, type: 'window', sill: 1.15}], -1);
  const front = [{a: -5.2, b: -1.2, type: 'door', top: 2.2, frame: false}, {a: 3.85, b: 4.85, type: 'door'}];
  wall('x', 4.5, -6 - T / 2, 6 + T / 2, front, -1);
  wall('x', 0, -6 + T / 2, -1.5, [{a: -2.6, b: -1.75, type: 'door'}]);
  wall('z', -1.5, -4.5 + T / 2, 0 + T / 2);
  wall('x', -1.5, -1.5 + T / 2, 1.5 - T / 2, [{a: .35, b: 1.15, type: 'door'}]);
  wall('z', 1.5, -4.5 + T / 2, 0 + T / 2);
  wall('x', 0, 1.5, 6 - T / 2, [{a: 1.7, b: 2.4, type: 'door', frame: false}, {a: 4.6, b: 5.4, type: 'door'}]);
  wall('z', 2.5, 0 + T / 2, 2.5);
  wall('x', 2.5, 2.5 - T / 2, 6 - T / 2);

  /* ---------------- ceilings + lights ---------------- */
  ceiling(-6, 0, 6, 4.5, [[-4, 1.5], [-4, 3.2], [-2, 1.5], [-2, 3.2], [4.2, 3.4], [4.2, 1.2]]);
  ceiling(-1.5, -1.5, 1.5, 0, [[0, -.75]]);
  ceiling(-6, -4.5, -1.5, 0, [[-3.7, -1.2], [-3.7, -3.4]]);
  ceiling(-1.5, -4.5, 1.5, -1.5, [[0, -3]]);
  ceiling(1.5, -4.5, 6, 0, [[3, -2.4], [4.8, -2.4]]);
  ceiling(-6, 4.5, -.5, 6.35, []);
  const pl = (x, y, z, i = 1.4, d = 5) => { const l = new THREE.PointLight(0xffd6a0, i, d, 2); l.position.set(x, y, z); house.add(l); lights.push(l); return l; };

  /* ---------------- doors ---------------- */
  function door(axis, fixed, a, b, hingeAtA, angle, mat, top = 2.1){
    const w = (b - a) - .02, pivot = new THREE.Group();
    const hx = hingeAtA ? a + .01 : b - .01;
    if (axis === 'x') pivot.position.set(hx, 0, fixed); else pivot.position.set(fixed, 0, hx);
    house.add(pivot);
    const dir = hingeAtA ? 1 : -1;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(axis === 'x' ? w : .04, top - .01, axis === 'x' ? .04 : w), mat);
    leaf.position.set(axis === 'x' ? dir * w / 2 : 0, (top - .01) / 2, axis === 'x' ? 0 : dir * w / 2); leaf.castShadow = leaf.receiveShadow = true; pivot.add(leaf);
    [1, -1].forEach(s => { const k = box(.12, .02, .02, mSteel, axis === 'x' ? dir * (w - .09) : s * .04, 1.0, axis === 'x' ? s * .04 : dir * (w - .09), pivot); });
    pivot.rotation.y = angle; return pivot;
  }
  door('x', 0, -2.6, -1.75, false, -1.35, mOak);
  door('x', -1.5, .35, 1.15, false, -1.5, mOak);
  door('x', 0, 4.6, 5.4, true, -1.4, mOak);
  const mainDoor = door('x', 4.5, 3.85, 4.85, true, 0, mWalnut);
  [.5, 1.1, 1.6].forEach(y => box(.8, .012, .01, std(0x2a1d14), .5, y, .025, mainDoor));
  // balcony slider (aluminium frames + glass)
  function slider(x1, x2, z){
    const w = x2 - x1, c = (x1 + x2) / 2, g = group(house);
    box(w, .05, .05, mAlu, c, 0, z, g); box(w, .05, .05, mAlu, c, 2.15, z, g);
    box(.05, 2.2, .05, mAlu, x1 + .025, 0, z, g); box(.05, 2.2, .05, mAlu, x2 - .025, 0, z, g);
    const gl = box(w - .1, 2.1, .012, mGlass, c, .05, z, g); gl.castShadow = false;
    return g;
  }
  slider(-5.2, -3.15, 4.47); slider(-3.6, -1.55, 4.54);
  box(4.0, .02, .14, mAlu, -3.2, 0, 4.5, house);

  /* ---------------- LIVING ---------------- */
  // TV wall slat panel
  box(.012, H - .02, 2.3, std(0x2a2522, {roughness: .7}), -5.925, 0, 2.3, house);
  const slatG = new THREE.BoxGeometry(.028, H - .04, .035), slatN = 31;
  const slats = new THREE.InstancedMesh(slatG, mWalnut, slatN); slats.castShadow = slats.receiveShadow = true;
  const mm = new THREE.Matrix4(); for (let i = 0; i < slatN; i++){ mm.makeTranslation(-5.905, (H - .04) / 2 + .01, 1.18 + i * .0745); slats.setMatrixAt(i, mm); } house.add(slats);
  rbox(.42, .38, 2.0, .01, mWalnut, -5.7, .16, 2.3, house);
  [1.8, 2.3, 2.8].forEach(z => box(.004, .3, .004, mBlack, -5.488, .2, z, house));
  box(.06, .86, 1.5, mBlack, -5.86, .74, 2.3, house).userData.temp = .6;
  const scr = plane(1.46, .82, new THREE.MeshStandardMaterial({emissiveMap: TX.landscape(), emissive: 0xffffff, emissiveIntensity: .55, color: 0x000000, roughness: .15}), -5.828, 1.17, 2.3, 0, PI / 2, house); scr.userData.temp = .8;
  rbox(.09, .07, .9, .02, mBlack, -5.64, .54, 2.3, house);
  lathe([[0, 0], [.06, 0], [.08, .1], [.05, .22], [.03, .3], [0, .3]], std(0xc8b8a0, {roughness: .3}), -5.7, .54, 1.55, house);
  [[0, .03, 0x7a4b3a], [.03, .025, 0x31475e], [.055, .03, 0xd9cfbd]].forEach(([y, h, c]) => box(.22, h, .3, std(c), -5.72, .54 + y, 3.0, house));
  // sofa (faces -x, back at x=-1.0)
  const sofa = group(house, -1.47, 0, 2.1);
  rbox(.92, .24, 2.25, .05, mSofa, 0, .1, 0, sofa);
  [-.75, 0, .75].forEach(z => { rbox(.72, .17, .74, .07, mSofa, -.08, .33, z, sofa); const b = rbox(.24, .52, .74, .1, mSofa, .3, .4, z, sofa); b.rotation.z = -.14; });
  rbox(.2, .8, 2.25, .06, mSofa, .38, .1, 0, sofa);
  [-1.2, 1.2].forEach(z => rbox(.92, .62, .17, .07, mSofa, 0, .1, z, sofa));
  [[-.4, -1.0], [.4, -1.0], [-.4, 1.0], [.4, 1.0]].forEach(([x, z]) => cyl(.018, .012, .1, mWalnut, x, 0, z, sofa, 10));
  const p1 = rbox(.14, .42, .42, .12, mMustard, .12, .5, -.85, sofa); p1.rotation.set(.1, .2, -.2);
  const p2 = rbox(.14, .4, .4, .12, mTeal, .12, .5, .85, sofa); p2.rotation.set(-.1, -.2, -.2);
  // rug + coffee table
  const rug = plane(2.5, 2.4, std(0xffffff, {map: TX.rugTex().map, roughness: 1}), -3.15, .004, 2.1, -PI / 2, 0, house, true);
  rbox(.62, .035, 1.1, .01, mOak, -3.1, .36, 2.1, house);
  [[-.25, -.48], [.25, -.48], [-.25, .48], [.25, .48]].forEach(([x, z]) => cyl(.012, .012, .36, mMetalBlack, -3.1 + x, 0, 2.1 + z, house, 8));
  [[0, .03, 0x2f4858], [.03, .025, 0xd9c7a7]].forEach(([y, h, c]) => box(.2, h, .26, std(c), -3.1, .395 + y, 1.8, house));
  lathe([[0, 0], [.1, 0], [.14, .06], [.15, .08], [0, .03]], std(0x4a5560, {roughness: .3}), -3.1, .395, 2.4, house);
  // painting on wall z=0 (living side)
  box(.72, .92, .03, mWalnut, -4.75, 1.08, .085, house);
  plane(.64, .84, std(0xffffff, {map: TX.painting(), roughness: .8}), -4.75, 1.54, .102, 0, 0, house);
  // floor lamp
  cyl(.14, .16, .02, mMetalBlack, -1.2, 0, 3.6, house); cyl(.012, .012, 1.5, mMetalBlack, -1.2, .02, 3.6, house);
  lathe([[.1, 0], [.2, -.0], [.22, .02], [.13, .3], [.12, .3]], mLampShade, -1.2, 1.42, 3.6, house);
  pl(-1.2, 1.55, 3.6, 1.2, 4.5);
  leafPlant(-5.45, .55, 1.25);
  // curtains at balcony slider
  function curtain(x, w, z){
    const g = new THREE.PlaneGeometry(w, 2.45, 48, 1), p = g.attributes.position;
    for (let i = 0; i < p.count; i++){ const px = p.getX(i); p.setZ(i, Math.sin(px / w * PI * 9) * .045); }
    g.computeVertexNormals(); const m = mesh(g, mCurtain, x, 1.27, z, house); m.material.side = THREE.DoubleSide; return m;
  }
  curtain(-5.55, .7, 4.33); curtain(-.95, .55, 4.33);
  box(5.0, .025, .025, mChrome, -3.2, 2.5, 4.33, house);
  // dining
  rbox(1.4, .04, .85, .01, mOak, .9, .73, 1.25, house);
  [[-.62, -.36], [.62, -.36], [-.62, .36], [.62, .36]].forEach(([x, z]) => box(.04, .73, .04, mMetalBlack, .9 + x, 0, 1.25 + z, house));
  [[.55, .62, 0], [1.25, .62, 0], [.55, 1.88, PI], [1.25, 1.88, PI]].forEach(([x, z, r]) => {
    const c = group(house, x, 0, z); c.rotation.y = r;
    rbox(.44, .07, .44, .03, mChair, 0, .44, 0, c); rbox(.44, .45, .05, .02, mChair, 0, .5, -.2, c).rotation.x = -.08;
    [[-.19, -.19], [.19, -.19], [-.19, .19], [.19, .19]].forEach(([a, b]) => cyl(.012, .01, .44, mOak, a, 0, b, c, 8));
  });
  cyl(.004, .004, .7, mMetalBlack, .9, 2.0, 1.25, house);
  lathe([[.03, .18], [.22, 0], [.23, -.01], [.04, .19]], std(0x1e2126, {roughness: .4, side: THREE.DoubleSide}), .9, 1.82, 1.25, house);
  sph(.05, mBulb, .9, 1.85, 1.25, house); pl(.9, 1.7, 1.25, 2.2, 5);
  lathe([[0, 0], [.13, 0], [.16, .07], [0, .07]], std(0xd9cfbd, {roughness: .5}), .9, .77, 1.25, house);
  [[.85, 1.2, 0xd04a3a], [.95, 1.3, 0xe9b33d], [.9, 1.32, 0x7aa34a]].forEach(([x, z, c]) => sph(.04, std(c, {roughness: .4}), x, .87, z, house));

  /* ---------------- BEDROOM ---------------- */
  const bed = group(house, -2.62, 0, -2.4);
  rbox(2.05, .26, 1.86, .02, mWalnut, 0, .08, 0, bed);
  rbox(1.98, .24, 1.78, .07, mLinen, -.02, .32, 0, bed);
  rbox(1.42, .08, 1.9, .035, mDuvet, -.3, .52, 0, bed);
  rbox(.5, .035, 1.92, .015, mThrow, -.72, .58, 0, bed);
  [-.45, .45].forEach(z => { const p = rbox(.42, .16, .64, .08, mLinen, .74, .55, z, bed); p.rotation.z = .25; });
  [-.69, -.23, .23, .69].forEach(z => rbox(.07, 1.05, .45, .03, mHead, 1.0, .25, z, bed));
  [-1.2, 1.25].forEach(z => {
    rbox(.42, .46, .44, .01, mOak, -1.83, 0, -2.4 + z, house).position.x = -1.83;
    cyl(.05, .07, .3, std(0xd9cfbd, {roughness: .4}), -1.83, .46, -2.4 + z, house);
    lathe([[.12, 0], [.14, 0], [.1, .2], [.08, .2]], mLampShade, -1.83, .74, -2.4 + z, house);
  });
  pl(-1.83, .9, -3.65, 1.0, 3.5);
  // wardrobe (sliding)
  box(1.9, 2.4, .6, mCab, -4.95, 0, -.38, house);
  [[-5.42, .02], [-4.48, -.02]].forEach(([x, dz]) => { box(.95, 2.34, .02, mOak, x, .03, -.69 + dz, house); box(.02, .9, .02, mSteel, x + (x < -5 ? .43 : -.43), .8, -.71 + dz, house); });
  // AC
  rbox(.22, .3, .95, .04, mWhiteGloss, -1.7, 2.15, -2.4, house); box(.01, .03, .8, std(0x9aa3ad), -1.59, 2.18, -2.4, house);
  plane(1.4, 2.0, std(0xd9cfc0, {roughness: 1}), -4.0, .004, -2.4, -PI / 2, 0, house, true);
  // bedroom curtains tied at window sides
  curtain(-5.05, .4, -4.33); curtain(-2.3, .4, -4.33);
  box(2.9, .025, .025, mChrome, -3.7, 2.35, -4.33, house);

  /* ---------------- BATHROOM ---------------- */
  clad('x', -4.5, -1.43, 1.43, 0, 2.1, 1, mBathW);
  clad('z', -1.5, -4.43, -1.57, 0, 2.1, 1, mBathW);
  clad('z', 1.5, -4.43, -1.57, 0, 2.1, -1, mBathW);
  clad('x', -1.5, -1.43, .28, 0, 2.1, -1, mBathW); clad('x', -1.5, 1.22, 1.43, 0, 2.1, -1, mBathW);
  // WC
  const wc = group(house, -1.12, 0, -2.4);
  rbox(.2, .4, .44, .03, mCeramic, -.21, .38, 0, wc);
  const bowl = lathe([[0, 0], [.14, 0], [.15, .1], [.17, .3], [.2, .38], [.19, .4], [0, .36]], mCeramic, .08, 0, 0, wc); bowl.scale.set(1.35, 1, 1);
  const seat = mesh(new THREE.TorusGeometry(.17, .022, 10, 32), mWhiteGloss, .1, .41, 0, wc); seat.rotation.x = PI / 2; seat.scale.set(1.3, 1, 1);
  const lid = mesh(new THREE.CylinderGeometry(.19, .19, .02, 32), mWhiteGloss, .1, .44, 0, wc); lid.scale.set(1.3, 1, 1);
  cyl(.018, .018, .012, mChrome, -.21, .78, 0, wc);
  // vanity + basin + mirror (back wall)
  rbox(.82, .42, .46, .01, mWalnut, -.7, .42, -4.18, house);
  box(.84, .025, .48, std(0xf1efe9, {roughness: .2}), -.7, .84, -4.18, house);
  lathe([[0, 0], [.13, 0], [.18, .03], [.2, .12], [.19, .125], [.17, .03], [0, .02]], mCeramic, -.7, .865, -4.15, house);
  tube([[-.7, .87, -4.42], [-.7, 1.12, -4.4], [-.7, 1.16, -4.28], [-.7, 1.08, -4.2]], .012, mChrome, house, 24, 8);
  rbox(.72, .82, .02, .01, mMirror, -.7, 1.2, -4.41, house);
  // shower
  const sg = box(.012, 2.0, 1.12, mGlass, .2, .02, -3.87, house); sg.castShadow = false;
  box(.03, .02, 1.12, mChrome, .2, 2.02, -3.87, house);
  tube([[.85, 2.0, -4.43], [.85, 2.2, -4.25], [.85, 2.18, -3.95]], .012, mChrome, house, 16, 8);
  cyl(.12, .12, .015, mChrome, .85, 2.13, -3.92, house);
  rbox(.1, .14, .05, .02, mChrome, .85, 1.05, -4.4, house);
  box(.16, .006, .16, mSteel, .85, .004, -3.9, house);
  // geyser + towel
  cyl(.19, .19, .55, mWhiteGloss, 1.22, 1.6, -3.0, house).userData.temp = .78;
  box(.04, .02, .55, mChrome, 1.4, 1.35, -2.1, house);
  rbox(.06, .6, .5, .03, mTowel, 1.38, .78, -2.1, house);

  /* ---------------- KITCHEN ---------------- */
  const fr = rbox(.72, 1.85, .66, .02, mSteel, 1.95, 0, -4.08, house); fr.userData.temp = .6;
  box(.7, .006, .005, mBlack, 1.95, 1.2, -3.745, house);
  [.6, 1.5].forEach(y => box(.02, .4, .03, mChrome, 2.22, y, -3.73, house));
  // base cabinets (back wall) x 2.38..5.87
  box(3.49, .1, .52, mBlack, 4.125, 0, -4.17, house);
  box(.37, .78, .58, mCab, 2.565, .1, -4.14, house); box(2.42, .78, .58, mCab, 4.66, .1, -4.14, house);
  const shut = (x1, x2, z = -3.84) => { rbox(x2 - x1 - .006, .76, .02, .004, mCab, (x1 + x2) / 2, .11, z, house); box(.18, .015, .02, mSteel, (x1 + x2) / 2, .8, z + .02, house); };
  shut(2.38, 2.75); [[3.45, 4.0], [4.0, 4.55], [4.55, 5.1], [5.1, 5.6]].forEach(([a, b]) => shut(a, b));
  // counter top with sink cut-out (sink x 2.8..3.4, z -4.36..-3.92)
  const ct = (x1, x2, z1, z2) => { const m = box(x2 - x1, .03, z2 - z1, mGranite, (x1 + x2) / 2, .88, (z1 + z2) / 2, house); m.userData.temp = .44; };
  ct(2.36, 2.8, -4.45, -3.8); ct(3.4, 5.9, -4.45, -3.8); ct(2.8, 3.4, -4.45, -4.36); ct(2.8, 3.4, -3.92, -3.8);
  // right counter
  box(.6, .1, 2.83, mBlack, 5.6, 0, -2.42, house); box(.58, .78, 2.83, mCab, 5.58, .1, -2.42, house); ct(5.25, 5.9, -3.8, -1.0);
  [[-3.8, -3.1], [-3.1, -2.4], [-2.4, -1.7], [-1.7, -1.0]].forEach(([a, b]) => { rbox(.02, .76, b - a - .006, .004, mCab, 5.285, .11, (a + b) / 2, house); box(.02, .015, .18, mSteel, 5.27, .8, (a + b) / 2, house); });
  // sink bowl
  const sk = group(house, 3.1, 0, -4.14);
  box(.56, .01, .4, mSteel, 0, .7, 0, sk); box(.56, .2, .01, mSteel, 0, .7, -.2, sk); box(.56, .2, .01, mSteel, 0, .7, .2, sk); box(.01, .2, .4, mSteel, -.28, .7, 0, sk); box(.01, .2, .4, mSteel, .28, .7, 0, sk);
  const rim = [[.62, .02, 0, -.215], [.62, .02, 0, .215], [.02, .41, -.3, 0], [.02, .41, .3, 0]]; rim.forEach(([w, d, x, z]) => box(w, .008, d, mSteel, x, .905, z, sk));
  cyl(.03, .03, .004, mSteel, 0, .71, 0, sk);
  tube([[3.1, .91, -4.4], [3.1, 1.3, -4.38], [3.1, 1.34, -4.2], [3.1, 1.2, -4.12]], .014, mChrome, house, 24, 8);
  // hob, chimney, uppers, splash
  rbox(.62, .012, .5, .005, phys(0x0c0d10, {roughness: .05, clearcoat: 1}), 4.75, .91, -4.12, house);
  [[-.15, -.1], [.15, -.1], [-.15, .12], [.15, .12]].forEach(([x, z]) => { const r = mesh(new THREE.TorusGeometry(.065, .006, 6, 28), std(0x444852, {metalness: .7, roughness: .3}), 4.75 + x, .925, -4.12 + z, house); r.rotation.x = PI / 2; });
  const pot = cyl(.11, .1, .14, mSteel, 4.6, .925, -4.22, house); pot.userData.temp = .9; box(.16, .015, .02, mBlack, 4.42, 1.04, -4.22, house);
  box(.75, .1, .48, mSteel, 4.75, 1.6, -4.2, house); box(.28, .98, .26, mSteel, 4.75, 1.7, -4.3, house);
  clad('x', -4.5, 2.36, 5.87, .91, 1.55, 1, mSplash);
  [[2.36, 4.35], [5.15, 5.87]].forEach(([a, b]) => { box(b - a, .72, .34, mCab, (a + b) / 2, 1.58, -4.26, house); for (let x = a; x < b - .1; x += .5){ box(.004, .7, .004, std(0xbdb6aa), x + .5, 1.59, -4.088, house); } box(b - a - .1, .015, .015, mSteel, (a + b) / 2, 1.62, -4.08, house); });
  rbox(.5, .3, .38, .02, mMetalBlack, 5.55, .91, -1.5, house).rotation.y = -PI / 2;
  lathe([[0, 0], [.11, 0], [.13, .07], [0, .06]], std(0x2b2f36, {roughness: .3}), 5.55, .91, -3.2, house);
  [[5.52, -3.22, 0xe9b33d], [5.58, -3.17, 0xd04a3a]].forEach(([x, z, c]) => sph(.04, std(c, {roughness: .4}), x, .98, z, house));
  box(.3, .018, .22, mOak, 3.85, .91, -4.1, house);

  /* ---------------- UTILITY + FOYER ---------------- */
  const wm = group(house, 5.56, 0, 1.6);
  rbox(.6, .85, .6, .03, mWhiteGloss, 0, 0, 0, wm);
  const ring = mesh(new THREE.TorusGeometry(.17, .025, 12, 36), mChrome, -.31, .45, 0, wm); ring.rotation.y = PI / 2;
  const glassD = mesh(new THREE.CircleGeometry(.16, 32), phys(0x1a2430, {roughness: .05, clearcoat: 1}), -.305, .45, 0, wm); glassD.rotation.y = -PI / 2;
  box(.01, .1, .56, std(0xdfe3e8), -.305, .73, 0, wm);
  box(.6, .3, .5, mCab, 3.3, 0, 2.18, house); box(.6, .5, .5, mCab, 3.3, .3, 2.18, house);
  box(.5, .02, .4, mSteel, 3.3, .8, 2.16, house);
  tube([[3.3, .82, 2.42], [3.3, 1.1, 2.4], [3.3, 1.12, 2.25], [3.3, 1.02, 2.2]], .012, mChrome, house, 16, 8);
  box(.3, .02, 1.0, mOak, 5.78, 1.35, 1.6, house);
  [[1.3, 0x3d7bd9, .22], [1.5, 0xf2f2f2, .26], [1.75, 0xe0503a, .2]].forEach(([z, c, h]) => rbox(.1, h, .08, .02, std(c, {roughness: .4}), 5.78, 1.37, z, house));
  // shoe cabinet + switchboard
  box(.34, .9, 1.1, mOak, 5.76, 0, 3.65, house);
  leafPlant(5.76, 3.4, .5, .2).position.y = .9;
  box(.3, .12, .012, mWhiteGloss, 3.55, 1.2, 4.42, house);

  /* ---------------- BALCONY ---------------- */
  const rail = std(0x2c323d, {roughness: .35, metalness: .7});
  box(5.5, .05, .06, rail, -3.25, 1.05, 6.32, house); box(.06, .05, 1.85, rail, -6, 1.05, 5.42, house); box(.06, .05, 1.85, rail, -.5, 1.05, 5.42, house);
  [box(5.5, 1.0, .015, mGlass, -3.25, .06, 6.32, house), box(.015, 1.0, 1.85, mGlass, -6, .06, 5.42, house), box(.015, 1.0, 1.85, mGlass, -.5, .06, 5.42, house)].forEach(g => g.castShadow = false);
  box(1.4, .32, .4, std(0x4a4f57, {roughness: .7}), -5.1, 0, 6.05, house);
  leafPlant(-5.4, 6.05, .8, .3).position.y = .02; leafPlant(-4.8, 6.05, .7, .3).position.y = .02;
  rbox(.5, .42, .5, .05, std(0x9c8a72, {roughness: .9}), -1.9, 0, 5.55, house); rbox(.5, .45, .08, .04, std(0x9c8a72, {roughness: .9}), -1.9, .4, 5.78, house);
  cyl(.25, .25, .025, mOak, -1.2, .5, 5.5, house); cyl(.02, .02, .5, mMetalBlack, -1.2, 0, 5.5, house);
  cyl(.03, .03, .12, std(0x777777), -.62, .02, 6.28, house).rotation.x = PI / 2;

  /* =========================================================
     DEFECTS
     ========================================================= */
  const S = mMarble.userData.S;
  // 1. TILES — 5 x 3 tiles; hollow: cracked (2,1), lifted (3,1), (1,1), (2,2)
  {
    const d = D('tiles'); d.focus = [.9, .05, 3.3];
    const hollow = new Set(['2,1', '3,1', '1,1', '2,2']);
    const crackT = TX.canvasTex(TX.tileCrack(), true, false);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++){
      const x = -.6 + .6 * i + .3, z = 2.4 + .6 * j + .3, key = i + ',' + j, isH = hollow.has(key);
      const g = new THREE.BoxGeometry(.596, .012, .596); g.translate(x, -.006 + .0004, z); worldUV(g, S, 'xz'); g.translate(-x, 0, -z);
      const t = new THREE.Mesh(g, mMarble); t.position.set(x, 0, z); t.receiveShadow = true; t.castShadow = true; t.userData = {tile: key, hollow: isH, temp: .42, room: 'living'};
      house.add(t); tiles.push(t); pick.push(t);
      if (key === '3,1'){ t.userData.lift = true; d.liftTile = t; }
      if (key === '2,1'){ decal(plane(.6, .6, decalMat(crackT, {roughness: .4}), x, .0035, z, -PI / 2, 0, d.bad)); }
      else if (isH || (i + j) % 2){ const c2 = decal(plane(.6, .6, decalMat(crackT, {roughness: .4, opacity: 0}), x, .0036, z, -PI / 2, 0, d.bad)); c2.rotation.z = (i * 1.3 + j) % 3; c2.userData.ageFade = 1; c2.visible = false; }
      if (key === '3,1'){ // gap + broken grout under the lifted edge
        box(.6, .02, .012, std(0x14110e), x, -.004, z - .3, d.bad); box(.6, .02, .012, std(0x14110e), x, -.004, z + .3, d.bad); box(.012, .02, .6, std(0x14110e), x + .3, -.004, z, d.bad);
        decal(plane(.3, .62, decalMat(TX.scorch(128).map, {opacity: .35}), x + .32, .002, z, -PI / 2, 0, d.bad));
      }
      if (isH) thermPlane(d.therm, .56, .56, x, .004, z, 0, .3, -PI / 2, blobT2);
    }
    d.onState = bad => { const t = d.liftTile; t.position.y = bad ? .016 : 0; t.rotation.z = bad ? .075 : 0; };
  }
  // 2. CRACK at bedroom door corner (living side)
  {
    const d = D('crack'); d.focus = [-2.95, 2.3, .08];
    const c = TX.crackDecal(512, [.96, .98], -2.3, 80, 9);
    decal(plane(1.4, .62, decalMat(c.map, {normalMap: c.normal, roughness: .9}), -3.33, 2.39, .0715, 0, 0, d.bad)).userData.grow = {sx: 1.45, sy: 1.6};
  }
  // 3. SOCKET on TV wall — overloaded, scorched, no earth
  {
    const d = D('socket'); d.focus = [-5.9, .38, 3.65];
    const sx = -5.93, sy = .34, sz = 3.65;
    const plateG = group(house, sx, sy, sz);
    rbox(.016, .09, .09, .006, mWhiteGloss, .008, -.045, 0, plateG);
    [[0, .015, .007], [-.012, -.01, .005], [.012, -.01, .005]].forEach(([dz, dy, r]) => { const h = cyl(r, r, .004, mBlack, .017, dy - .002, dz, plateG, 10); h.rotation.z = PI / 2; h.position.set(.017, dy, dz); });
    // bad: adapter + 3 plugs + cables + scorch + sparks
    const ad = group(d.bad, sx, sy, sz);
    rbox(.07, .09, .11, .012, std(0xefefe9, {roughness: .4}), .045, -.045, 0, ad);
    [[.07, .01, -.022], [.07, -.018, .02], [.07, .022, .024]].forEach(([x, y, z], i) => { rbox(.04, .03, .028, .006, mBlack, x, y - .015, z, ad); });
    tube([[sx + .1, sy + .01, sz - .02], [sx + .25, .05, sz - .2], [sx + .3, .02, sz - .5], [-5.5, .02, 3.1]], .006, mBlack, d.bad, 24, 6);
    tube([[sx + .1, sy - .02, sz + .02], [sx + .22, .03, sz + .1], [sx + .5, .015, sz + .2]], .006, mBlack, d.bad, 24, 6);
    tube([[sx + .1, sy + .02, sz + .02], [sx + .2, .2, sz - .1], [-5.6, .55, 3.25]], .005, std(0xeeeeee), d.bad, 24, 6);
    decal(plane(.45, .5, decalMat(scorchT, {roughness: 1}), sx + .017, sy + .1, sz, 0, PI / 2, d.bad)).userData.grow = {sx: 2.1, sy: 2.3};
    const sp = new THREE.BufferGeometry(); const N = 40, arr = new Float32Array(N * 3); sp.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const sparks = new THREE.Points(sp, new THREE.PointsMaterial({color: 0xffc04a, size: .012, transparent: true, toneMapped: false})); sparks.userData.decal = true; d.bad.add(sparks);
    refs.sparks = {pts: sparks, origin: [sx + .1, sy, sz], N};
    // good: single plug neatly
    const gp = group(d.good, sx, sy, sz); rbox(.035, .035, .025, .006, mBlack, .03, -.018, 0, gp);
    tube([[sx + .04, sy - .01, sz], [sx + .15, .05, sz - .1], [-5.55, .16, 3.1]], .005, mBlack, d.good, 16, 6);
    thermPlane(d.therm, .5, .5, sx + .02, sy + .03, sz, PI / 2, 1.0);
    thermPlane(d.therm, .18, .9, sx + .015, sy + .5, sz - .05, PI / 2, .7);
    d.socket = {x: sx, y: sy, z: sz};
  }
  // 4. DAMP outer bedroom wall
  {
    const d = D('damp'); d.focus = [-5.9, .9, -2.6];
    const dd = TX.dampDecal(640);
    // Layers on this wall are spaced apart in x: the wall face sits at -5.93 and the
    // moisture overlay in engine.js at -5.904. Anything closer than ~2mm z-fights in
    // the ambient-occlusion depth pass, which shimmers across the whole wall.
    decal(plane(3.2, 2.0, decalMat(dd.map, {normalMap: dd.normal, normalScale: new THREE.Vector2(1.2, 1.2), roughness: .95}), -5.9265, 1.0, -2.65, 0, PI / 2, d.bad)).userData.grow = {sx: 1.12, sy: 1.3, anchor: 'bottom', h: 2.0};
    // Sized to stay inside the room: the old 3.9x2.6 plane cut through the back wall
    // at z -4.43 and dropped below the floor, flickering along both intersections.
    thermPlane(d.therm, 3.7, 2.4, -5.9145, 1.2, -2.55, PI / 2, .08);
    d.wall = {x: -5.93, z1: -4.4, z2: -.75, y1: 0, y2: 2.4};
  }
  // 5. WINDOW leak (bedroom back wall window x -4.6..-2.8, sill .9)
  {
    const d = D('window'); d.focus = [-3.7, 1.15, -4.42];
    decal(plane(2.0, .9, decalMat(TX.canvasTex(TX.streaks(), true, false), {roughness: .95}), -3.7, .45, -4.4285, 0, 0, d.bad)).userData.grow = {sx: 1.35, sy: 1};
    const wDamp = decal(plane(2.4, 1.3, decalMat(TX.dampDecal(384).map, {transparent: true, opacity: 0}), -3.7, .62, -4.4275, 0, 0, d.bad)); wDamp.userData.ageFade = .9;
    const gap = plane(.03, 1.12, new THREE.MeshBasicMaterial({color: 0xfff3cf, toneMapped: false}), -2.81, 1.5, -4.428, 0, 0, d.bad); gap.userData.temp = .15;
    box(.025, 1.15, .02, std(0x1a1a1a), -2.78, .93, -4.43, d.bad);
    for (let i = 0; i < 7; i++) sph(.009, mWater, -4.4 + i * .23, .905, -4.36 + (i % 2) * .02, d.bad, 8, 6);
    const bead = std(0xf6f6f2, {roughness: .3});
    [[-3.7, .9, 1.8, 'h'], [-3.7, 2.1, 1.8, 'h'], [-4.6, 1.5, 1.2, 'v'], [-2.8, 1.5, 1.2, 'v']].forEach(([x, y, L, o]) => { const t = o === 'h' ? box(L, .012, .012, bead, x, y - .006, -4.42, d.good) : box(.012, L, .012, bead, x, y - L / 2, -4.42, d.good); });
    thermPlane(d.therm, 2.0, 1.2, -3.7, .5, -4.427, 0, .12);
    thermPlane(d.therm, .15, 1.2, -2.8, 1.5, -4.426, 0, .08);
    d.streakMat = null;
  }
  // 6. CONCEALED PIPE LEAK behind WC
  {
    const d = D('pipe'); d.focus = [-1.4, .8, -2.4];
    decal(plane(1.1, 1.35, decalMat(TX.wetStain().map, {roughness: .25}), -1.4185, .72, -2.4, 0, PI / 2, d.bad)).userData.grow = {sx: 1.6, sy: 1.35, anchor: 'bottom', h: 1.35};
    puddle(-.86, -2.12, .2, .12, 4, .006, mWater, d.bad).userData.grow = {sx: 2.4, flat: true};
    thermPlane(d.therm, 1.3, 1.6, -1.417, .75, -2.4, PI / 2, .1);
    thermPlane(d.therm, .25, 1.0, -1.416, 1.25, -2.4, PI / 2, .18);
  }
  // 7. BATH FLOOR SLOPE — water pools away from drain
  {
    const d = D('slope'); d.focus = [-.2, .05, -3.0];
    puddle(-.22, -3.0, .55, .35, 9, .007, mWater, d.bad).userData.grow = {sx: 1.7, flat: true};
    puddle(.85, -3.9, .12, .1, 2, .007, mWater, d.good).scale.set(.8, 1, .8);
    thermPlane(d.therm, 1.4, 1.0, -.22, .009, -3.0, 0, .18, -PI / 2);
    const flood = puddle(-.1, -2.6, .9, .75, 13, .008, mWater, house); flood.visible = false; d.flood = flood; d.floodFrom = [.1, -3.4];
  }
  // 8. KITCHEN SINK cabinet leak (door x 2.76..3.44)
  {
    const d = D('sink'); d.focus = [3.1, .5, -3.82];
    const pv = new THREE.Group(); pv.position.set(2.765, 0, -3.83); house.add(pv);
    const doorM = rbox(.67, .76, .02, .004, mCab, .335, .11, 0, pv); box(.18, .015, .02, mSteel, .52, .8, .02, pv);
    d.doorPivot = pv;
    // swollen edge + stain on door
    const sw = rbox(.69, .09, .05, .02, std(0x9a8566, {roughness: .95}), .335, .1, .006, pv); d.swollen = sw;
    const stn = decal(plane(.66, .3, decalMat(wetStainT, {color: 0x8a6a3a, opacity: .85}), .335, .3, .0115, 0, 0, pv));
    d.onState = bad => { sw.visible = bad; stn.visible = bad; };
    // cabinet interior (hollow carcass)
    const mIn = std(0xd9d3c7, {roughness: .7});
    box(.68, .012, .56, mIn, 3.1, .1, -4.12, house); box(.68, .78, .012, mIn, 3.1, .1, -4.42, house);
    box(.012, .78, .58, mIn, 2.756, .1, -4.13, house); box(.012, .78, .58, mIn, 3.444, .1, -4.13, house);
    tube([[3.1, .7, -4.14], [3.1, .45, -4.14], [3.2, .35, -4.2], [3.2, .45, -4.38]], .022, std(0xdcdcd6, {roughness: .4}), house, 24, 8);
    puddle(3.1, -4.0, .22, .15, 6, .112, mWater, d.bad);
    box(.5, .015, .35, std(0x8a7a62, {roughness: 1}), 3.08, .102, -4.05, d.bad);
    const drip = sph(.012, mWater, 3.15, .4, -4.16, d.bad, 8, 6); refs.sinkDrip = drip;
    puddle(3.05, -3.7, .2, .08, 3, .004, mWater, d.bad);
    rbox(.08, .2, .08, .02, std(0x3d7bd9), 2.95, .11, -4.2, house);
    thermPlane(d.therm, .7, .5, 3.1, .3, -3.82, 0, .15);
  }
  // 9. DISTRIBUTION BOARD (foyer wall z=2.5, face z=2.57)
  {
    const d = D('db'); d.focus = [5.4, 1.72, 2.65];
    const dbx = 5.4, dby = 1.45, dbz = 2.57;
    box(.46, .56, .09, std(0xd5d8dc, {roughness: .45, metalness: .3}), dbx, dby, dbz + .045, house);
    box(.42, .52, .01, std(0x2b2f36), dbx, dby + .02, dbz + .088, house);
    for (let i = 0; i < 8; i++){ const x = dbx - .17 + i * .048; const burnt = i === 5; box(.04, .09, .03, std(burnt ? 0x2a2420 : 0xf2f2ee, {roughness: .5}), x, dby + .3, dbz + .1, house); box(.012, .025, .015, std(burnt ? 0x111111 : 0x1b4fa3), x, dby + .34, dbz + .12, house); }
    box(.08, .09, .03, std(0xf2f2ee), dbx - .17, dby + .12, dbz + .1, house); box(.06, .025, .015, std(0x2f9d55), dbx - .17, dby + .16, dbz + .12, house);
    const cv = new THREE.Group(); cv.position.set(dbx - .23, dby, dbz + .095); house.add(cv);
    box(.46, .56, .012, std(0xe4e7ea, {roughness: .4, metalness: .3}), .23, 0, 0, cv); box(.02, .06, .02, mBlack, .42, .26, .012, cv);
    d.cover = cv;
    decal(plane(.5, .5, decalMat(scorchT, {roughness: 1}), dbx + .07, dby + .72, dbz + .002, 0, 0, d.bad));
    tube([[dbx + .02, dby + .02, dbz + .1], [dbx + .05, dby - .2, dbz + .14], [dbx - .03, dby - .35, dbz + .1]], .004, std(0xd0332a), d.bad, 16, 6);
    tube([[dbx + .06, dby + .02, dbz + .1], [dbx + .12, dby - .15, dbz + .16], [dbx + .1, dby - .3, dbz + .12]], .004, std(0x2a5bd0), d.bad, 16, 6);
    thermPlane(d.therm, .28, .28, dbx + .07, dby + .34, dbz + .13, 0, 1.0);
    thermPlane(d.therm, .7, .8, dbx, dby + .3, dbz + .005, 0, .65);
  }
  // 10. BALCONY water towards the living room
  {
    const d = D('balcony'); d.focus = [-3.2, .05, 4.72];
    puddle(-3.3, 4.78, 1.3, .24, 21, .006, mWater, d.bad);
    puddle(-3.3, 4.36, .7, .1, 5, .004, mWater, d.bad);
    const wetT = wetStainT; decal(plane(1.6, .5, decalMat(wetT, {opacity: .5, roughness: .3}), -3.3, .0035, 4.2, -PI / 2, 0, d.bad));
    puddle(-.8, 6.12, .22, .14, 8, .006, mWater, d.good);
    thermPlane(d.therm, 3.0, .8, -3.3, .009, 4.7, 0, .16, -PI / 2);
    const flood = puddle(-3.3, 5.2, 2.2, .7, 17, .008, mWater, house); flood.visible = false; d.flood = flood; d.floodFrom = [-3.3, 6.0];
  }
  // general thermal: hot water lines + wiring
  thermPlane(thermalExtras, .1, 2.4, 1.425, 1.05, -3.25, -PI / 2, .78, PI / 2, blobT2);
  thermPlane(thermalExtras, 1.5, .1, 1.425, 1.05, -2.5, -PI / 2, .7, 0, blobT2);
  thermPlane(thermalExtras, 2.9, .08, 4.0, 2.55, 2.57, 0, .6, 0, blobT2);
  thermPlane(thermalExtras, .08, 1.0, 5.4, 2.2, 2.575, 0, .62, 0, blobT2);

  return {root, house, defects, thermalExtras, pick, tiles, ceilings, lights, refs, mats: {mWater}};
}
