#!/bin/bash
#
# Copyright 2021 Mark T. Tomczak
# Licensed under the MIT License (https://opensource.org/licenses/MIT)
#
# Remember, this purposefully does not sync your node_modules because the cost is too high
# We should probably either webpack the server or copy package.json over and run npm i server-side
scp -r build/* fixermark.com:~/swatch-dev.fixermark.com
scp -r public/* fixermark.com:~/swatch-dev.fixermark.com/public
scp -r private/* fixermark.com:~/swatch-dev.fixermark.com/private
ssh fixermark.com "touch ~/swatch-dev.fixermark.com/tmp/restart.txt"