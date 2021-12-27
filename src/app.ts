/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { FlatFile, Server, Origins } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { Swatch } from './game/Game';

const server = Server({
    db: new FlatFile({
        dir: 'storage',
        logging: true,
    }),
     games: [Swatch],
     origins: [
         'http://swatch-dev.fixermark.com',
         'http://swatch.fixermark.com',
         Origins.LOCALHOST_IN_DEVELOPMENT,
         Origins.LOCALHOST,
     ],
});
// Build path relative to the server.js file
const frontendJsPath = path.resolve(__dirname, '.');
const frontendPublicPath = path.resolve(__dirname, '../public');
// Debug handler to report on requests
// server.app.use(async (ctx, next) => {
//     console.log(`requesting ${ctx.request.path}`);
//     await next();
// });
server.app.use(serve((frontendJsPath)));
server.app.use(serve((frontendPublicPath)));

server.run(8000, () => {
    console.log('server on');
});