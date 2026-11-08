/* ---------- Icons (24px stroke) ---------- */
const IC = {
  cube:'<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
  thermal:'<rect x="3" y="6" width="13" height="10" rx="2"/><path d="M16 9l5-2v8l-5-2"/><circle cx="9.5" cy="11" r="2.5"/><path d="M7 16v4h5"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  report:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h7M9 17h5"/>',
  repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
  scan:'<path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M3 12h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  rotate:'<path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  play:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  pause:'<path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor"/>',
  check:'<circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  tile:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M13 13l8 8M21 13l-3 3"/>',
  drop:'<path d="M12 2.5S5 10 5 15a7 7 0 0014 0c0-5-7-12.5-7-12.5z"/><path d="M9 15a3 3 0 003 3"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  pipe:'<path d="M3 7h8a3 3 0 013 3v11"/><path d="M3 11h6a1 1 0 011 1v9"/><path d="M17 6c0 1.5 1.5 2.5 1.5 4a1.5 1.5 0 01-3 0c0-1.5 1.5-2.5 1.5-4z"/>',
  door:'<path d="M5 21V3h11v18M3 21h18"/><path d="M16 5l3 1v15"/><circle cx="13" cy="12" r=".8" fill="currentColor"/>',
  wall:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 15h18M9 4v5M15 9v6M9 15v5"/><path d="M13 4l-2 6 3 3-2 7" stroke-width="2.2"/>',
  bath:'<path d="M3 12h18v3a5 5 0 01-5 5H8a5 5 0 01-5-5z"/><path d="M6 12V5a2 2 0 014 0M7 20l-1 2M17 20l1 2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 12l2 2 4-4M9 18h6"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  gauge:'<path d="M3 16a9 9 0 1118 0"/><path d="M12 16l4-5"/><circle cx="12" cy="16" r="1.5"/>',
  file:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 14l2 2 4-4"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'
};
const icon = (n, sw=2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${IC[n]||''}</svg>`;

const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const inrK = n => n >= 100000 ? '₹' + (n/100000).toFixed(n>=1000000?0:1).replace(/\.0$/,'') + 'L' : '₹' + Math.round(n/1000) + 'k';

/* ---------- Inspection categories ---------- */
const CATS = [
 { id:'tiles', name:'Hollow Tiles & Flooring', short:'Flooring', color:'#f5a65b', icon:'tile', checkpoints:70,
   intro:'Tiles laid without a full adhesive or mortar bed leave air pockets underneath. They look perfect on handover day — then crack, lift or pop months later.',
   wrong:['Hollow tiles with air gaps beneath — no full adhesive bed','Loose or "drummy" tiles that rock underfoot','Cracked, chipped or mismatched tiles','Uneven levels, lippage and trip edges','Inconsistent grout lines, missing grout, poor skirting finish','Wrong slope near balconies and wet areas'],
   signs:['A dull, hollow "tock" when you tap a tile','Hairline cracks running across a tile','Tile edges higher than neighbours','Grout crumbling or cracking along one line','Skirting separating from the wall'],
   undetected:[{t:'0–6 months',d:'Air pockets compress under daily foot traffic and furniture loads.'},{t:'6–18 months',d:'Tiles crack diagonally; some lift ("tenting") in heat.'},{t:'2+ years',d:'Whole patches need re-laying — matching discontinued tiles is often impossible.'}],
   detect:['Every floor tile is tapped with a tile-sounding rod — hollow tiles sound distinctly different','Laser level and straight-edge checks for flatness and lippage','Slope checked with a spirit level and water test in wet areas','Each hollow tile is marked and plotted on your floor plan'],
   tools:['Tile tapping rod','Laser level','Spirit level & straight-edge','Feeler gauge'],
   cost:{early:[0,8000], late:[60000,150000]}, earlyNote:'Builder re-fixes marked tiles before handover', lateNote:'Re-tile a living room, plus furniture moving & matching issues' },

 { id:'damp', name:'Dampness & Water Leakage', short:'Dampness', color:'#4fb3ff', icon:'drop', checkpoints:80,
   intro:'Water is the number one destroyer of homes. Fresh putty and paint hide seepage for weeks — until the first monsoon brings it all back.',
   wrong:['Seepage through external walls and around window frames','Ceiling leakage from the bathroom or terrace above','Failed waterproofing in balconies, sunken slabs and terraces','Rising damp near the floor and skirting','Condensation and trapped moisture behind wardrobes'],
   signs:['Paint bubbling, peeling or turning chalky','Brown or yellow tide-marks on walls and ceilings','White salt deposits (efflorescence)','Musty smell, black mould spots','Wall feels cold or damp to the touch'],
   undetected:[{t:'First monsoon',d:'Patches appear on freshly painted walls; mould begins.'},{t:'Year 1–2',d:'Plaster softens and falls; wardrobes and woodwork swell and rot.'},{t:'Year 3+',d:'Steel reinforcement corrodes (spalling) — a structural repair, not a paint job.'}],
   detect:['Thermal camera scans every wall and ceiling — moisture shows as cold zones','Pin & pinless moisture meters confirm and quantify the reading','Balcony & bathroom flood tests check waterproofing','External façade and window joints inspected for entry points'],
   tools:['Thermal imaging camera','Moisture meter','Flood test','Borescope'],
   cost:{early:[5000,20000], late:[100000,300000]}, earlyNote:'Seal joints / redo waterproofing — builder\'s liability pre-possession', lateNote:'Re-plaster, repaint, replace woodwork & treat mould' },

 { id:'electrical', name:'Electrical Safety', short:'Electrical', color:'#ffd84f', icon:'bolt', checkpoints:95,
   intro:'Electrical faults are invisible until they are dangerous. Missing earthing or a loose terminal can damage appliances — or cause shocks and fires.',
   wrong:['Missing or poor earthing at sockets and the DB','RCCB/ELCB missing, faulty or not tripping','Wrong MCB ratings for AC, geyser and kitchen circuits','Phase–neutral reversal at sockets','Loose terminals, undersized wires and overheating joints','Sockets too close to water sources'],
   signs:['Mild shock from appliances or taps','Switch plates or sockets warm to touch','Flickering lights, frequent MCB trips','Burn marks or a burning smell near sockets','Appliances failing unexpectedly'],
   undetected:[{t:'Weeks',d:'Appliances run without protective earth; surges damage electronics.'},{t:'Months',d:'Loose joints heat up, insulation degrades and sockets scorch.'},{t:'Any time',d:'Shock or fire risk — the cost here is not just financial.'}],
   detect:['Every socket tested for polarity and earth continuity','RCCB trip test and MCB rating verification at the DB','Thermal scan of the DB and loaded sockets for hot spots','Insulation and voltage checks with a multimeter / clamp meter'],
   tools:['Socket & earth tester','Clamp meter / multimeter','Thermal imaging camera','RCD tester'],
   cost:{early:[2000,10000], late:[50000,500000]}, earlyNote:'Fix earthing, terminals, ratings before you move in', lateNote:'Damaged appliances, rewiring, fire damage — plus safety risk' },

 { id:'plumbing', name:'Plumbing & Water Supply', short:'Plumbing', color:'#2ee6d6', icon:'pipe', checkpoints:75,
   intro:'Most pipes in Indian homes are concealed in walls and floors. A slow leak at one joint can soak a wall for months before anyone sees it.',
   wrong:['Leaking joints in concealed pipelines','Low or uneven water pressure at outlets','Hot/cold lines swapped or cross-connected','Slow or blocked drainage, missing traps','Loose taps, fixtures and angle valves','Backflow and bad smell from drains'],
   signs:['Water meter moving with all taps closed','Damp patches below or beside bathrooms','Weak flow from one tap only','Gurgling drains or sewer smell','Rust or stains near fixtures'],
   undetected:[{t:'0–6 months',d:'Hidden leak soaks the wall core and flooring bed.'},{t:'6–24 months',d:'Tiles debond, plaster rots, neighbour\'s ceiling starts leaking.'},{t:'Repair',d:'Walls and tiles must be broken open to locate and fix the joint.'}],
   detect:['Pressure test on supply lines with a gauge to detect drops','Thermal camera traces hot and cold concealed lines','Flow and pressure checked at every outlet','Drain flow test; borescope for hidden lines and traps'],
   tools:['Pressure gauge','Thermal imaging camera','Borescope camera','Moisture meter'],
   cost:{early:[3000,15000], late:[40000,200000]}, earlyNote:'Fix the joint before tiles and fittings are disturbed', lateNote:'Break walls & tiles, re-pipe, re-tile, repair neighbour\'s ceiling' },

 { id:'doors', name:'Doors & Windows', short:'Doors & Windows', color:'#b48cff', icon:'door', checkpoints:60,
   intro:'Doors and windows are installed late in construction and often rushed. Poor alignment and sealing leads to drafts, rain ingress and security issues.',
   wrong:['Frames out of plumb or square; doors that rub or swing open','Gaps around frames; missing or poor sealant','Faulty locks, latches, tower bolts and hinges','Sliding windows that jam or don\'t lock','Damaged glass, hardware or finishing','Missing weep holes in window tracks'],
   signs:['Door scrapes the floor or frame','Light visible around a closed window','Water streaks below a window after rain','Locks needing force to engage','Rattling glass or sashes'],
   undetected:[{t:'First monsoon',d:'Rain enters through gaps and seeps into walls below windows.'},{t:'Year 1',d:'Wooden frames swell, hinges sag, locks fail.'},{t:'Year 2+',d:'Frames need replacing; security is compromised.'}],
   detect:['Plumb and square check of every frame with level and laser','Operation test of every door, window, lock and hinge','Sealant and gap inspection, water spray test on windows','Hardware and glass condition review'],
   tools:['Laser level','Spirit level','Feeler gauge','Water spray test'],
   cost:{early:[1000,5000], late:[25000,80000]}, earlyNote:'Re-align, re-seal, replace hardware at builder\'s cost', lateNote:'Replace swollen frames, repair water damage below windows' },

 { id:'walls', name:'Walls & Ceilings', short:'Walls & Ceilings', color:'#ff7a90', icon:'wall', checkpoints:65,
   intro:'Not every crack is cosmetic. Inspectors distinguish harmless shrinkage cracks from warning signs that need an engineer.',
   wrong:['Structural cracks at beams, columns, and around openings','Plaster hollowness and delamination','Uneven walls, poor corners and finishing','Paint defects: patchiness, bubbling, flaking','Ceiling cracks, sagging false ceilings, water stains'],
   signs:['Diagonal cracks from door and window corners','Cracks wider than ~3 mm or ones that grow','Hollow sound when tapping plaster','Bulging or uneven wall surfaces','Stains on ceilings below wet areas'],
   undetected:[{t:'Months',d:'Shrinkage and hollow plaster crack through new paint.'},{t:'Year 1–2',d:'Plaster falls off; moisture enters through cracks.'},{t:'Long term',d:'Untreated structural cracks need engineering assessment and repair.'}],
   detect:['Crack width gauge to measure and classify every crack','Plaster tap test to find hollowness','Laser level for wall and ceiling flatness','Thermal scan to check for moisture behind stains'],
   tools:['Crack width gauge','Laser level','Thermal imaging camera','Tapping hammer'],
   cost:{early:[5000,15000], late:[100000,250000]}, earlyNote:'Fill, re-plaster and repaint before you move furniture in', lateNote:'Structural repair, re-plastering and repainting occupied rooms' },

 { id:'wet', name:'Bathroom & Kitchen', short:'Bath & Kitchen', color:'#3ddc97', icon:'bath', checkpoints:80,
   intro:'Wet areas concentrate every risk — water, electrical, tiling and plumbing — into a few square metres. They are where the most expensive defects hide.',
   wrong:['Failed waterproofing under bathroom floors','Floor slope away from the drain; water pooling','Gaps around WC, basin, sink and tap joints','Leaking sink and dishwasher connections','Poor grouting and sealant at wall–floor joints','Exhaust and ventilation not working'],
   signs:['Water standing on the floor after a shower','Dark, mouldy grout lines','Damp skirting in the adjacent room','Bad smell from floor traps','Loose or rocking WC or basin'],
   undetected:[{t:'0–6 months',d:'Water seeps through grout into the sunken slab.'},{t:'Year 1',d:'Adjoining walls and the flat below show seepage.'},{t:'Year 2+',d:'Full bathroom strip-out: tiles, waterproofing, fittings.'}],
   detect:['Flood test of bathroom floor to verify waterproofing','Slope check — water must flow to the drain','Fixture, sealant and joint inspection; leak check under sinks','Thermal and moisture scan of adjoining walls and ceilings'],
   tools:['Flood test','Moisture meter','Thermal imaging camera','Spirit level'],
   cost:{early:[5000,20000], late:[150000,350000]}, earlyNote:'Re-grout, correct slope, seal joints before first use', lateNote:'Strip & rebuild bathroom, repair neighbour\'s ceiling' }
];
const CAT = Object.fromEntries(CATS.map(c=>[c.id,c]));

/* ---------- Walkthrough defects (the 10 stops of the virtual inspection) ---------- */
const DEFECTS = [
 {id:'tiles', room:'living', cat:'tiles', sev:3, short:'Hollow tiles', title:'Hollow & cracked floor tiles',
  see:'One tile has cracked and the one beside it has lifted at the edge. The rest look perfect — but several sound hollow when tapped.',
  why:'Tiles laid on a patchy adhesive bed crack under furniture and foot traffic. Replacements rarely match, so whole areas get re-laid.',
  cost:[60000,150000], fixText:'The builder lifted and re-bedded the hollow tiles on a full adhesive bed before handover.',
  action:{type:'tap', icon:'tile', label:'Tap-test the tiles', bad:'', good:''}},
 {id:'crack', room:'living', cat:'walls', sev:3, short:'Wall crack', title:'Crack running from the door corner',
  see:'A diagonal crack starting at the top corner of the bedroom door and running towards the ceiling.',
  why:'Diagonal cracks at openings can mean a missing lintel band or movement. They widen with the seasons and let moisture into the wall.',
  cost:[30000,250000], fixText:'Crack investigated, reinforced with fibre mesh, re-plastered and repainted.',
  action:{type:'gauge', icon:'gauge', label:'Measure the crack', bad:'<b>Crack width 2.6 mm</b> — well beyond a hairline (&lt; 1 mm). Needs an engineer’s assessment, not just putty.', good:'No crack. Plaster is sound and flat.'}},
 {id:'socket', room:'living', cat:'electrical', sev:5, short:'Scorched socket', title:'Scorched socket with no earthing',
  see:'Black scorch marks around a socket overloaded with a multi-plug adapter behind the TV unit.',
  why:'This socket has no earth connection. A fault in a metal-bodied appliance could make it live — a real shock and fire risk.',
  cost:[50000,500000], fixText:'Socket replaced, earth wire connected, circuit tested. One appliance per socket.',
  action:{type:'tester', icon:'bolt', label:'Plug in the socket tester', bad:'<b>Earth: MISSING</b> · Polarity OK. The red light means appliances on this socket have no protective earth.', good:'<b>Earth ✓ · Polarity ✓</b> — wiring correct.'}},
 {id:'damp', room:'bedroom', cat:'damp', sev:4, short:'Damp wall', title:'Damp patch & mould on the outer wall',
  see:'Brown tide-marks, bubbling and peeling paint, white salt deposits and black mould spots near the floor.',
  why:'Rainwater is entering through the external wall. It returns every monsoon, ruins wardrobes and can corrode the steel inside the wall.',
  cost:[100000,300000], fixText:'External cracks sealed, wall waterproofed, re-plastered and painted.',
  action:{type:'moisture', icon:'drop', label:'Scan with the moisture meter', bad:'The damp spreads well beyond the visible patch.', good:'Readings are 8–10% everywhere — a dry wall.'}},
 {id:'window', room:'bedroom', cat:'doors', sev:3, short:'Leaking window', title:'Leaking window frame',
  see:'Water streaks and peeling paint below the window, and a visible gap of daylight between the frame and the wall.',
  why:'Without sealant, rain is driven through the gap into the wall below. Frames swell, sills rot and the paint keeps peeling.',
  cost:[25000,80000], fixText:'Frame re-aligned and sealed with weatherproof silicone; weep holes cleared.',
  action:{type:'spray', icon:'drop', label:'Run a water spray test', bad:'<b>Water sprayed outside appears inside within seconds</b> — the frame joint is open.', good:'Water stays outside. The frame is sealed.'}},
 {id:'pipe', room:'bathroom', cat:'plumbing', sev:5, short:'Hidden leak', title:'Hidden pipe leak behind the toilet',
  see:'Dark, damp grout lines and a stain spreading across the wall tiles behind the WC, with water at its base.',
  why:'A joint in the concealed pipe is leaking inside the wall. Fixing it later means breaking tiles — and the neighbour’s wall gets wet too.',
  cost:[40000,200000], fixText:'Joint repaired before possession, pressure-tested and re-grouted. No tiles broken later.',
  action:{type:'thermal', icon:'thermal', label:'View with the thermal camera', bad:'<b>A cold trail follows the pipe line</b> — water is escaping at a joint about 60 cm above the floor.', good:'Even temperature across the wall. No leak.'}},
 {id:'slope', room:'bathroom', cat:'wet', sev:4, short:'Water pooling', title:'Water pools away from the drain',
  see:'Standing water beside the toilet, while the floor drain in the shower stays dry.',
  why:'The floor slopes the wrong way. Water sits on the grout, soaks into the sunken slab and leaks into the flat below.',
  cost:[150000,350000], fixText:'Floor re-laid with the correct 1:100 slope to the drain; waterproofing flood-tested.',
  action:{type:'flood', icon:'drop', label:'Run a flood test', bad:'<b>Water runs away from the drain</b> — the slope is reversed.', good:'Water runs straight to the drain.'}},
 {id:'sink', room:'kitchen', cat:'wet', sev:2, short:'Sink leak', title:'Leak under the kitchen sink',
  see:'The sink cabinet door has swollen along the bottom edge, and there is water on the floor in front of it.',
  why:'A loose waste connection drips inside the cabinet. The board swells and rots, and mould grows where nobody looks.',
  cost:[20000,80000], fixText:'Waste coupling replaced, sink edge sealed, cabinet base replaced.',
  action:{type:'open', icon:'eye', label:'Open the cabinet', bad:'<b>Water pooled on the cabinet base</b>, a swollen board and a dripping trap joint.', good:'Dry cabinet, sealed joints.'}},
 {id:'db', room:'utility', cat:'electrical', sev:5, short:'Overheating DB', title:'Overheating distribution board',
  see:'Scorch marks above the distribution board, a blackened breaker and loose wires hanging below it.',
  why:'One breaker is undersized and its terminal is loose, so it overheats. The RCCB also fails its test — no protection against electric shock.',
  cost:[30000,300000], fixText:'Correct MCB fitted, terminals tightened, RCCB replaced and tested.',
  action:{type:'thermal', icon:'thermal', label:'View with the thermal camera', bad:'<b>Breaker terminal at 74 °C</b> — a loose connection. RCCB failed the 30 mA trip test.', good:'All breakers at room temperature. RCCB trips in 22 ms.'}},
 {id:'balcony', room:'balcony', cat:'damp', sev:3, short:'Balcony flooding', title:'Balcony water flowing indoors',
  see:'Water standing against the sliding door, and a wet line on the living-room floor just inside.',
  why:'The balcony slopes towards the house. Every downpour pushes water under the door into the flooring.',
  cost:[40000,150000], fixText:'Balcony re-sloped to the outlet; threshold raised and sealed.',
  action:{type:'flood', icon:'drop', label:'Run a flood test', bad:'<b>Water runs towards the door</b> instead of the outlet.', good:'Water drains to the outlet in the corner.'}}
];
const CAT_DEFECT = {tiles:'tiles', damp:'damp', electrical:'socket', plumbing:'pipe', doors:'window', walls:'crack', wet:'slope'};

/* ---------- Equipment ---------- */
const TOOLS = [
 {k:'thermalCamera', n:'Thermal imaging camera', d:'Sees temperature differences through surfaces — moisture, hidden pipes and hot wiring light up.', f:['Seepage','Concealed leaks','Hot joints'], art:`<svg viewBox="0 0 140 110"><defs><linearGradient id="tg1" x1="0" x2="1"><stop offset="0" stop-color="#2b1a6b"/><stop offset=".45" stop-color="#d43f8d"/><stop offset=".8" stop-color="#ffb547"/><stop offset="1" stop-color="#fff2a8"/></linearGradient></defs><rect x="20" y="10" width="92" height="58" rx="10" fill="#2a3245"/><rect x="28" y="17" width="76" height="44" rx="5" fill="url(#tg1)"/><circle cx="56" cy="40" r="12" fill="#3a1f8f" opacity=".85"/><path d="M60 68h22l-6 36H64z" fill="#1d2433"/><rect x="112" y="26" width="16" height="26" rx="4" fill="#3b455c"/><circle cx="120" cy="39" r="5" fill="#4fb3ff"/></svg>`},
 {k:'moistureMeter', n:'Moisture meter', d:'Pin and pinless readings quantify moisture inside plaster, wood and screed.', f:['Damp walls','Wet screed','Wood rot'], art:`<svg viewBox="0 0 140 110"><rect x="44" y="6" width="52" height="84" rx="12" fill="#ffb547"/><rect x="51" y="14" width="38" height="26" rx="4" fill="#0a1220"/><text x="70" y="33" text-anchor="middle" font-size="13" font-weight="700" fill="#2ee6d6" font-family="monospace">27%</text><circle cx="60" cy="56" r="5" fill="#1d2433"/><circle cx="80" cy="56" r="5" fill="#1d2433"/><rect x="58" y="90" width="4" height="16" fill="#c9d2e3"/><rect x="78" y="90" width="4" height="16" fill="#c9d2e3"/></svg>`},
 {k:'tapRod', n:'Tile tapping rod', d:'A telescopic rod with a steel ball tip. Rolled and tapped over every tile to hear voids beneath.', f:['Hollow tiles','Loose plaster','Debonding'], art:`<svg viewBox="0 0 140 110"><rect x="18" y="74" width="104" height="24" rx="2" fill="#e8e2d6"/><path d="M44 74v24M70 74v24M96 74v24" stroke="#bdb39f" stroke-width="2"/><rect x="66" y="10" width="7" height="58" rx="3" transform="rotate(18 70 40)" fill="#c9d2e3"/><rect x="56" y="4" width="10" height="26" rx="4" transform="rotate(18 60 17)" fill="#1d2433"/><circle cx="83" cy="68" r="7" fill="#9aa6bf"/><path d="M96 60c6 2 10 6 12 12M100 52c10 3 16 10 18 20" stroke="#ff5d6c" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`},
 {k:'socketTester', n:'Socket & earth tester', d:'Plug-in tester verifies earth, polarity and wiring faults at every socket in seconds.', f:['No earth','Reversed polarity','Open neutral'], art:`<svg viewBox="0 0 140 110"><rect x="34" y="14" width="72" height="62" rx="14" fill="#f2f2ef"/><circle cx="54" cy="36" r="6" fill="#3ddc97"/><circle cx="70" cy="36" r="6" fill="#3ddc97"/><circle cx="86" cy="36" r="6" fill="#ff5d6c"/><rect x="46" y="52" width="48" height="10" rx="3" fill="#d6d6d2"/><path d="M56 76v24M84 76v24M70 76v18" stroke="#c9b37a" stroke-width="6" stroke-linecap="round"/></svg>`},
 {k:'clampMeter', n:'Clamp meter & multimeter', d:'Measures voltage, current and continuity to check circuits, loads and MCB ratings.', f:['Overloads','Voltage drop','Bad joints'], art:`<svg viewBox="0 0 140 110"><path d="M48 40a22 22 0 1144 0" fill="none" stroke="#ffd84f" stroke-width="12"/><rect x="44" y="40" width="52" height="64" rx="10" fill="#ffd84f"/><rect x="51" y="48" width="38" height="20" rx="3" fill="#0a1220"/><text x="70" y="63" text-anchor="middle" font-size="11" font-weight="700" fill="#ffd84f" font-family="monospace">230V</text><circle cx="70" cy="86" r="9" fill="#1d2433"/><path d="M70 80v6" stroke="#ffd84f" stroke-width="2"/></svg>`},
 {k:'laserLevel', n:'Laser level', d:'Projects true horizontal and vertical lines to check floors, walls, frames and ceilings.', f:['Uneven floors','Out-of-plumb frames','Wall bulges'], art:`<svg viewBox="0 0 140 110"><path d="M70 50L4 22M70 50L136 22M70 50L4 78M70 50l66 28" stroke="#ff5d6c" stroke-width="1.5" opacity=".7"/><path d="M0 50h140M70 0v110" stroke="#3ddc97" stroke-width="2" opacity=".9"/><rect x="50" y="34" width="40" height="34" rx="6" fill="#2a3245"/><rect x="58" y="42" width="24" height="14" rx="3" fill="#0a1220"/><circle cx="70" cy="49" r="4" fill="#3ddc97"/><rect x="56" y="68" width="28" height="10" rx="2" fill="#1d2433"/></svg>`},
 {k:'pressureGauge', n:'Pressure gauge', d:'Fitted to supply lines to detect pressure drops that reveal hidden leaks.', f:['Concealed leaks','Low pressure','Weak joints'], art:`<svg viewBox="0 0 140 110"><rect x="10" y="78" width="120" height="14" rx="7" fill="#2ee6d6" opacity=".55"/><rect x="62" y="62" width="16" height="20" fill="#9aa6bf"/><circle cx="70" cy="38" r="30" fill="#f2f2ef" stroke="#2a3245" stroke-width="5"/><path d="M50 50a22 22 0 0140 0" fill="none" stroke="#3ddc97" stroke-width="4"/><path d="M84 48a22 22 0 006 2" stroke="#ff5d6c" stroke-width="4"/><path d="M70 40l-12-12" stroke="#1d2433" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="40" r="4" fill="#1d2433"/></svg>`},
 {k:'borescope', n:'Borescope camera', d:'A flexible camera on a probe that sees inside shafts, drains, ducts and false ceilings.', f:['Blocked drains','Hidden damage','Duct issues'], art:`<svg viewBox="0 0 140 110"><rect x="12" y="20" width="54" height="70" rx="8" fill="#2a3245"/><rect x="18" y="26" width="42" height="40" rx="4" fill="#0e2a35"/><circle cx="39" cy="46" r="13" fill="none" stroke="#2ee6d6" stroke-width="2"/><circle cx="39" cy="46" r="5" fill="#2ee6d6" opacity=".5"/><path d="M66 70c30 0 20-40 50-40s10 50 14 60" fill="none" stroke="#9aa6bf" stroke-width="5" stroke-linecap="round"/><circle cx="130" cy="92" r="6" fill="#ffd84f"/></svg>`}
];

/* ---------- Process ---------- */
const STEPS = [
 {i:'calendar', t:'Book or consult', d:'Pick a slot or talk to an inspector free.', s:'5 minutes'},
 {i:'clipboard', t:'Pre-visit prep', d:'We review your floor plan & builder specifications.', s:'Before visit'},
 {i:'eye', t:'Visual inspection', d:'Room-by-room walkthrough of 500+ checkpoints.', s:'2–3 hours'},
 {i:'gauge', t:'Instrument testing', d:'Thermal, moisture, tapping, electrical and pressure tests.', s:'1–2 hours'},
 {i:'file', t:'Digital report', d:'Photo-tagged defects, severity and fix advice.', s:'24–48 hours'},
 {i:'wrench', t:'Re-inspection', d:'We verify every fix the builder makes.', s:'After repairs'}
];

/* ---------- 5-year risk scenario ---------- */
const RISK_A = [
 {m:3, t:'Bathroom water pools; grout blackens', c:6000, k:'slope'},
 {m:7, t:'Monsoon: damp & mould in the bedroom', c:18000, k:'damp'},
 {m:11, t:'Hidden pipe leak — wall tiles broken open', c:42000, k:'pipe'},
 {m:16, t:'Living-room tiles crack over hollow patch', c:55000, k:'tiles'},
 {m:22, t:'Earth fault damages TV & fridge', c:38000, k:'socket'},
 {m:28, t:'Rain floods under the balcony door', c:30000, k:'balcony'},
 {m:35, t:'Window frame swells; wall below repaired', c:28000, k:'window'},
 {m:41, t:'Sink cabinet rots and is replaced', c:22000, k:'sink'},
 {m:44, t:'Neighbour below leaks — bathroom redone', c:140000, k:'slope'},
 {m:47, t:'Burnt breaker; DB rewired', c:26000, k:'db'},
 {m:53, t:'Door-corner crack widens — structural repair', c:45000, k:'crack'}
];
const RISK_B = [
 {m:0, t:'Pre-possession inspection · 46 defects logged', c:8500},
 {m:1, t:'Builder fixes all defects at no cost', c:0},
 {m:2, t:'Re-inspection confirms every fix', c:0},
 {m:36, t:'Routine upkeep — sealant refresh', c:4000}
];

/* ---------- FAQ ---------- */
const FAQ = [
 {q:'What exactly is included in a home inspection?', a:'A room-by-room check of 500+ points across seven systems: flooring and tiles, dampness and waterproofing, electrical safety, plumbing and drainage, doors and windows, walls and ceilings, and bathrooms and kitchens. We use instruments — thermal camera, moisture meter, tapping rod, socket and RCD testers, pressure gauge — and give you a photo-tagged report with severity ratings and recommended fixes.'},
 {q:'My flat is brand new. What could possibly be wrong?', a:'New homes are where hidden defects are most common, because finishing work is often rushed before handover. Hollow tiles, missing earthing, incomplete waterproofing, leaking concealed joints and unsealed window frames are all invisible under fresh paint and polish — and usually surface only after a few months or the first monsoon.'},
 {q:'Why inspect before taking possession?', a:'Before you accept handover, fixing defects is generally the builder\'s responsibility and they have workers on site. After possession, you may have to chase complaints, prove the defect existed earlier, or pay for repairs yourself. A dated, photo-documented report gives you clear evidence. (Check your sale agreement for the exact defect-liability terms.)'},
 {q:'How does an inspection save me money?', a:'Fixing a leaking joint before tiles are laid over it might cost a few thousand rupees. Finding it two years later means breaking tiles and walls, re-plumbing, re-tiling and repainting — often lakhs. Inspection moves the discovery to the cheapest possible moment, and before possession, usually onto the builder.'},
 {q:'Will you drill or damage anything?', a:'No. Our methods are non-destructive: tapping, thermal imaging, moisture meters, plug-in testers and visual checks. Nothing is broken open.'},
 {q:'How long does it take and do I need to be there?', a:'A typical 2–3 BHK takes 3–5 hours. You\'re welcome to join — many owners find it eye-opening — but it isn\'t required. Ensure electricity and water are connected so we can test everything.'}
];

/* ---------- Scroll story: 7 stops, one per inspection category ---------- */
const STORY = ['damp', 'window', 'pipe', 'slope', 'socket', 'tiles', 'crack'];
const STORY_TXT = {
  damp:   {line: 'Rainwater is getting in through the outer wall. Fresh paint hid it on handover day — it comes back every monsoon.', miss: 're-plastering, mould, a ruined wardrobe', tool: 'moistureMeter', toolName: 'Moisture meter', found: 'Meter reads up to <b>40%</b> — the wall is wet well beyond the visible patch.'},
  window: {line: 'The window frame was never sealed. Rain is driven through the gap and into the wall below.', miss: 'swollen frame, damp wall, repainting', tool: null, toolName: 'Water spray test', found: 'Water sprayed outside <b>appears inside within seconds</b>.'},
  pipe:   {line: 'A joint in the concealed water pipe is leaking inside the wall — invisible until tiles start falling off.', miss: 'broken tiles, a damp neighbour’s wall', tool: 'thermalCamera', toolName: 'Thermal camera', found: 'A <b>cold trail</b> shows water escaping from the pipe joint inside the wall.'},
  slope:  {line: 'The floor slopes the wrong way, so water sits by the toilet instead of draining — and seeps into the flat below.', miss: 'a full bathroom redo', tool: null, toolName: 'Flood test', found: 'Water poured on the floor <b>runs away from the drain</b>.'},
  socket: {line: 'An overloaded socket with no earth wire. Everything works — until a fault makes an appliance live.', miss: 'damaged appliances, shock and fire risk', tool: 'socketTester', toolName: 'Socket & earth tester', found: 'Tester shows <b>earth missing</b> — no protection from electric shock.'},
  tiles:  {line: 'Tiles laid on a patchy adhesive bed. Two have already failed; more sound hollow and will crack under load.', miss: 're-tiling the whole room', tool: 'tapRod', toolName: 'Tile tapping rod', found: '<b>4 hollow tiles</b> found by tapping — marked for the builder to re-lay.'},
  crack:  {line: 'A diagonal crack running from the door corner. Painted over once — it has already reopened.', miss: 'structural repair and repainting', tool: 'crackGauge', toolName: 'Crack width gauge', found: 'Crack measures <b>2.6 mm</b> — far beyond a hairline. Needs an engineer, not putty.'}
};

/* ---------- Personalised quote (placeholder pricing) ---------- */
const PLAN = {type: 'new', bhk: 2};
function planCalc(p){
  const area = {1: 650, 2: 1100, 3: 1600, 4: 2600}[p.bhk], age = p.type === 'new' ? 0 : p.type === 'resale' ? 8 : 3;
  const defects = Math.round(22 + area / 38 + age * 1.6);
  const lo = defects * 2600 * (1 + age * .03), hi = defects * 6200 * (1 + age * .04);
  const fee = Math.round({1: 4500, 2: 5500, 3: 7000, 4: 9500}[p.bhk] * (p.type === 'resale' ? 1.1 : 1) / 100) * 100;
  const T = {
    new:    {label: 'New flat', payer: 'Defects found before possession are fixed by your builder — at no cost to you.', caughtVal: '₹0', caughtNote: 'your builder fixes it before handover', payerLong: 'one visit — your builder fixes every defect before handover'},
    resale: {label: 'Resale home', payer: 'Know the true condition before you sign — and negotiate repairs off the price.', caughtVal: 'Negotiate', caughtNote: 'take repair costs off the price before you buy', payerLong: 'one visit — negotiate every defect off the price'},
    living: {label: 'Home I live in', payer: 'Catch problems while they’re small — fixing early costs a fraction.', caughtVal: 'Fix early', caughtNote: 'a small repair now instead of a big one later', payerLong: 'one visit — fix problems while they’re still small'}
  }[p.type];
  return {...T, fee, lo, hi, defects, hours: {1: '2–3', 2: '3–4', 3: '4–5', 4: '5–6'}[p.bhk], label: `${p.bhk === 4 ? '4+' : p.bhk} BHK · ${T.label}`};
}
