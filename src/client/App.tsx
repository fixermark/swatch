import { Client } from 'boardgame.io/react';
import {SocketIO} from 'boardgame.io/multiplayer';
import { TicTacToe } from '../game/Game';
import { Board } from './Board';
import { useState } from 'react';
import 'react';


const GameClient = Client({ 
    game: TicTacToe, 
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
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