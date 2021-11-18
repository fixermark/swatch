import { Game } from 'boardgame.io';
import { INVALID_MOVE, PlayerView } from 'boardgame.io/core';
import { Color } from './Color';

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
  // All keys except current player are hidden by PlayerView.STRIP_SECRETS
  players: {[key: string]: PrivatePlayerState},
}

export const Swatch: Game<SwatchState> = {
  name: 'swatch',
  // automatically limit player state by stripping 'secret' and all 'player.id' but the current player
  playerView: PlayerView.STRIP_SECRETS,
  setup: () => ({players: {}}),

  turn: {
    moveLimit: 1,
  },

  moves: {
    chooseColor: (G, ctx, id, color: Color) => {
    },
  },

  endIf: (G, ctx) => {
  },

  ai: {
    enumerate: (G, ctx) => {
      return [{move: 'chooseColor'}];
    },
  },
};

/** Return true if `cells` is in a winning configuration. */
function IsVictory(cells: (string | null)[]): boolean {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row: number[]): boolean => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

/** Return true if all `cells` are occupied. */
function IsDraw(cells: (null | string)[]): boolean {
  return cells.filter((c) => c === null).length === 0;
}
