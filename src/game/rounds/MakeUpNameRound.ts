/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { INVALID_MOVE } from "boardgame.io/core";
import { Color } from "../Color";
import { selectColor } from "../ColorSelector";
import { SwatchState } from "../Game";
import { GuessMadeUpNameRound, GUESS_MADE_UP_NAME_ROUND_NAME } from "./GuessMadeUpNameRound";
import { privateStateGetter, publicStateGetter, Round, secretGetter } from "./Round";
import { ROUNDS } from "./Rounds";

export const MAKE_UP_NAME_ROUND_NAME = 'makeUpColorName';

export interface MakeUpNameSecret {
    actualName: string;
}

export interface MakeUpNamePrivatePlayerState {
    madeUpName: string | undefined;
}

export interface MakeUpNamePublicState {
    targetColorShade: Color;
}

// This round has no previous state; it's intermediate

const getSecretState = secretGetter<MakeUpNameSecret>(MAKE_UP_NAME_ROUND_NAME);
export const getPrivatePlayerState = privateStateGetter<MakeUpNamePrivatePlayerState>(MAKE_UP_NAME_ROUND_NAME);
const getPublicState = publicStateGetter<MakeUpNamePublicState>(MAKE_UP_NAME_ROUND_NAME);

export const MakeUpNameRound: Round<MakeUpNamePrivatePlayerState, MakeUpNamePublicState, {}> = {
    name: MAKE_UP_NAME_ROUND_NAME,
    initState: (G, ctx) => {
        G.secret = {
            actualName: '',
        }
        for (const playerId of ctx.playOrder) {
            G.players[playerId] = {
                madeUpName: undefined,
            };
        }
    },
    onBegin: (G, ctx) => {
        if (!G.secret || !ctx.random) {
            return;
        }
        const selectedColor = selectColor(ctx.random);
        const secret = getSecretState(G);
        const publicState = getPublicState(G);
        if (selectedColor) {
            secret.actualName = selectedColor.name;
            publicState.targetColorShade = selectedColor.color;
        }
    },
    scoreRound: (G) => {
        // No score updates happen here; instead, this round transitions to GuessMadeUpNameRound
    },
    buildPreviousRound: (G) => {
        // No previous state to build; this is an intermediate phase before the GuessMadeUpNameRound
    },
    moves: {
        makeUpName: (G, ctx, name: string) => {
            if (!ctx.playerID) {
                return;
            }

            const secret = getSecretState(G);
            if (!secret) {
                return;
            }

            if (name === secret.actualName) {
                return INVALID_MOVE;
            }

            const players = getPrivatePlayerState(G);
            players[ctx.playerID].madeUpName = name;
            if (!ctx.events) {
                return;
            }

            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.setActivePlayers({
                    all: GUESS_MADE_UP_NAME_ROUND_NAME,
                    minMoves: 1,
                    maxMoves: 1,
                });
                G.roundName = GUESS_MADE_UP_NAME_ROUND_NAME;
                GuessMadeUpNameRound.initState(G, ctx);
            } else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: getPrivatePlayerState,
    getPublicState: getPublicState,
    getLastRoundState: () => {
        throw new Error('We should never need to get last round state for MakeUpNameRound');
    },
};