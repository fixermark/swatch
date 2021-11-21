import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { SwatchState } from '../game/Game';
import { Ctx } from 'boardgame.io';
import { codeToColor } from '../game/Color';
import { LastRound } from './LastRound';
import { nameForPlayerId, scoreForPlayer } from '../game/Player';

const getWinner = (ctx: Ctx): string | null => {
  if (!ctx.gameover) return null;
  if (ctx.gameover.draw) return 'Draw';
  return `Player ${ctx.gameover.winner} wins!`;
};

export const Board = ({ G, ctx, moves, events, playerID, matchData }: BoardProps<SwatchState>) => {

  return (
    <main className="gameview">
      <h1>Swatch</h1>

      <div className="playerScoresSection">
        <div>Scores:</div>
        <div className="playerScores">
        {
          matchData && matchData.map(({id}) => 
          <div key={id}>
            <span className={playerID && id === parseInt(playerID, 10) ? 'thisPlayer' : ''}>
              {nameForPlayerId(id.toString(), matchData)}: {scoreForPlayer(id.toString(), G)}
            </span>
          </div>
          )
        }
        </div>
      </div>
      <div className="gameview">
        <div className="direction">Guess the color for</div>
        <div className="colorname">{G.targetColorName}</div>
      </div>
      {matchData && <LastRound gameState={G} context={ctx} matchData={matchData} />}
    </main>
  );
};
