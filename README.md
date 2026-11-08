# HomeLens — immersive 3D home-inspection website

A single, self-contained web page: a swipeable 3D walkthrough of a flat that
shows seven hidden defects (Problem → Proof → Fixed), followed by a value
section, a personalised quote, booking form and FAQ. India market (₹, BHK).

> Created using Anthropic Claude. Internal draft — review and verify all
> content before use. Customer-facing release needs Technology Intake review.

## Open it

- **Quickest:** double-click `site/index.html` (works offline, no server needed).
- **On phones/tablets (same Wi-Fi):** double-click `Start HomeLens server.command`;
  it prints the phone URL, copies it, and opens a QR code. If the phone can't
  connect, run `Check phone connection.command`.
- Or: `npm run serve` → http://localhost:8000

## Edit and rebuild

```bash
npm install        # one time: three@0.160.0 + esbuild
npm run build      # src/ → site/index.html
```

| What | Where |
|---|---|
| Copy, defects, costs, pricing model | `src/data.js` |
| Page markup | `src/body.html` |
| Styles | `src/styles.css` |
| Page behaviour (tour UI, quote, forms) | `src/app.js` |
| 3D engine, flat, textures, tour driver | `src/3d/` |
| No-WebGL fallback illustrations | `src/illustrations.js` |

**Architecture, design decisions and learnings: [`agent skills.md`](./agent%20skills.md).**

The previous Next.js 4HomeInspections site is in git history (commit `2618951`).
