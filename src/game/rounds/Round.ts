import { Ctx, MoveMap, PlayerID } from "boardgame.io";
import { SwatchState } from "../Game";

/**
 * Interface for a standard round of play
 */
export interface Round<PLAYER_STATE, PUBLIC_STATE, LAST_ROUND_STATE> {
    name: string;
    initState: (G: SwatchState, ctx: Ctx) => void;
    onBegin: (G: SwatchState, ctx: Ctx) => void;
    scoreRound: (G: SwatchState) => void;
    buildPreviousRound: (G: SwatchState) => void;
    moves: MoveMap<SwatchState, Ctx>;
    getPlayerState: (G: SwatchState) => {[key: PlayerID]: PLAYER_STATE};
    getPublicState: (G: SwatchState) => PUBLIC_STATE;
    getLastRoundState: (G: SwatchState) => LAST_ROUND_STATE;
}

export function secretGetter<T>(roundName: string): (G: SwatchState) => T {
    return (G) => {
        if (G.roundName !== roundName) {
            throw new Error(`attempting to get secret for ${roundName}, but in round ${G.roundName}`);
        }

        return G.secret as unknown as T;
    }
}

export function privateStateGetter<T>(roundName: string): ( G: SwatchState) => {[key: PlayerID] : T} {
    return (G) => {
        if (G.roundName !== roundName) {
            throw new Error(`attempting to get player info for ${roundName}, but in round ${G.roundName}`);
        }

        return G.players as unknown as {[key: PlayerID]: T};
    }
}

export function publicStateGetter<T>(roundName: string): (G: SwatchState) => T {
    return (G) => {
        if (G.roundName !== roundName) {
            throw new Error(`attempting to get public state for ${roundName}, but in round ${G.roundName}`);
        }

        return G.public as unknown as T;
    }
}

export function lastRoundStateGetter<T>(roundName: string): (G: SwatchState) => T {
    return (G) => {
        if (!G.previousRound) {
            throw new Error('Attempted to get previous round state, but was not available');
        }
        if (G.previousRound.name !== roundName) {
            throw new Error(`attempting to get previous round for ${roundName}, but previous round was ${G.previousRound.name}`);
        }
        return G.previousRound.data as unknown as T;
    };
}