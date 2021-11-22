import React, { Fragment } from 'react';
import { BoardProps } from 'boardgame.io/react';
import { SwatchState } from '../game/Game';
import { Ctx } from 'boardgame.io';
import { Scores } from './views/Scores';
import { GameOver } from './views/GameOver';
import { GUESS_SHADE_ROUND_NAME } from '../game/rounds/GuessShadeRound';
import { GuessShade } from './views/rounds/GuessShade';
import { GUESS_NAME_ROUND_NAME } from '../game/rounds/GuessNameRound';
import { GuessName } from './views/rounds/GuessName';
import { LastRound } from './views/LastRound';

export const Board = ({ G, ctx, moves, events, playerID, matchData }: BoardProps<SwatchState>) => {

  return (
    <main className="gameview">
      <h1>Swatch</h1>
      { playerID !== null && 
        matchData && 
        !ctx.gameover &&
        <Fragment>
          <Scores state={G} matchData={matchData} thisPlayerId={playerID} /> 
          <div>
            {G.roundName === GUESS_SHADE_ROUND_NAME && 
              <GuessShade state={G} context={ctx} moves={moves} playerId={playerID} />}
            {G.roundName === GUESS_NAME_ROUND_NAME &&
              <GuessName state={G} moves={moves} playerId={playerID} />}
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
