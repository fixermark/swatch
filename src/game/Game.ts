import { Ctx, Game, PlayerID, StageMap } from 'boardgame.io';
import { PlayerView } from 'boardgame.io/core';
import { GuessNameRound } from './rounds/GuessNameRound';
import { GuessShadeRound, GUESS_SHADE_ROUND_NAME } from './rounds/GuessShadeRound';
import { MAKE_UP_NAME_ROUND_NAME } from './rounds/MakeUpNameRound';
import { NEXT_ROUND_OPTIONS, PreviousRoundState, PrivatePlayerState, PublicState, ROUNDS, Secrets } from './rounds/Rounds';

/**
 * Description of final game state
 */
export interface EndGameState {
  winners: PlayerID[];
  scores: {[key: PlayerID]: number};
}

export interface SwatchState {
  // Everything in this field is hidden by PlayerView.STRIP_SECRETS
  secret?: Secrets,
  roundName: string;
  public: PublicState;
  // All keys except current player are hidden by PlayerView.STRIP_SECRETS
  players: {[key: PlayerID]: PrivatePlayerState};
  scores: {[key: PlayerID]: number};
  previousRound?: {
    name: string;
    data: PreviousRoundState;
  };
  previousFirsts: PlayerID[];
  previousSeconds: PlayerID[];
}

/** Score to meet or exceed to win the game */
const WINNING_SCORE = 10;

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
 * Set of stages, built off the ROUNDS table
 */
const STAGES: StageMap<SwatchState, Ctx> = {};
for (const key of Object.keys(ROUNDS)) {
  STAGES[key] = {
    moves: ROUNDS[key].moves,
  };
}

console.log(`STAGES is ${JSON.stringify(STAGES)}`);

export const Swatch: Game<SwatchState> = {
  name: 'swatch',
  minPlayers: 1,
  maxPlayers: 8,
  // automatically limit player state by stripping 'secret' and all 'player.id' but the current player
  playerView: PlayerView.STRIP_SECRETS,
  setup: (ctx) => {
    const result: SwatchState = {
      roundName: GUESS_SHADE_ROUND_NAME,
      players: {},
      scores: {},
      secret: {
        targetColor: {r: 0, g: 0, b: 0},
      },
      public: {
        targetColorName: 'Selecting color...',
      },
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
    onBegin: (G, ctx) => {
      if (!G.secret || !ctx.random || !ctx.events) {
        return;
      }
      // choose next round
      const nextRound = ctx.random.Shuffle(NEXT_ROUND_OPTIONS)[0];
      //const nextRound = MAKE_UP_NAME_ROUND_NAME;

      G.roundName = nextRound;
      ROUNDS[G.roundName].initState(G, ctx);
      ROUNDS[G.roundName].onBegin(G, ctx);

      ctx.events.setActivePlayers({all: nextRound,
        minMoves: 1,
        maxMoves: 1,
      });
    },

    onEnd: (G, ctx) => {
      const round = ROUNDS[G.roundName];
      round.scoreRound(G);
      round.buildPreviousRound(G);
    },

    stages: STAGES,
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

