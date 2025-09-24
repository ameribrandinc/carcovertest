# Run this to stop and restart the server to see changes.

#!/bin/bash
APP_DIR="${HOME}/DIST"
cd "$APP_DIR"

# Stop any previous forever instance by UID or script path
forever stop server.js > /dev/null 2>&1

# Start the app in the background and detach
NODE_ENV=production forever start -v \
  -l "$APP_DIR/logs/logfile.log" \
  -o "$APP_DIR/logs/outfile.log" \
  -e "$APP_DIR/logs/errfile.log" \
  --append \
  --killSignal=SIGTERM \
  --minUptime=1000 \
  --spinSleepTime=100 \
  ./server.js > /dev/null 2>&1 &

# Immediately return to terminal
echo "App restarted with forever. Use 'forever list' to check status."

