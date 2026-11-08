#!/bin/bash
# Builds site/index.html (single self-contained file) from src/.
# One-time setup in the repo root:  npm install
set -e
cd "$(dirname "$0")"
ROOT=..
[ -d "$ROOT/node_modules/three" ] || { echo "Run 'npm install' in the repo root first."; exit 1; }
mkdir -p "$ROOT/.build"
( cd "$ROOT" && npx esbuild src/3d/main.js --bundle --format=iife --minify --target=es2020 --log-level=warning --outfile=.build/bundle.js )
OUT=$ROOT/site/index.html
mkdir -p "$ROOT/site"
{
echo '<!DOCTYPE html>'
echo '<!-- HomeLens interactive home-inspection site. Created using Anthropic Claude. Internal draft: review and verify all content before publishing. -->'
echo '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
echo '<title>HomeLens — See what your new home is hiding | Home Inspection</title>'
echo '<meta name="description" content="Walk through a realistic 3D flat: hollow tiles, damp walls, unsafe wiring, hidden leaks and more — and see what each would cost if missed.">'
echo '<meta name="theme-color" content="#070b14">'
echo '<style>'; cat styles.css; echo '</style></head><body>'
cat body.html
echo '<script>'; cat data.js; echo; cat illustrations.js; echo '</script>'
echo '<script>'; cat "$ROOT/.build/bundle.js"; echo '</script>'
echo '<script>'; cat app.js; echo '</script>'
echo '</body></html>'
} > "$OUT"
echo "built $(wc -c < "$OUT") bytes → site/index.html"
