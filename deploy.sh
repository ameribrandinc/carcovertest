#!/bin/sh

forever stopall

cd ~/DIST

echo "Running npm prune"
npm prune --production

echo "Running npm cache clean"
npm cache clean -f

echo "Running npm install"
npm install

echo "Running bower prune"
bower prune --allow-root

echo "Running bower cache clean"
bower cache clean --allow-root

echo "Running bower install"
bower install --allow-root

echo "Running grunt build"
grunt build

echo "Updating databases..."
# bash update-databases.sh

echo "Restarting production server..."
bash startup.sh

echo "Deployment complete"