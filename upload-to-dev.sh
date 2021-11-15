#!/bin/bash
scp -r build/* fixermark.com:~/swatch-dev.fixermark.com
scp -r public/* fixermark.com:~/swatch-dev.fixermark.com/public
ssh fixermark.com "touch ~/swatch-dev.fixermark.com/tmp/restart.txt"