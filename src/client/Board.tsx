import React, { Fragment } from 'react';
import { BoardProps } from 'boardgame.io/react';
import { SwatchState } from '../game/Game';
import { Ctx } from 'boardgame.io';
import {ColorChooser} from './controls/ColorChooser';
import { LastRound } from './views/LastRound';
import { nameForPlayerId, scoreForPlayer } from '../game/Player';
import { Scores } from './views/Scores';
import { GameOver } from './views/GameOver';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

export const Board = ({ G, ctx, moves, events, playerID, matchData }: BoardProps<SwatchState>) => {

  return (
    <main className="gameview">
      <h1>Swatch</h1>
      { playerID !== null && 
        matchData && 
        !ctx.gameover &&
        <Fragment>
        <Scores state={G} matchData={matchData} thisPlayerId={playerID} /> 
        <div className="gameview">
          <div className="direction">Guess the color for</div>
          <div className="colorname">{G.targetColorName}</div>
          {
            playerID && <ColorChooser state={G} context={ctx} moves={moves} playerId={playerID}/>
          }
        </div>
        </Fragment>
      } 
      {ctx.gameover && matchData && playerID !== null && <GameOver 
        matchData={matchData}
        gameOver={ctx.gameover} 
        state={G} 
        thisPlayerId={playerID} />}
        
      {matchData && <LastRound gameState={G} context={ctx} matchData={matchData} />}
    </main>
  );
};
