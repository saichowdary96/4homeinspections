# agent skills — HomeLens 3D home-inspection site

> Working memory for humans and AI agents. Read this before changing anything.
> It records what was built, why, how it works, and what we learned, so work can
> resume without rediscovering past decisions.
>
> _Created using Anthropic Claude. Internal draft — review and verify before any
> public release (customer-facing output needs Technology Intake review)._

---

## 1. Status at a glance

| Item | State |
|---|---|
| Deliverable | **One self-contained file: `site/index.html`** (~800 KB; no external requests, works offline / from `file://`) |
| Brand | "HomeLens" — placeholder name, kept by decision |
| Market | India: ₹, BHK, "possession", builder must fix defects before handover |
| Repo history | This folder used to hold a Next.js "4HomeInspections" site (commit `2618951`). The owner chose to **replace it entirely** with HomeLens (Nov 2026). An intermediate attempt merged the tour into that Next.js site; it was discarded as too complex. |
| Pricing, savings, stats, FAQ answers | **Placeholders** — replace before launch |
| Forms (`#bookForm`, `#consultForm`) | Front-end only (validation + thank-you state). Need a backend/CRM. |
| Tested | Desktop Chrome-class rendering via preview screenshots (phone portrait 390×844, landscape 844×390, desktop 1440×900), script parse checks, jsdom smoke tests. **Not yet tested on real iOS/Android devices.** |

---

## 2. Run, edit, build

```bash
npm install          # one time: three@0.160.0 + esbuild (devDependencies)
npm run build        # bash src/build.sh → site/index.html
npm run serve        # python3 http.server on 0.0.0.0:8000 (serves site/)
```

- Open `site/index.html` directly for a quick look.
- **Phones on the same Wi-Fi:** `Start HomeLens server.command` (macOS double-click):
  picks a free port from 8080, prefers the Wi-Fi adapter IP, prints and copies the
  URL, opens `site/qr.html?u=<url>` (QR code, generator inlined, MIT). Falls back to
  ruby/php if python3 is missing.
- **Phone can't connect:** `Check phone connection.command` (read-only): shows
  Wi-Fi IP, VPN, macOS firewall/stealth mode/MDM, whether the server is listening,
  a self-test, and the exact URL. Usual causes: office Wi-Fi client isolation (use a
  phone hotspot), VPN, firewall blocking incoming connections, typing `https://`.
- `build.sh` concatenates: `<style>` styles.css, body.html, `<script>` data.js +
  illustrations.js, `<script>` esbuild IIFE bundle of `src/3d/main.js` (+ three),
  `<script>` app.js. Intermediate bundle goes to `.build/` (git-ignored).
- `site/index.html` is committed so the site works without building.

---

## 3. File map

```
site/index.html          built output (commit after rebuilding)
site/qr.html             QR helper used by the server launcher
src/
  body.html              all markup (sections below)
  styles.css             all styles (mobile-first; desktop ≥1024px block near the tour CSS)
  data.js                icons (IC/icon), inr/inrK, CATS (7 categories), DEFECTS (10),
                         CAT_DEFECT, TOOLS, STEPS, RISK_A/B, FAQ, STORY, STORY_TXT, LATER,
                         PLAN + planCalc()  ← edit copy & numbers here
  illustrations.js       SVG before/after art (BA) used when WebGL is unavailable
  app.js                 page behaviour: shot queue, in-view helper, nav auto-hide,
                         personalised plan, THE TOUR UI, value section, FAQ,
                         sticky CTA, forms, consult modal
  3d/main.js             boots the 3D after first paint (requestIdleCallback) → window.HL
  3d/story.js            initStory(): creates engine, pins/focus ring, crossfades,
                         activate(pageKey), setPhase(0|1|2), age(f), parallax(x,y)
  3d/engine.js           createEngine(canvas,{low}) — renderer, camera rig, post FX, actions
  3d/house.js            buildHouse(): flat, furniture, lights, 10 defects
  3d/models.js           geometry helpers + inspection tool models
  3d/tex.js              procedural PBR textures & defect decals (canvas)
  build.sh
Start HomeLens server.command, Check phone connection.command
```

