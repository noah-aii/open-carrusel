#!/bin/zsh
# Rebuilds the app and restarts the always-on server (production mode, launchd).
# Run after any code change:  ~/Projects/pessoal/open-carrusel/scripts/redeploy.sh
set -e
cd "$(dirname "$0")/.."
LABEL=com.pedroactis.open-carrusel
PLIST=~/Library/LaunchAgents/$LABEL.plist
launchctl bootout gui/$(id -u)/$LABEL 2>/dev/null || true
npm run build
launchctl bootstrap gui/$(id -u) "$PLIST"
echo "Servidor no ar em http://localhost:3000"
