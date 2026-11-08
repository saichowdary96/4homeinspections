#!/bin/bash
# HomeLens — diagnose why a phone can't open the locally hosted site.
# Double-click (or right-click > Open). Read-only: it changes nothing on your Mac.
echo ""
echo "=== HomeLens connection check ==="
echo ""

WIFI_DEV=$(networksetup -listallhardwareports 2>/dev/null | awk '/Wi-Fi|AirPort/{getline; print $2; exit}')
WIFI_IP=$( [ -n "$WIFI_DEV" ] && ipconfig getifaddr "$WIFI_DEV" 2>/dev/null )
SSID=$( [ -n "$WIFI_DEV" ] && networksetup -getairportnetwork "$WIFI_DEV" 2>/dev/null | sed 's/^Current Wi-Fi Network: //' )
echo "1. Wi-Fi adapter     : ${WIFI_DEV:-not found}"
echo "   Wi-Fi network     : ${SSID:-unknown (may be hidden by macOS privacy settings)}"
echo "   Mac's Wi-Fi IP    : ${WIFI_IP:-NONE — the Mac is not on Wi-Fi}"
echo "   All addresses     :"
ifconfig 2>/dev/null | awk '/^[a-z]/{i=$1} /inet /&&$2!="127.0.0.1"{print "     " i " " $2}'
echo ""

if ifconfig 2>/dev/null | grep -qE '^(utun|ppp|ipsec|gpd|tun)[0-9]*:.*UP' && ifconfig | awk '/^(utun|ppp|ipsec|gpd|tun)/{f=1} f&&/inet /&&$2!~/^fe80/{print; exit}' | grep -q inet; then
  echo "2. VPN               : ACTIVE — corporate VPNs often block or reroute local-network traffic."
else
  echo "2. VPN               : none detected"
fi

FW=/usr/libexec/ApplicationFirewall/socketfilterfw
echo "3. macOS firewall    : $($FW --getglobalstate 2>/dev/null | sed 's/.*is //')"
echo "   Block all incoming: $($FW --getblockall 2>/dev/null | sed 's/.*is //;s/Firewall //')"
echo "   Stealth mode      : $($FW --getstealthmode 2>/dev/null | sed 's/.*is //;s/Stealth mode //')"
if profiles status -type enrollment 2>/dev/null | grep -qi "MDM enrollment: Yes"; then
  echo "   Managed by company: YES — firewall/security settings may be enforced by IT."
fi
echo ""

if python3 -c "" >/dev/null 2>&1; then echo "4. Python (server)   : OK"; else echo "4. Python (server)   : MISSING — run:  xcode-select --install"; fi

LISTEN=$(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/Python|python|ruby|php|node/ && /:80[0-9][0-9]/{print $9}' | head -3)
if [ -n "$LISTEN" ]; then
  echo "5. HomeLens server   : RUNNING on $LISTEN"
  PORT=$(echo "$LISTEN" | head -1 | sed 's/.*://')
  case "$LISTEN" in *127.0.0.1*) echo "   WARNING: bound to localhost only — phones can't reach it.";; esac
  if [ -n "$WIFI_IP" ]; then
    CODE=$(curl -s -o /dev/null -m 4 -w "%{http_code}" "http://$WIFI_IP:$PORT/")
    echo "   Self-test via $WIFI_IP : HTTP $CODE  (200 = server OK on the network address)"
    echo ""
    echo "   >>> Type this EXACTLY on your phone (http, not https):  http://$WIFI_IP:$PORT/"
  fi
else
  echo "5. HomeLens server   : NOT RUNNING — double-click 'Start HomeLens server.command' first."
fi
echo ""
echo "=== Copy everything above and paste it back to Claude if the phone still can't connect ==="
echo ""
read -r -p "Press Enter to close…"
