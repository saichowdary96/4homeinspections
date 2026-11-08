#!/bin/bash
# HomeLens — serve the site to phones & tablets on the same Wi-Fi network.
# Double-click this file (macOS). Keep the window open while testing. Ctrl+C to stop.
cd "$(dirname "$0")/site" || { echo "site folder not found"; read -r; exit 1; }

PORT=8080
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done

# prefer the Wi-Fi adapter's address (docks/Ethernet/VPN adapters can't be reached from a phone)
WIFI_DEV=$(networksetup -listallhardwareports 2>/dev/null | awk '/Wi-Fi|AirPort/{getline; print $2; exit}')
IP=$( [ -n "$WIFI_DEV" ] && ipconfig getifaddr "$WIFI_DEV" 2>/dev/null )
[ -z "$IP" ] && for IF in en0 en1 en2 en3 en4 en5; do IP=$(ipconfig getifaddr $IF 2>/dev/null); [ -n "$IP" ] && break; done
[ -z "$IP" ] && IP=$(ifconfig 2>/dev/null | awk '/inet /&&$2!="127.0.0.1"{print $2; exit}')

URL="http://$IP:$PORT/"
echo ""
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "    HomeLens is running"
echo "    On this computer : http://localhost:$PORT/"
if [ -n "$IP" ]; then
echo "    On your phone    : $URL"
else
echo "    (Could not detect a network address — are you on Wi-Fi?)"
fi
echo "    Phone and computer must be on the same Wi-Fi network."
echo "    If macOS asks to allow incoming connections, click Allow."
echo "    Keep this window open. Press Ctrl+C to stop."
echo "  └──────────────────────────────────────────────────────────┘"
echo ""
[ -n "$IP" ] && printf "%s" "$URL" | pbcopy 2>/dev/null && echo "  (The phone URL has been copied to your clipboard.)" && echo ""

# open a page with a QR code you can scan with your phone
( sleep 1.2; open "http://localhost:$PORT/qr.html?u=$URL" >/dev/null 2>&1 ) &

if command -v python3 >/dev/null 2>&1 && python3 -c "" >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT" --bind 0.0.0.0
elif command -v ruby >/dev/null 2>&1; then
  exec ruby -run -e httpd . -p "$PORT" -b 0.0.0.0
elif command -v php >/dev/null 2>&1; then
  exec php -S "0.0.0.0:$PORT"
elif command -v npx >/dev/null 2>&1; then
  exec npx --yes http-server -p "$PORT" -a 0.0.0.0 -c-1
else
  echo "  No built-in web server was found on this Mac."
  echo "  Install Apple's command line tools (includes Python):  xcode-select --install"
  echo "  then double-click this file again."
  read -r
fi
