import { Game, PlayerID } from 'boardgame.io';
import { INVALID_MOVE, PlayerView } from 'boardgame.io/core';
import { Color, distance } from './Color';
import { selectColor } from './ColorSelector';

/**
 * Private state associated with each player
 */
export interface PrivatePlayerState {
  selectedColor: Color | undefined,
};

/**
 * Description of final game state
 */
export interface EndGameState {
  winners: PlayerID[];
  scores: {[key: PlayerID]: number};
}

interface PlayerGuesses {
  [key: PlayerID]: {
    guess: Color;
  };
}

/**
 * State encoding the previous round of play
 */
export interface PreviousRoundState {
  guessColorShade?: {
    colorName: string;
    colorValue: Color;
    players: PlayerGuesses;
  };
}

export interface SwatchState {
  // Everything in this field is hidden by PlayerView.STRIP_SECRETS
  secret?: {
    targetColor: Color,
  };
  targetColorName: string;
  // All keys except current player are hidden by PlayerView.STRIP_SECRETS
  players: {[key: PlayerID]: PrivatePlayerState};
  scores: {[key: PlayerID]: number};
  previousRound?: PreviousRoundState;
  previousFirsts: PlayerID[];
  previousSeconds: PlayerID[];
}

/** Score to meet or exceed to win the game */
const WINNING_SCORE = 10;

/**
 * Update the scores. INVARIANT: Assumes all players have a guess logged
 * @param state Game state
 */
function updateScores(state: SwatchState) {
  if (state.secret === undefined) {
    return;
  }
  const secret = state.secret;

  const playerDistances = Object.keys(state.players).map((id) => ({
    id: id,
    distance: distance(secret.targetColor, state.players[id].selectedColor!),
  }));

  playerDistances.sort((a, b) => a.distance - b.distance);
  
  const places = playerDistances.slice(1).reduce((collection, current) => {
    const match = collection[collection.length - 1][0].distance;
    if (current.distance === match) {
      collection[collection.length - 1].push(current);
    } else {
      collection.push([current]);
    }
    return collection;
  }, [[playerDistances[0]]]);

  for (const firsts of places[0]) {
    state.scores[firsts.id] += 2;
  }
  state.previousFirsts = places[0].map((place) => place.id);
  state.previousSeconds = [];

  if (places.length > 1) {
    for (const seconds of places[1]) {
      state.scores[seconds.id] += 1;
    }
    state.previousSeconds = places[1].map((place) => place.id);
  }
}

/**
 * Compute final game situation
 * 
 * @param state Game state. Invariant: at least one player score is over winning score
 */
function computeGameOver(state: SwatchState): EndGameState {
  const passingScores = Object.keys(state.scores).map(
    (key) => ({score: state.scores[key], key: key}))
  .sort((a, b) => b.score - a.score)
  .filter((playerScore) => playerScore.score >= WINNING_SCORE);

  const winningScores = passingScores.filter(
    (playerScore) => playerScore.score === passingScores[0].score
  );

  return {
    winners: winningScores.map((s) => s.key),
    scores: state.scores,
  };
}

/**
 * Copies state from current round into previous round register
 * 
 * Invariant: Every player has guessed a color
 * 
 * @param state Game state
 */
function currentRoundToPreviousRound(state: SwatchState) {
  // Only need to do this on server
  if (!state.secret) {
    return;
  }

  const previousPlayerGuesses: PlayerGuesses = {};

  for (const id of Object.keys(state.players)) {
    previousPlayerGuesses[id] = {
      guess: state.players[id].selectedColor!,
    };
  }

  const previousRound = {
    guessColorShade: {
      colorName: state.targetColorName,
      colorValue: state.secret.targetColor,
      players: previousPlayerGuesses,
    },
  };

  state.previousRound = previousRound;
}

/**
 * Resets all player guesses
 * 
 * @param state Game state
 */
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
      secret: {
        targetColor: {r: 0, g: 0, b: 0},
      },
      targetColorName: 'Selecting color...',
      previousFirsts: [],
      previousSeconds: [],
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

    return result;
  },

  turn: {
    activePlayers: {all: 'chooseColor', minMoves: 1, maxMoves: 1},
    onBegin: (G, ctx) => {
      if (!G.secret || !ctx.random) {
        return;
      }
      const selectedColor = selectColor(ctx.random);
      if (selectedColor) {
        G.secret.targetColor = selectedColor.color;
        G.targetColorName = selectedColor.name;
      }
    },

    onEnd: (G, ctx) => {
      updateScores(G);
      currentRoundToPreviousRound(G);
      wipePlayerGuesses(G);
    },

    stages: {
      chooseColor: {
        moves: { 
          chooseColor: (G, ctx, color: Color) => {
            if (!ctx.playerID) {
              console.error('no player ID?');
              return;
            }

            G.players[ctx.playerID].selectedColor = color;
            if (!ctx.events) {
              throw new Error('no events API available');
            }
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

  endIf: (G, ctx): EndGameState | undefined => {
    if(!ctx.events) {
      return;
    }
    if (Object.keys(G.scores).some(
      (playerId) => G.scores[playerId] >= WINNING_SCORE)) {
        const gameOver = computeGameOver(G);
        return computeGameOver(G);
    }
    return undefined;
  },
};

