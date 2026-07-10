#!/bin/bash
# JARVIS Start — runs the bridge and opens Chrome
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🔥 Starting JARVIS Agent OS..."
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found."
  echo "   Install it: https://nodejs.org  (download the LTS version)"
  exit 1
fi

# Check Claude Code CLI
if ! command -v claude &>/dev/null; then
  echo "❌ Claude Code CLI not found."
  echo "   Install it:  curl -fsSL https://claude.ai/install.sh | sh"
  echo "   Then reopen this terminal and run:  ./start.sh"
  exit 1
fi

echo "✅ Node.js   $(node -v)"
echo "✅ Claude    $(claude --version 2>/dev/null | head -1)"
echo ""

# Start the bridge in background
echo "Starting bridge server on http://localhost:3000 ..."
node "$DIR/bridge.js" &
BRIDGE_PID=$!

# Give it a moment to start
sleep 1

# Open Chrome
echo "Opening dashboard in Chrome..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  open -a "Google Chrome" "http://localhost:3000" 2>/dev/null \
  || open "http://localhost:3000"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  google-chrome "http://localhost:3000" 2>/dev/null \
  || xdg-open "http://localhost:3000"
fi

echo ""
echo "JARVIS is running. Press Ctrl+C to stop."
echo ""

# Keep running until Ctrl+C
trap "kill $BRIDGE_PID 2>/dev/null; echo ''; echo 'JARVIS stopped.'; exit 0" INT TERM
wait $BRIDGE_PID
