import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { SwatchState } from '../game/Game';
import { Ctx } from 'boardgame.io';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

export const Board = ({ G, ctx, moves, playerID, matchData }: BoardProps<SwatchState>) => {
  console.log(`playerID: ${playerID}, matchData: ${JSON.stringify(matchData)}`);

  return (
    <main>
      <h1>Swatch</h1>

      <div>
        Players:
        {
          matchData && matchData.map(({id, name}) => 
          <li key={id}>
            <span className={playerID && id === parseInt(playerID, 10) ? 'thisPlayer' : ''}>
              {name ? name : '<unknown player>'}
            </span>
          </li>
          )
        }
        
      </div>
    </main>
  );
};