### Page sections (body.html, in order)
`#progress` bar · fixed pill `nav#nav` (auto-hides on scroll-down) ·
**`#story` (.xp) — the tour** · `#value` (one visit/fee, checklist, report mock with
3D thumbnails) · `header#plan` (personalised quote: type + BHK segmented buttons,
every `[data-plan]` element on the page updates) · `#book` (booking form) · `#faq` ·
footer · `#stickyCta` (appears only after the tour) · `#consult` modal (call-back form).

---

## 4. The tour (the core experience)

### 4.1 Paging
- `#story.xp` is a vertical **CSS scroll-snap** container (`y mandatory`,
  `scroll-snap-stop: always`). Inside: a **sticky** `.stage` (canvas `#scene`,
  `#xfade` dissolve image, `#stageFallback` SVG, `#hotspots`, captions, controls)
  and invisible `.xp-page` spacers in `#steps`: `intro`, 7 stops, `outro`.
- One swipe / wheel notch / arrow key = one stop; native momentum on iOS/Android.
- At the last page, scrolling **chains** to the page (don't set `overscroll-behavior: contain`).
- Exits: **Exit ✕** button, Esc, Next on the last page → scroll to `#value`.
- `xp.dataset.page = key` drives CSS (`.xp[data-page=intro]` etc.).
- Room changes **dissolve** (canvas `toDataURL` → `#xfade` fade) with an instant camera
  cut. Camera fly-throughs passed through walls and were removed.

### 4.2 Per-stop timeline (app.js)
- `TL = [0, 1500, 6400]` ms → phase 0 **Problem**, 1 **Proof** (tool demo), 2 **Fixed**;
  `DUR = 7800` fills the progress segment, then the Next button pulses. **No auto-advance**
  between stops (visitor stays in control).
- Phase chips jump the timeline. Phase 0 shows a pulsing focus ring on the defect.
- **Hold · see it in 3 years**: pauses the timeline, `story.age(f)` grows damage 0→1 over
  ~2.2 s, caption switches to `LATER[id]`, cost counter climbs `cost[0]→cost[1]`;
  release eases back. Android vibrates (`navigator.vibrate`; iOS ignores it).
- Captions sit directly on the image (gradient, no panels); headline words animate in (`.w`, `--i`).
- Look around: mouse position (desktop) or gyroscope (touch, button `#xpMotion`;
  iOS requires `DeviceOrientationEvent.requestPermission()` in the tap).
- Story order `STORY = ['damp','window','pipe','slope','socket','tiles','crack']`.
- Outro page: overview with numbered pins for all defects + CTAs.

### 4.3 Layout per screen
- **Phones (portrait):** caption across the bottom; controls bottom-left; round Next
  bottom-right; camera framing lifted (`setPanel(true,'bottom',.15)`).
- **Landscape phones** (`orientation:landscape and max-height:560px`): compact caption
  bottom-left (max 58vw), `setPanel(true,'left',.06)`.
- **Desktop ≥1024px:** caption column on the left (`width:min(620px,46vw)`, horizontal
  gradient), controls aligned to it, labelled **Next** pill bottom-right, progress top-left,
  and the camera view offset so the home sits on the right (`setPanel(true,'left',…)`).
  ≥1600px: wider left margin.
- Units use `svh` + safe-area insets; no fullscreen button in this build.

---

## 5. 3D engine (engine.js)

API returned by `createEngine(canvas, {low})`:
`goOverview(instant)`, `goView(id, instant)`, `setPanel(open, side, frac)`,
`setDefect(id,'bad'|'good')`, `setAll(state|map)`, `isBad`, `startAction(type)`,
`flood(id)`, `autoTap()`, `autoMoist()`, `clearAction()`, `age(id,f)`,
`setThermal(on)`, `setParallax(x,y)`, `setAuto(bool)`, `zoom(f)`,
`project([x,y,z])→{x,y,vis}`, `focus(id)`, `shot(opts)→{url,pins}`, `toolShot(name)`,
`on('frame'|'lost'|…)`, `dispose()`, plus `renderer, scene, camera, D, VIEWS, state`.

- **Camera:** spherical rig (`tx,ty,tz,r,th,ph,fov`) with damped lerp. Per-stop poses in
  `VIEWS` (`{pos, t}`). Additive slow dolly-in, gentle sine drift, parallax.
  `setPanel` uses `camera.setViewOffset` to frame around captions.
- **Post chain:** RenderPass (MSAA ×4, HalfFloat RT when supported, UnsignedByte
  fallback) → GTAOPass (desktop) → thermal ShaderPass (ironbow; thermal mode only) →
  UnrealBloomPass (desktop; strength .16, radius .45, threshold .93) → vignette + grain
  ShaderPass (uVig 1.0) → OutputPass (ACES).
- **Lighting (tuned for desktop — "too bright" feedback):** exposure **.72**, sun 2.1,
  hemisphere .28, RoomEnvironment IBL via PMREM; darker sky (horizon `.40,.47,.58`,
  zenith `.16,.27,.43`); walls `0xddd5c7`, ceiling `0xe2ded6` (env .4), marble env .7,
  bath walls .55, lampshade emissive .42, bulb 1.6, TV .55.
  Earlier exposure .82–1.0 made whites clip on large screens.
- **Thermal mode:** every mesh temporarily uses a Lambert material with emissive =
  `userData.temp` (0–1), decals hidden, `therm` groups shown; must keep the original
  material `side` (else downward-facing ceilings appear from above).
- **Adaptive quality:** if frame time EMA > 42 ms → pixel ratio 1, GTAO off, smaller
  shadows. `low` path (all touch devices incl. iPadOS via `maxTouchPoints>1`, small
  screens, `deviceMemory<4`): PR 1.25, no MSAA/GTAO/bloom, 1024 shadows, textures 60%.
- Renders only when the canvas is on screen. `lost` event → reload prompt.
- No WebGL → `body.nogl`, SVG fallback illustrations per stop.
- Shots (thumbnails in `#value`) are queued and **deferred while the tour is visible**
  to avoid hitches.

## 6. The flat (house.js)

Metres. Plan 12 × 9 (x −6..6, z −4.5..4.5), wall height 2.7, thickness .14.
Rooms: bedroom (x −6..−1.5, z −4.5..0), bathroom (−1.5..1.5, −4.5..−1.5), kitchen
(1.5..6, −4.5..0), living (−6..2.5, 0..4.5), utility (2.5..6, 0..2.5), foyer
(2.5..6, 2.5..4.5), balcony (−6..−0.5, 4.5..6.35). Ceilings = single-sided planes
facing down. Floors use world-space UVs so tiles align across rooms. Slab top at −0.005.

| id | Where | Bad state | Proof action | `age()` growth |
|---|---|---|---|---|
| damp | bedroom wall x=−6 | tide marks, peeling, mould, salts | `moisture` (auto heat-map sweep) | grows upward `{sx:1.12, sy:1.3, anchor:'bottom', h:2.0}` |
| window | bedroom window | streaks, daylight gap | `spray` | streaks `{sx:1.35}`, damp patch fades in (.9) |
| pipe | bathroom wall behind WC | wet stain, puddle | `thermal` (cold trail) | stain `{sx:1.6, sy:1.35}`, puddle `{sx:2.4, flat}` |
| slope | bathroom floor | puddle away from drain | `flood` | puddle `{sx:1.7, flat}` |
| socket | living TV wall | scorch, overloaded adapter, sparks | `tester` (no earth) | scorch `{sx:2.1, sy:2.3}` |
| tiles | living floor zone | cracked + lifted tile, 4 hollow | `tap` (auto-tap marks HOLLOW) | extra cracks fade in |
| crack | living wall above bedroom door | diagonal crack | `gauge` (2.6 mm card) | `{sx:1.45, sy:1.6}` |
| sink, db, balcony | kitchen / foyer / balcony | modelled, not in the story | open / thermal / flood | — |

Each defect: `D[id] = {bad, good, therm, focus, …}` groups toggled by `setDefect`.

**Add or change a stop:** model it in a `D('id')` block in house.js (bad/good/therm,
focus point), add a `VIEWS` pose in engine.js, add entries in data.js (`DEFECTS`,
`STORY_TXT`, `LATER`, `STORY`), pick a supported `action.type`, add a fallback SVG in
illustrations.js `BA`, rebuild. Check framing in phone portrait first.

---

## 7. Decision history (why things are the way they are)

1. Original brief: interactive 3D home, 7 categories (tiles & flooring, dampness,
   electrical, plumbing, doors & windows, walls & ceilings, bathroom & kitchen),
   problem/benefit, before/after, Explore / Book / Free consultation.
2. "Make it realistic, defects obvious, visually consistent": procedural PBR, IBL, AO,
   detailed furniture; every image on the page comes from the same 3D engine.
3. "Reduce friction": one linear journey, personalised quote with defaults, sticky CTA.
4. Mobile: visual-first, full-screen, captions instead of panels, story before details.
5. Removed the magnifying "Looks finished" lens section.
6. An animated technician was added, then **removed entirely** at the owner's request.
   Don't reintroduce a character without a professional model and approval.
7. Scroll-scrubbing felt sticky → **snap paging + Exit**; added hold-to-fast-forward,
   tilt, bloom/vignette, dust motes, haptics, kinetic captions, dissolves.
8. Desktop: lowered brightness; left caption column with the home on the right.
9. Port to 4HomeInspections: first merged into its Next.js site, then **replaced the folder
   with HomeLens as-is** (owner preferred simple copy over integration). Brand kept as HomeLens.

---

## 8. Gotchas (don't rediscover these)

- `ShapeGeometry` is in XY: `rotateX(-Math.PI/2)` to face up (+PI/2 = invisible puddles).
- `MeshBasicMaterial.alphaMap` reads the **green** channel.
- Dissolves need `preserveDrawingBuffer: true` for `canvas.toDataURL()`.
- Generic class names collide in the big stylesheet (`.cost`, `.steps` broke layouts) —
  use specific names (`.cline`, `.xp-*`).
- Pins: use `E.project(E.focus(id))`, not `d.focus`.
- Some webviews/previews throttle IntersectionObserver and timers → app.js has a
  scroll-position fallback (`onView`/`checkView`). Preview screenshots run slowly; never
  judge animation from one frame.
- Debounced story steps: keep a "latest requested" key; don't let intervals clear it.
- Spreading objects: put defaults first (`{...T, label}`), or labels get overwritten.
- Three **r160 is pinned**: r163+ removed WebGL1 and changed some addon signatures
  (GTAOPass, OutputPass). Upgrade deliberately and retest the post chain.
- In this sandboxed agent environment: Google Fonts and most hosts are blocked; `/tmp`
  can reset (reinstall tools); avoid `git` commands that take locks on the mounted repo
  (a stale `.git/index.lock` happened) — use `GIT_OPTIONAL_LOCKS=0 git status`.

---

## 9. Verification recipes

- Build + parse: `npm run build`, then parse each `<script>` with `new Function()` in Node.
- Visual: wrap `site/index.html` in an iframe page at 1440×900 / 390×844 / 844×390 and
  screenshot; scroll `#story` by `clientHeight` to move between stops.
- Logic: jsdom with a stubbed canvas (no WebGL → fallback path) to walk
  intro → stop → Proof → hold → next → exit without errors.
- Real devices: run the server launcher; test iPhone Safari, Android Chrome, iPad.

---

## 10. Open items

- Replace placeholder prices (`planCalc`: 4,500 / 5,500 / 7,000 / 9,500 by BHK, resale ×1.1),
  savings, "500+ checks", FAQ, contact details.
- Connect forms to a backend; add analytics if wanted.
- Real-device QA (iOS 15+, Android Chrome, low-end phones).
- Optional: fullscreen button (exists only in the discarded Next.js port), GLB models
  for higher realism, real inspection photos.
- Customer-facing launch requires WBD Technology Intake review.
