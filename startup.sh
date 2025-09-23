#!/bin/bash

cd ${HOME}/DIST
NODE_ENV=production forever start -v \
 -l ${HOME}/DIST/logs/logfile.log -o ${HOME}/DIST/logs/outfile.log -e ${HOME}/DIST/logs/errfile.log --append \
 --killSignal=SIGTERM --minUptime 1000 --spinSleepTime 100 ./server.js