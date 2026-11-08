/* Rendering engine: renderer + post FX, camera rig, thermal camera mode, inspection actions, snapshots */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { buildHouse } from './house.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as TOOLS from './models.js';
import * as TX from './tex.js';


const ThermalShader = {
  uniforms: {tDiffuse: {value: null}, uTime: {value: 0}},
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    vec3 iron(float t){ t = clamp(t,0.,1.);
      vec3 c0=vec3(.02,.0,.09), c1=vec3(.24,.02,.58), c2=vec3(.74,.06,.55), c3=vec3(.98,.36,.08), c4=vec3(1.,.8,.14), c5=vec3(1.,1.,.9);
      if(t<.2) return mix(c0,c1,t/.2); if(t<.45) return mix(c1,c2,(t-.2)/.25); if(t<.7) return mix(c2,c3,(t-.45)/.25); if(t<.88) return mix(c3,c4,(t-.7)/.18); return mix(c4,c5,(t-.88)/.12); }
    void main(){ vec4 s = texture2D(tDiffuse, vUv); float l = s.r + (rand(vUv*vec2(731.,517.) + uTime) - .5) * .025;
      vec3 c = iron(l); float v = smoothstep(1.05, .3, length(vUv - .5)); c *= mix(.7, 1., v);
      gl_FragColor = vec4(pow(c, vec3(2.2)), 1.); }`
};

export const VIEWS = {
  overview: {pos: null},
  tiles:   {pos: [2.95, 1.5, 4.05],  t: [1.0, 0, 3.15]},
  crack:   {pos: [-2.7, 1.55, 1.75], t: [-3.1, 2.15, .07]},
  socket:  {pos: [-3.9, 1.35, 4.2], t: [-5.92, .4, 3.6]},
  damp:    {pos: [-3.3, 1.6, -.95], t: [-5.9, .85, -2.65]},
  window:  {pos: [-4.3, 1.5, -1.5], t: [-3.7, 1.1, -4.43]},
  pipe:    {pos: [.85, 1.5, -2.95], t: [-1.42, .75, -2.4]},
  slope:   {pos: [.95, 1.85, -1.78], t: [-.15, 0, -3.2]},
  sink:    {pos: [3.3, 1.4, -2.3], t: [3.1, .42, -3.9]},
  db:      {pos: [4.7, 1.6, 4.0], t: [5.38, 1.68, 2.6]},
  balcony: {pos: [-2.0, 1.6, 6.05], t: [-3.3, .05, 4.6]},
  hero:    {pos: [1.25, 1.7, -.45], t: [-2.7, .3, 3.9]},
};

export function createEngine(canvas, {low = false} = {}){
  const renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  let PR = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.5);
  renderer.setPixelRatio(PR);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .72; // tuned down: whites (walls, marble, ceilings) were clipping on desktop

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;

  // sky + ground
  const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16), new THREE.ShaderMaterial({side: THREE.BackSide, depthWrite: false, uniforms: {},
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'varying vec3 vP; void main(){ float y = vP.y; vec3 lo = vec3(.035,.05,.085), hz = vec3(.40,.47,.58), hi = vec3(.16,.27,.43); vec3 c = y < 0. ? mix(hz*.55, lo, smoothstep(0.,.25,-y)) : mix(hz, hi, smoothstep(0.,.5,y)); gl_FragColor = vec4(c,1.); }'}));
  scene.add(sky);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshStandardMaterial({color: 0x161d29, roughness: 1}));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.33; ground.receiveShadow = true; ground.userData.temp = .38; scene.add(ground);
  scene.fog = new THREE.Fog(0x0b1220, 28, 75);

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x2a241e, .28));
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.1);
  sun.position.set(7, 14, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  Object.assign(sun.shadow.camera, {left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 45});
  sun.shadow.bias = -.0003; sun.shadow.normalBias = .02; scene.add(sun);

  TX.setTexScale(low ? .6 : 1);
  const H = buildHouse(); scene.add(H.root);
  const D = H.defects;
  // DB cover reacts to state
  D.db.onState = bad => { D.db.coverTarget = bad ? -1.95 : 0; };
  D.sink.onStateOrig = D.sink.onState;

  const camera = new THREE.PerspectiveCamera(36, 1, .05, 200);

  // post-processing
  // half-float targets where the GPU can render to them (all modern iOS/Android); 8-bit fallback otherwise
  const hf = renderer.capabilities.isWebGL2 && (renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float'));
  const rt = new THREE.WebGLRenderTarget(16, 16, {type: hf ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: low || !renderer.capabilities.isWebGL2 ? 0 : 4});
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const gtao = new GTAOPass(scene, camera, 16, 16);
  gtao.updateGtaoMaterial({radius: .45, distanceExponent: 1.2, thickness: 1.2, scale: 1.25, samples: 16});
  gtao.updatePdMaterial({lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12});
  gtao.blendIntensity = .95; gtao.enabled = !low && hf;
  composer.addPass(gtao);
  // GTAO re-renders the scene with MeshNormalMaterial, which ignores every material's
  // depthWrite, polygonOffset and transparency. Decals sit a few millimetres off the
  // surface they cover, so they z-fight in the AO depth buffer and the occlusion
  // shimmers as the camera drifts — worst on the large damp-wall decal. A surface that
  // does not write depth in the main render should not write it here either.
  {
    const hidden = [], base = gtao.renderOverride.bind(gtao);
    const noDepth = m => Array.isArray(m) ? m.length > 0 && m.every(x => x && x.depthWrite === false) : !!m && m.depthWrite === false;
    gtao.renderOverride = (rend, mat, target, cc, ca) => {
      scene.traverse(o => { if (o.visible && o.isMesh && noDepth(o.material)){ o.visible = false; hidden.push(o); } });
      try { base(rend, mat, target, cc, ca); } finally { for (const o of hidden) o.visible = true; hidden.length = 0; }
    };
  }
  const thermalPass = new ShaderPass(ThermalShader); thermalPass.enabled = false; composer.addPass(thermalPass);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .16, .45, .93); bloom.enabled = !low; composer.addPass(bloom);
  const cine = new ShaderPass({uniforms: {tDiffuse: {value: null}, uTime: {value: 0}, uVig: {value: 1.0}},
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uVig; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){ vec4 c = texture2D(tDiffuse, vUv); float d = length((vUv - .5) * vec2(1.1, 1.)); c.rgb *= mix(1., smoothstep(1.05, .25, d), uVig * .55);
        c.rgb += (h(vUv * 911. + uTime) - .5) * .018; gl_FragColor = c; }`});
  composer.addPass(cine);
  composer.addPass(new OutputPass());

  /* ---------------- state ---------------- */
  const state = {}; Object.keys(D).forEach(id => state[id] = 'bad');
  let thermal = false;
  function setDefect(id, st){
    const d = D[id]; state[id] = st; const bad = st === 'bad';
    d.bad.visible = bad; d.good.visible = !bad; d.therm.visible = thermal && bad;
    if (d.onState) d.onState(bad);
  }
  function setAll(st){ Object.keys(D).forEach(id => setDefect(id, typeof st === 'string' ? st : (st[id] || 'bad'))); }
  setAll('bad');

  /* ---------------- thermal mode ---------------- */
  const tmCache = new Map();
  function thermMat(t, side = THREE.FrontSide){ const k = Math.round(t * 100) + '_' + side; if (!tmCache.has(k)){ const v = Math.min(1, Math.max(0, Math.round(t * 100) / 100)); tmCache.set(k, new THREE.MeshLambertMaterial({color: new THREE.Color().setScalar(v * .06), emissive: new THREE.Color().setScalar(v * .92), side})); } return tmCache.get(k); }
  const tempOf = o => o.userData.temp ?? (Array.isArray(o.material) ? .45 : o.material.userData?.temp) ?? .48;
  function setThermal(on){
    if (on === thermal) return; thermal = on;
    H.root.traverse(o => {
      if (o.userData.thermalOnly) return;
      if (!(o.isMesh || o.isPoints || o.isInstancedMesh)) return;
      if (on){
        if (o.userData.decal || o.isPoints){ o.userData._vis = o.visible; o.visible = false; return; }
        o.userData._mat = o.material; o.material = thermMat(tempOf(o), Array.isArray(o.material) ? THREE.FrontSide : o.material.side);
      } else {
        if (o.userData._mat){ o.material = o.userData._mat; delete o.userData._mat; }
        if ('_vis' in o.userData){ o.visible = o.userData._vis; delete o.userData._vis; }
      }
    });
    sky.visible = !on; scene.fog = on ? null : fogN;
    ground.userData._m = ground.userData._m || ground.material; ground.material = on ? thermMat(.36) : ground.userData._m;
    Object.keys(D).forEach(id => D[id].therm.visible = on && state[id] === 'bad');
    H.thermalExtras.visible = on;
    thermalPass.enabled = on; gtao.enabled = !on && gtaoAllowed;
    renderer.toneMapping = on ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
  }
  const fogN = scene.fog;

  /* ---------------- camera rig ---------------- */
  const OVER = {tx: 0, ty: 0, tz: .9, r: 22, th: .62, ph: .9, fov: 36};
  const parT = {x: 0, y: 0}, parC = {x: 0, y: 0}, focusPt = new THREE.Vector3();
  const st = {...OVER}, cur = {...OVER};
  let lim = {mode: 'over'};
  function poseFrom(pos, t, fov = 55){ const dx = pos[0] - t[0], dy = pos[1] - t[1], dz = pos[2] - t[2], r = Math.hypot(dx, dy, dz); return {tx: t[0], ty: t[1], tz: t[2], r, th: Math.atan2(dx, dz), ph: Math.acos(dy / r), fov}; }
  function applyPose(c, p){ const sp = Math.sin(p.ph); c.position.set(p.tx + p.r * sp * Math.sin(p.th), p.ty + p.r * Math.cos(p.ph), p.tz + p.r * sp * Math.cos(p.th)); c.lookAt(p.tx, p.ty, p.tz); if (c.fov !== p.fov){ c.fov = p.fov; c.updateProjectionMatrix(); } }
  function wrapTh(){ while (st.th - cur.th > Math.PI) cur.th += Math.PI * 2; while (cur.th - st.th > Math.PI) cur.th -= Math.PI * 2; }
  let baseR = 22;
  function goOverview(instant){ Object.assign(st, OVER, {r: baseR}); lim = {mode: 'over'}; wrapTh(); if (instant) Object.assign(cur, st); }
  let dollyT0 = performance.now();
  function goView(id, instant){ const v = VIEWS[id]; dollyT0 = performance.now(); focusPt.set(...(D[id] ? D[id].focus : v.t));
    const p = poseFrom(v.pos, v.t, aspect < .9 ? 66 : 55); Object.assign(st, p); lim = {mode: 'tour', base: {...p}}; wrapTh(); if (instant) Object.assign(cur, st); }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function constrain(){
    if (lim.mode === 'over'){ st.ph = clamp(st.ph, .3, 1.35); st.r = clamp(st.r, 6, 36); }
    else { const b = lim.base; st.th = clamp(st.th, b.th - .55, b.th + .55); st.ph = clamp(st.ph, b.ph - .3, b.ph + .22); st.r = clamp(st.r, b.r * .55, b.r * 1.35); }
  }

  /* ---------------- tools & action props ---------------- */
  const props = new THREE.Group(); scene.add(props);
  const tester = TOOLS.socketTester(); tester.visible = false; props.add(tester);
  const meter = TOOLS.moistureMeter('--'); meter.visible = false; props.add(meter);
  const gauge = TOOLS.crackGauge(); gauge.visible = false; props.add(gauge);
  const rod = TOOLS.tapRod(); rod.visible = false; props.add(rod);
  const rings = [];
  const ringGeo = new THREE.RingGeometry(.08, .1, 40);
  // moisture heat map on the damp wall
  const mCan = document.createElement('canvas'); mCan.width = 360; mCan.height = 240; const mCtx = mCan.getContext('2d');
  const mTex = new THREE.CanvasTexture(mCan); mTex.colorSpace = THREE.SRGBColorSpace;
  const dw = D.damp.wall, mW = dw.z2 - dw.z1, mH = dw.y2 - dw.y1;
  const mPlane = new THREE.Mesh(new THREE.PlaneGeometry(mW, mH), new THREE.MeshBasicMaterial({map: mTex, transparent: true, opacity: .8, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -8}));
  // +.026 keeps this clear of the damp decal and the thermal plane on the same wall;
  // at +.004 it was exactly coplanar with the thermal plane and the two flickered.
  mPlane.position.set(dw.x + .026, (dw.y1 + dw.y2) / 2, (dw.z1 + dw.z2) / 2); mPlane.rotation.y = Math.PI / 2; mPlane.visible = false; scene.add(mPlane);
  const moisture = (z, y) => state.damp === 'bad'
    ? 9 + 31 * Math.exp(-(((z + 2.6) / 1.35) ** 2) - (((y - .35) / .95) ** 2)) + 16 * Math.exp(-(((z + 3.9) / .55) ** 2) - (((y - 1.55) / .7) ** 2)) + 10 * Math.exp(-(((z + 1.3) / .5) ** 2) - (((y - .2) / .5) ** 2))
    : 9 + Math.sin(z * 3) * .6;
  // spray particles + drips
  const spray = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({color: 0x9fd4ff, size: .02, transparent: true, opacity: .9}));
  spray.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(240 * 3), 3)); spray.visible = false; spray.userData.decal = true; scene.add(spray);
  const arrows = new THREE.Mesh(new THREE.PlaneGeometry(.35, .9), new THREE.MeshBasicMaterial({map: TX.arrowsTex(), transparent: true, depthWrite: false, toneMapped: false}));
  arrows.material.map.wrapT = THREE.RepeatWrapping; arrows.visible = false; scene.add(arrows);

  let action = null; const act = {t: 0};
  function clearAction(){
    if (action === 'thermal' && !globalThermal) setThermal(false);
    clearInterval(act.autoT); act.auto = false;
    action = null; tester.visible = meter.visible = gauge.visible = rod.visible = false; mPlane.visible = false; spray.visible = false; arrows.visible = false;
    [D.slope, D.balcony].forEach(d => d.flood.visible = false);
    if (D.socket.adapterHidden){ D.socket.bad.children.forEach(c => c.visible = true); D.socket.adapterHidden = false; }
    D.sink.doorTarget = 0;
    rings.forEach(r => scene.remove(r)); rings.length = 0;
    tileMarks.forEach(m => scene.remove(m)); tileMarks.length = 0; tapped.clear();
    if (dripPud){ scene.remove(dripPud); dripPud = null; }
  }
  let globalThermal = false;
  const tileMarks = [], tapped = new Map();
  let dripPud = null;
  function startAction(type){
    clearAction(); action = type; act.t = 0;
    if (type === 'thermal') setThermal(true);
    if (type === 'tester'){
      const s = D.socket.socket; tester.position.set(s.x + .05, s.y - .03, s.z); tester.rotation.set(0, Math.PI / 2, 0); tester.visible = true;
      if (state.socket === 'bad'){ D.socket.bad.children.forEach((c, i) => { if (c.isGroup) c.visible = false; }); D.socket.adapterHidden = true; }
      const pat = state.socket === 'bad' ? ['#3ddc97', null, '#ff4d5e'] : ['#3ddc97', '#3ddc97', null];
      tester.userData.leds.forEach((l, i) => { l.material = TOOLS.ledMat(pat[i] || '#555', !!pat[i]); });
    }
    if (type === 'gauge'){ gauge.visible = true; gauge.rotation.set(0, 0, -.55); gauge.position.set(-2.92, 2.2, .5); }
    if (type === 'moisture'){ mPlane.visible = true; mCtx.clearRect(0, 0, mCan.width, mCan.height); mTex.needsUpdate = true; meter.visible = true; meter.rotation.set(0, Math.PI / 2, 0); meter.position.set(dw.x + .03, 1.0, -2.0); }
    if (type === 'open'){ D.sink.doorTarget = -1.75; }
    if (type === 'flood'){ /* set per defect in flood() */ }
    if (type === 'spray'){ spray.visible = true; }
  }
  function flood(id){
    startAction('flood'); const d = D[id]; act.id = id; d.flood.visible = true; d.flood.scale.set(.05, 1, .05);
    const bad = state[id] === 'bad';
    const from = d.floodFrom, to = bad ? [d.flood.userData.cx ??= d.flood.position.x, d.flood.userData.cz ??= d.flood.position.z] : (id === 'slope' ? [.85, -3.9] : [-.8, 6.1]);
    act.from = from; act.to = to; act.bad = bad;
    const ang = Math.atan2(to[0] - from[0], to[1] - from[1]);
    arrows.visible = true; arrows.rotation.set(-Math.PI / 2, 0, ang + Math.PI); arrows.position.set((from[0] + to[0]) / 2, (id === 'slope' ? .012 : .012), (from[1] + to[1]) / 2);
    arrows.material.color.set(bad ? 0xff5d6c : 0x3ddc97);
  }
  // knock sound
  let AC = null;
  function knock(hollow){
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e){ return; }
    const a = AC, t = a.currentTime, out = a.createGain(); out.gain.value = .5; out.connect(a.destination);
    (hollow ? [380, 610, 920] : [150, 240]).forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(); o.type = hollow ? 'triangle' : 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * (hollow ? .92 : .7), t + .2);
      const dur = hollow ? .32 - i * .06 : .07; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(hollow ? .5 / (i + 1) : .9 / (i + 1), t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .02); });
  }
  function tapTile(t, silent){
    const hollow = t.userData.hollow && state.tiles === 'bad';
    if (!silent) knock(hollow);
    const r = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({color: hollow ? 0xff4d5e : 0x3ddc97, transparent: true, toneMapped: false, depthWrite: false}));
    r.rotation.x = -Math.PI / 2; r.position.set(t.position.x, .02, t.position.z); r.userData.t0 = performance.now(); scene.add(r); rings.push(r);
    rod.visible = true; rod.position.set(t.position.x + .35, .03, t.position.z + .25); rod.rotation.set(-.5, 0, .7); rod.userData.t0 = performance.now();
    if (!tapped.has(t.userData.tile)){
      const m = new THREE.Mesh(new THREE.PlaneGeometry(.56, .56), new THREE.MeshBasicMaterial({map: hollow ? TX.textTex('HOLLOW', '#ffffff', 256, 256, 'rgba(255,77,94,.55)') : null, color: hollow ? 0xffffff : 0x3ddc97, transparent: true, opacity: hollow ? .95 : .28, depthWrite: false, toneMapped: false}));
      m.rotation.x = -Math.PI / 2; m.position.set(t.position.x, .016 + (t.userData.lift && state.tiles === 'bad' ? .012 : 0), t.position.z); scene.add(m); tileMarks.push(m);
      tapped.set(t.userData.tile, hollow);
    }
    return {hollow, found: [...tapped.values()].filter(Boolean).length, tapped: tapped.size, total: state.tiles === 'bad' ? 4 : 0};
  }
  function moistAt(p){
    const v = moisture(p.z, p.y);
    meter.position.set(dw.x + .03, p.y + .02, p.z); meter.visible = true;
    const u = (dw.z2 - p.z) / mW, vv = 1 - (p.y - dw.y1) / mH; // plane rotated +90deg: +x local -> -z world
    const col = v < 16 ? '61,220,151' : v < 24 ? '255,181,71' : '255,77,94';
    const g = mCtx.createRadialGradient(u * mCan.width, vv * mCan.height, 0, u * mCan.width, vv * mCan.height, 22);
    g.addColorStop(0, `rgba(${col},${v < 16 ? .06 : .16})`); g.addColorStop(1, `rgba(${col},0)`);
    mCtx.fillStyle = g; mCtx.fillRect(u * mCan.width - 24, vv * mCan.height - 24, 48, 48); mTex.needsUpdate = true;
    return v;
  }

  /* ---------------- interaction ---------------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const wallHit = new THREE.Plane(new THREE.Vector3(1, 0, 0), -dw.x);
  const cbs = {frame: [], tile: null, moist: null, pick: null, interact: null};
  let drag = null, lastTouch = performance.now(), auto = true;
  function setNdc(e){ const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
  function moistFromEvent(e){
    setNdc(e); const p = new THREE.Vector3();
    if (ray.ray.intersectPlane(wallHit, p) && p.z > dw.z1 && p.z < dw.z2 && p.y > 0 && p.y < dw.y2){ const v = moistAt(p); cbs.moist && cbs.moist(v, e); }
  }
  canvas.addEventListener('pointerdown', e => {
    drag = {x: e.clientX, y: e.clientY, moved: 0}; try { canvas.setPointerCapture(e.pointerId); } catch (_){}
    lastTouch = performance.now(); cbs.interact && cbs.interact();
    if (action === 'moisture') moistFromEvent(e);
  });
  canvas.addEventListener('pointermove', e => {
    if (action === 'moisture' && (drag || e.pointerType === 'mouse')){ moistFromEvent(e); if (drag) drag.moved += 99; return; }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved += Math.abs(dx) + Math.abs(dy);
    const k = lim.mode === 'over' ? 1 : .5;
    st.th -= dx * .006 * k; st.ph -= dy * .004 * k; constrain();
    drag.x = e.clientX; drag.y = e.clientY; lastTouch = performance.now();
    if (drag.moved > 5) canvas.classList.add('dragging');
  });
  const end = e => {
    if (drag && drag.moved < 6 && e.type === 'pointerup'){
      setNdc(e); const hit = ray.intersectObjects(H.pick, false)[0];
      if (hit){
        const u = hit.object.userData;
        if (u.tile && action === 'tap'){ const r = tapTile(hit.object); cbs.tile && cbs.tile(r); }
        else if (cbs.pick) cbs.pick(u, hit);
      }
    }
    drag = null; canvas.classList.remove('dragging');
  };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cbs.lost && cbs.lost(); });
  canvas.addEventListener('wheel', e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); st.r *= e.deltaY > 0 ? 1.1 : .9; constrain(); }, {passive: false});

  /* ---------------- sizing ---------------- */
  let W = 1, Hh = 1, aspect = 1;
  function resize(){
    const p = canvas.parentElement; W = p.clientWidth || 1; Hh = p.clientHeight || 1; aspect = W / Hh;
    renderer.setPixelRatio(PR); renderer.setSize(W, Hh, false); composer.setPixelRatio(PR); composer.setSize(W, Hh);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    const nb = aspect < 1.3 ? 22 * Math.pow(1.3 / aspect, .85) : 22;
    if (lim.mode === 'over'){ st.r *= nb / baseR; cur.r *= nb / baseR; }
    baseR = nb; OVER.r = nb;
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); resize();
  let disposed = false;

  /* ---------------- loop ---------------- */
  let last = performance.now(), first = true, viewOff = 0, viewOffY = 0, panelOpen = false, panelSide = 'right', panelFrac = .27;
  const v3 = new THREE.Vector3();
  // adaptive quality: step down if the device can't keep up
  let ema = 16, qLevel = 0, lastQ = performance.now(), gtaoAllowed = !low && hf;
  function degrade(){
    qLevel++;
    if (qLevel === 1){ PR = Math.min(PR, 1); resize(); }
    else if (qLevel === 2){ gtaoAllowed = false; gtao.enabled = false; }
    else if (qLevel === 3){ sun.shadow.mapSize.set(1024, 1024); if (sun.shadow.map){ sun.shadow.map.dispose(); sun.shadow.map = null; } renderer.shadowMap.type = THREE.PCFShadowMap; renderer.shadowMap.needsUpdate = true; }
  }
  function frame(now){
    if (disposed) return;
    requestAnimationFrame(frame);
    const r = canvas.getBoundingClientRect(); const vis = r.bottom > -50 && r.top < innerHeight + 50 && r.width > 0;
    const iv = now - last, dt = Math.min(60, iv) / 16.67; last = now;
    if (vis && !first){ ema = ema * .92 + Math.min(iv, 400) * .08; if (now - lastQ > 2500 && ema > 42 && qLevel < 3 && document.visibilityState === 'visible'){ degrade(); lastQ = now; ema = 30; } }
    if (!vis && !first) return;
    if (auto && !drag && lim.mode === 'over' && now - lastTouch > 4000) st.th += .0014 * dt;
    const k = first ? 1 : 1 - Math.pow(1 - .075, dt);
    for (const key in st) cur[key] += (st[key] - cur[key]) * k;
    const tourPanel = panelOpen;
    const offT = tourPanel && panelSide !== 'bottom' ? (panelSide === 'left' ? -1 : 1) * Math.min(W * .2, 230) : 0, offYT = tourPanel && panelSide === 'bottom' ? Hh * panelFrac : 0;
    viewOff += (offT - viewOff) * k; viewOffY += (offYT - viewOffY) * k;
    parC.x += (parT.x - parC.x) * .06 * dt; parC.y += (parT.y - parC.y) * .06 * dt;
    const tt = now / 1000, dol = lim.mode === 'tour' ? Math.min(1, (now - dollyT0) / 9000) : 0;
    applyPose(camera, {...cur, th: cur.th + parC.x * .09 + Math.sin(tt * .21) * .018, ph: cur.ph + parC.y * .05 + Math.sin(tt * .17) * .01, r: cur.r * (1 - .07 * (1 - Math.cos(dol * Math.PI)) / 2)});
    if (Math.abs(viewOff) > .5 || Math.abs(viewOffY) > .5) camera.setViewOffset(W, Hh, viewOff, viewOffY, W, Hh); else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    animate(now, dt);
    thermalPass.uniforms.uTime.value = now / 1000 % 10; cine.uniforms.uTime.value = now / 1000 % 10;
    composer.render();
    cbs.frame.forEach(f => f(now));
    first = false;
  }
  const dustN = 160, dustG = new THREE.BufferGeometry(), dustBase = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++){ dustBase[i * 3] = (Math.random() - .5) * 2.6; dustBase[i * 3 + 1] = Math.random() * 2.2 + .2; dustBase[i * 3 + 2] = (Math.random() - .5) * 2.6; }
  dustG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dustN * 3), 3));
  const dust = new THREE.Points(dustG, new THREE.PointsMaterial({color: 0xfff2d6, size: .012, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending}));
  dust.frustumCulled = false; scene.add(dust);
  function animate(now, dt){
    { const a = dustG.attributes.position, t = now / 1000, show = lim.mode === 'tour' && !thermal; dust.visible = show;
      if (show) for (let i = 0; i < dustN; i++){ a.setXYZ(i, focusPt.x + dustBase[i * 3] + Math.sin(t * .3 + i) * .08, dustBase[i * 3 + 1] + Math.sin(t * .23 + i * 1.7) * .06, focusPt.z + dustBase[i * 3 + 2] + Math.cos(t * .27 + i) * .08); }
      a.needsUpdate = true; }
    const t = now / 1000;
    // sparks
    const sp = H.refs.sparks; if (sp && D.socket.bad.visible && !thermal){ const a = sp.pts.geometry.attributes.position; const burst = (Math.sin(t * 2.3) > .6 - ageF * 1.5); sp.pts.visible = burst && !D.socket.adapterHidden; for (let i = 0; i < sp.N; i++){ const ph = (t * 2 + i * .37) % 1; a.setXYZ(i, sp.origin[0] + .02 + ph * .08 * Math.sin(i), sp.origin[1] + .02 + ph * .06 * Math.cos(i * 2.1) - ph * ph * .1, sp.origin[2] + ph * .08 * Math.cos(i)); } a.needsUpdate = true; }
    // sink drip
    const dr = H.refs.sinkDrip; if (dr){ const ph = (t * .9) % 1; dr.position.y = .4 - ph * ph * .28; dr.scale.setScalar(ph > .95 ? .01 : 1); }
    // sink door / db cover
    const sd = D.sink.doorPivot; sd.rotation.y += ((D.sink.doorTarget || 0) - sd.rotation.y) * .08 * dt;
    const cv = D.db.cover; cv.rotation.y += ((D.db.coverTarget || 0) - cv.rotation.y) * .1 * dt;
    // tile ripples + rod
    for (let i = rings.length - 1; i >= 0; i--){ const r = rings[i], a = (now - r.userData.t0) / 700; r.scale.setScalar(1 + a * 4); r.material.opacity = Math.max(0, 1 - a); if (a > 1){ scene.remove(r); rings.splice(i, 1); } }
    if (rod.visible){ const a = (now - rod.userData.t0) / 400; rod.rotation.x = -.5 + Math.max(0, .25 - a) * 2; if (a > 3) rod.visible = false; }
    // gauge slide
    if (action === 'gauge'){ gauge.position.z += (.078 - gauge.position.z) * .08 * dt; }
    if (action === 'moisture' && act.auto && act.mt < 1){
      for (let k = 0; k < 3; k++){
        act.mt = Math.min(1, act.mt + .0016 * dt); const rows = 7, rr2 = act.mt * rows, row = Math.floor(Math.min(rr2, rows - .001)), f = rr2 - row;
        const z = dw.z1 + .15 + (row % 2 ? 1 - f : f) * (mW - .3), y = .15 + row * .3;
        const v = moistAt(new THREE.Vector3(dw.x, y, z)); cbs.moist && cbs.moist(v, null);
      }
    }
    // flood
    if (action === 'flood'){
      act.t = Math.min(1, act.t + .006 * dt); const e = 1 - Math.pow(1 - act.t, 2), d = D[act.id];
      const s = act.bad ? .05 + e * .95 : (.05 + Math.sin(Math.min(1, act.t) * Math.PI) * .35);
      d.flood.scale.set(s, 1, s);
      d.flood.position.x = act.from[0] + (act.to[0] - act.from[0]) * e; d.flood.position.z = act.from[1] + (act.to[1] - act.from[1]) * e;
      arrows.material.map.offset.y = -t * .8;
    }
    // spray test
    if (action === 'spray'){
      act.t += .004 * dt; const a = spray.geometry.attributes.position, n = a.count, bad = state.window === 'bad';
      for (let i = 0; i < n; i++){
        const inside = bad && i % 4 === 0, ph = (t * .6 + i * .618) % 1;
        if (inside) a.setXYZ(i, -2.86 + Math.sin(i) * .03, .88 - ph * .86, -4.40 + (i % 3) * .01);
        else a.setXYZ(i, -4.5 + ((i * 37) % 160) / 100, 2.0 - ph * 1.1, -4.6 - (i % 5) * .01);
      }
      a.needsUpdate = true;
      if (bad && !dripPud && act.t > .3){ dripPud = new THREE.Mesh(new THREE.CircleGeometry(.18, 24), H.mats.mWater); dripPud.rotation.x = -Math.PI / 2; dripPud.position.set(-2.95, .006, -4.25); dripPud.scale.set(.1, .1, 1); scene.add(dripPud); }
      if (dripPud) dripPud.scale.setScalar(Math.min(1, .1 + (act.t - .3) * 1.5));
    }
  }
  requestAnimationFrame(frame);

  /* ---------------- fast-forward: how the defect looks in a few years ---------------- */
  let ageF = 0;
  function age(id, f){
    ageF = f; const d = D[id]; if (!d) return;
    d.bad.traverse(o => {
      const g = o.userData.grow;
      if (g){ if (!g.base) g.base = {sx: o.scale.x, sy: o.scale.y, sz: o.scale.z, y: o.position.y};
        const sx = 1 + (g.sx - 1) * f, sy = 1 + ((g.sy ?? g.sx) - 1) * f;
        o.scale.set(g.base.sx * sx, g.base.sy * (g.flat ? 1 : sy), g.base.sz * (g.flat ? sy : 1));
        if (g.anchor === 'bottom') o.position.y = g.base.y + (sy - 1) * g.h / 2; }
      if (o.userData.ageFade){ o.visible = f > .05; if (o.material) o.material.opacity = Math.min(1, f * 1.4) * (o.userData.ageFade); }
    });
  }

  /* ---------------- projection ---------------- */
  function project(p){ v3.set(p[0], p[1], p[2]).project(camera); return {x: (v3.x * .5 + .5) * W, y: (-v3.y * .5 + .5) * Hh, vis: v3.z < 1 && v3.x > -1.15 && v3.x < 1.15 && v3.y > -1.15 && v3.y < 1.15}; }

  /* ---------------- snapshots ---------------- */
  function shot({view = 'overview', w = 1200, h = 800, states = null, thermal: th = false, thermAll = false, pins = [], fov, quality = .88, type = 'image/jpeg', ao = true}){
    const saveState = {...state}, saveTh = thermal, saveAction = action;
    const savedTarget = {W, Hh};
    renderer.setPixelRatio(1); renderer.setSize(w, h, false); composer.setPixelRatio(1); composer.setSize(w, h);
    const cam = camera; const savedCam = {fov: cam.fov, aspect: cam.aspect};
    cam.clearViewOffset(); cam.aspect = w / h;
    const pose = view === 'overview' ? {...OVER, r: 21 * Math.max(1, Math.pow(1.3 / (w / h), .85))} : poseFrom(VIEWS[view].pos, VIEWS[view].t, fov || 55);
    cam.fov = pose.fov; cam.updateProjectionMatrix(); applyPose(cam, pose); cam.updateMatrixWorld();
    const props0 = props.visible; props.visible = false; dust.visible = false;
    if (states) setAll(states);
    setThermal(th);
    if (thermAll) Object.values(D).forEach(d => d.therm.visible = true);
    // settle animated parts
    D.sink.doorPivot.rotation.y = 0; D.db.cover.rotation.y = D.db.coverTarget || 0;
    const g0 = gtao.enabled; gtao.enabled = ao && !th && !low && hf;
    composer.render(); gtao.enabled = g0;
    const url = canvas.toDataURL(type, quality);
    const out = pins.map(id => { const p = (D[id] ? D[id].focus : id); v3.set(p[0], p[1], p[2]).project(cam); return {id, x: (v3.x * .5 + .5), y: (-v3.y * .5 + .5), vis: v3.z < 1}; });
    // restore
    setThermal(saveTh); setAll(saveState); props.visible = props0; dust.visible = !thermal;
    cam.fov = savedCam.fov; cam.aspect = savedCam.aspect; cam.updateProjectionMatrix();
    resize(); applyPose(camera, cur); composer.render();
    return {url, pins: out};
  }
  // tool studio
  const studio = new THREE.Scene(); studio.environment = scene.environment;
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(2, 4, 3); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, {left: -.5, right: .5, top: .5, bottom: -.5}); studio.add(key);
  studio.add(new THREE.HemisphereLight(0xffffff, 0x223344, .5));
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({opacity: .35})); catcher.rotation.x = -Math.PI / 2; catcher.receiveShadow = true; studio.add(catcher);
  const scam = new THREE.PerspectiveCamera(30, 4 / 3, .01, 20);
  function toolShot(name, w = 520, h = 390){
    const m = TOOLS.TOOL_BUILDERS[name](); studio.add(m);
    m.traverse(o => { if (o.isMesh){ o.castShadow = true; } });
    const rot = {thermalCamera: [0, .75, 0], moistureMeter: [-.35, .5, 0], tapRod: [0, .5, -.55], socketTester: [-.2, .6, 0], clampMeter: [-.2, .4, 0], laserLevel: [0, .6, 0], pressureGauge: [-.15, .3, 0], borescope: [-.3, .5, 0], crackGauge: [-.5, .5, 0]}[name] || [0, 0, 0];
    m.rotation.set(...rot); m.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
    m.position.sub(new THREE.Vector3(c.x, bb.min.y, c.z)); catcher.position.y = 0;
    const rad = Math.max(sz.x, sz.y, sz.z) * .62, dist = rad / Math.tan(THREE.MathUtils.degToRad(15)) * 1.3;
    scam.aspect = w / h; scam.updateProjectionMatrix(); scam.position.set(dist * .55, sz.y * .5 + dist * .42, dist * .75); scam.lookAt(0, sz.y * .45, 0);
    key.position.set(rad * 3, rad * 6, rad * 4); key.shadow.camera.left = key.shadow.camera.bottom = -rad * 2; key.shadow.camera.right = key.shadow.camera.top = rad * 2; key.shadow.camera.updateProjectionMatrix();
    const pr = renderer.getPixelRatio(); renderer.setPixelRatio(1); renderer.setSize(w, h, false);
    const cc = renderer.getClearAlpha(); renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.render(studio, scam);
    const url = canvas.toDataURL('image/png');
    studio.remove(m); renderer.setClearColor(0x000000, cc); resize(); composer.render();
    return url;
  }

  function dispose(){
    disposed = true; ro.disconnect();
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(x => { for (const k in x){ const v = x[k]; if (v && v.isTexture) v.dispose(); } x.dispose(); }); });
    composer.dispose && composer.dispose(); rt.dispose(); pmrem.dispose(); renderer.dispose(); try { renderer.forceContextLoss(); } catch (e){}
  }
  return {
    dispose, renderer, scene, camera, D, VIEWS, state,
    age, setParallax: (x, y) => { parT.x = x; parT.y = y; },
    goOverview, goView, setDefect, setAll, isBad: id => state[id] === 'bad',
    setThermal: on => { globalThermal = on; setThermal(on || action === 'thermal'); }, get thermal(){ return thermal; },
    startAction, clearAction, flood, get action(){ return action; },
    shot, toolShot, project, focus: id => D[id].focus,
    zoom: f => { st.r *= f; constrain(); }, setAuto: b => auto = b, get auto(){ return auto; },
    setPanel: (b, side = 'right', frac = .27) => { panelOpen = b; panelSide = side; panelFrac = frac; }, get mode(){ return lim.mode; },
    autoTap: () => { startAction('tap'); const hol = H.tiles.filter(t => t.userData.hollow), sol = H.tiles.filter(t => !t.userData.hollow);
      const order = [sol[2], hol[0], sol[6], hol[1], hol[2], sol[9], hol[3]].filter(Boolean); let i = 0;
      act.autoT = setInterval(() => { if (action !== 'tap' || i >= order.length){ clearInterval(act.autoT); return; } const r = tapTile(order[i++], true); cbs.tile && cbs.tile(r); }, 520); },
    autoMoist: () => { startAction('moisture'); act.auto = true; act.mt = 0; },
    on: (ev, fn) => { if (ev === 'frame') cbs.frame.push(fn); else cbs[ev] = fn; },
    touch: () => lastTouch = performance.now(),
    canvas
  };
}
