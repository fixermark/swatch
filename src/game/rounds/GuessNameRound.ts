/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { Ctx, PlayerID } from "boardgame.io";
import { Color } from "../Color";
import { selectColor } from "../ColorSelector";
import { SwatchState } from "../Game";
import { lastRoundStateGetter, privateStateGetter, publicStateGetter, Round, secretGetter } from "./Round";

export const GUESS_NAME_ROUND_NAME = 'guessColorName';

export interface GuessNameSecret {
    targetName: string;
}

export interface GuessNamePrivatePlayerState {
    selectedName: string | undefined;
}

export interface GuessNamePublicState {
    targetColorShade: Color;
    candidateNames: string[];
}

interface GuessNamePlayerGuesses {
    [key: PlayerID]: {
        guess: string;
    };
}

export interface GuessNamePreviousRoundState {
    colorName: string;
    colorValue: Color;
    guesses: GuessNamePlayerGuesses;
}

const getSecretState = secretGetter<GuessNameSecret>(GUESS_NAME_ROUND_NAME);
const getPrivatePlayerState = privateStateGetter<GuessNamePrivatePlayerState>(GUESS_NAME_ROUND_NAME);
const getPublicState = publicStateGetter<GuessNamePublicState>(GUESS_NAME_ROUND_NAME);


export const GuessNameRound: Round<GuessNamePrivatePlayerState, GuessNamePublicState, GuessNamePreviousRoundState> = {
    name: GUESS_NAME_ROUND_NAME,
    initState: (G: SwatchState, ctx: Ctx) => {
        G.secret = {
            targetName: '',
        };
        for (const playerId of ctx.playOrder) {
            G.players[playerId] = {
                selectedName: undefined,
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
            const wrongAnswers = ctx.random.Shuffle(selectedColor.nearby).slice(0,3);
            secret.targetName = selectedColor.name;
            publicState.targetColorShade = selectedColor.color;
            publicState.candidateNames = ctx.random.Shuffle([selectedColor.name, ...wrongAnswers]);
        }
    },
    scoreRound: (G) => {
        if (G.secret === undefined) {
            return;
        }
        const secret = getSecretState(G);
        const players = getPrivatePlayerState(G);

        const rightGuessingPlayers = Object.keys(players).filter((id) => players[id].selectedName === secret.targetName);
        for (const playerId of rightGuessingPlayers) {
            G.scores[playerId] += 1;
        }
        G.previousFirsts = rightGuessingPlayers;
        G.previousSeconds = [];
    },
    buildPreviousRound: (G) => {
        // Only need to do this on server
        if (!G.secret) {
            return;
        }

        const guesses: GuessNamePlayerGuesses = {};

        const players = getPrivatePlayerState(G);
        const secret = getSecretState(G);
        const publicState = getPublicState(G);

        for (const id of Object.keys(players)) {
            // Safe to use ! here since all players have guessed by end of round
            guesses[id] = {
                guess: players[id].selectedName!,
            };
        }

        const data: GuessNamePreviousRoundState = {
            colorName: secret.targetName,
            colorValue: publicState.targetColorShade,
            guesses: guesses,
        };

        G.previousRound = {
            name: GUESS_NAME_ROUND_NAME,
            data: data,
        };
    },
    moves: {
        guessName: (G, ctx, name: string) => {
            if (!ctx.playerID) {
                console.error('no player ID?');
                return;
            }

            const players = getPrivatePlayerState(G);

            players[ctx.playerID].selectedName = name;

            if (!ctx.events) {
                throw new Error('no events API available');
            }
            if (!ctx.activePlayers || Object.keys(ctx.activePlayers).length === 1) {
                ctx.events.endTurn();
            } else {
                ctx.events.endStage();
            }
        },
    },
    getPlayerState: getPrivatePlayerState,
    getPublicState: getPublicState,
    getLastRoundState: lastRoundStateGetter<GuessNamePreviousRoundState>(GUESS_NAME_ROUND_NAME),
};