//import { Debug } from 'boardgame.io/debug';
import { Client, Lobby } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Swatch } from '../game/Game';
import { Board } from './Board';
import { useState } from 'react';
import 'react';

console.log(window.location.hostname);
const HOST = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.hostname;
const SERVER_URI = window.location.hostname === 'localhost' ? 'http://localhost:8000' : `http://${window.location.hostname}:${window.location.port}`;

export const App = () => {
    const [playerId, setPlayerId] = useState<string|null>(null);

    // NOTE: to re-enabled debugging, add `debug={{impl: Debug}}` property
    // TODO: we may want to check state here and if we already know our player ID etc. just hop in the game?
    return <Lobby
        gameServer={SERVER_URI}
        lobbyServer={SERVER_URI}
        gameComponents={[
            {game: Swatch, board: Board}
        ]} />
 }