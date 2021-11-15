import { Debug } from 'boardgame.io/debug';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { TicTacToe } from '../game/Game';
import { Board } from './Board';
import { useState } from 'react';
import 'react';

console.log(window.location.hostname);
const HOST = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.hostname;

const GameClient = Client({ 
    game: TicTacToe, 
    board: Board,
    multiplayer: SocketIO({ server: HOST }),
    debug: { impl: Debug },
 });

export const App = () => {
     const [playerId, setPlayerId] = useState<string|null>(null);

     if (playerId === null) {
         return <div>
             <p>Player ID:</p>
             <button onClick={() => setPlayerId('0')}>0</button>
             <button onClick={() => setPlayerId('1')}>1</button>
         </div>;
     }
     // player ID is set
     return <GameClient playerID={playerId} />;
 }