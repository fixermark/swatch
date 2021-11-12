#!/bin/bash
scp build/app.js fixermark.com:~/swatch-dev.fixermark.com/app.js
ssh fixermark.com "touch ~/swatch-dev.fixermark.com/tmp/restart.txt"