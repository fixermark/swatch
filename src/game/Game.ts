import { Game, PlayerID } from 'boardgame.io';
import { INVALID_MOVE, PlayerView } from 'boardgame.io/core';
import { Color } from './Color';
import { selectColor } from './ColorSelector';

/**
 * Private state associated with each player
 */
export interface PrivatePlayerState {
  selectedColor: Color | undefined,
};

export interface SwatchState {
  // Everything in this field is hidden by PlayerView.STRIP_SECRETS
  secret?: {
    targetColor: Color,
  },
  targetColorName: string,
  // All keys except current player are hidden by PlayerView.STRIP_SECRETS
  players: {[key: string]: PrivatePlayerState},
  scores: {[key: PlayerID]: number},
}

function wipePlayerGuesses(state: SwatchState) {
  for (const playerId of Object.keys(state.players)) {
    state.players[playerId].selectedColor = undefined;
  }
}

export const Swatch: Game<SwatchState> = {
  name: 'swatch',
  // automatically limit player state by stripping 'secret' and all 'player.id' but the current player
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => {
    const result: SwatchState = {
      players: {},
      scores: {},
      targetColorName: 'Selecting color...',
    };

    for (const playerId of ctx.playOrder) {
      result.players[playerId] = {
        selectedColor: undefined,
      };
      result.scores[playerId] = 0;
    }

    if (!ctx.random) {
      throw new Error('Context did not have a random number generator!');
    }

    const selectedColor = selectColor(ctx.random);

    if (selectedColor) {
      result.secret = {
        targetColor: selectedColor.color,
      };
      result.targetColorName = selectedColor.name;
    }


    return result;
  },

  turn: {
    activePlayers: {all: 'chooseColor', minMoves: 1, maxMoves: 1},
    onBegin: (G, ctx) => {
      if (!ctx.events) {
        throw new Error('events API missing');
      }
    },

    onEnd: (G, ctx) => {
      // TODO: here, we will check proximity of colors and adjust scores
      console.log('turn end!');
      // TODO: We should also pick the next color and move previous color, color name, and guesses to a prevRound data structure
    },

    stages: {
      chooseColor: {
        moves: { 
          chooseColor: (G, ctx, color: Color) => {
            if (!ctx.playerID) {
              return;
            }

            G.players[ctx.playerID].selectedColor = color;
            if (!ctx.events) {
              throw new Error('no events API available');
            }
            console.log(`activePlayers: ${JSON.stringify(ctx.activePlayers)}`);
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
              ctx.events.endTurn();
            } else {
              ctx.events.endStage();
            }
          },
        }
      }
    }
  },

  // you will need this to end the game when someone gets to ten points
  // endIf: (G, ctx) => {
  // },
};
