import { Ctx, MoveMap, PlayerID } from "boardgame.io";
import { SwatchState } from "./Game";

/**
 * Interface for a standard round of play
 */
export interface Round {
    name: string;
    initState: (G: SwatchState, ctx: Ctx) => void;
    onBegin: (G: SwatchState, ctx: Ctx) => void;
    scoreRound: (G: SwatchState) => void;
    buildPreviousRound: (G: SwatchState) => void;
    moves: MoveMap<SwatchState, Ctx>;
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
            throw new Error(`attempting to get player info for ${roundName}, but in round ${G.roundName}`);
        }

        return G.public as unknown as T;
    }
}