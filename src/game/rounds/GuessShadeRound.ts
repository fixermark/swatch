/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { Ctx, PlayerID } from "boardgame.io";
import { Color, distance } from "../Color";
import { selectColor } from "../ColorSelector";
import { SwatchState } from "../Game";
import { lastRoundStateGetter, privateStateGetter, publicStateGetter, Round, secretGetter } from "./Round";

export const GUESS_SHADE_ROUND_NAME = 'guessShade';

export interface GuessShadeSecret {
    targetColor: Color;
}

export interface GuessShadePrivatePlayerState {
    selectedColor: Color | undefined;
}

export interface GuessShadePublicState {
    targetColorName: string;
}

export interface ShadePlayerGuesses {
    [key: PlayerID]: {
        guess: Color;
      };
}

interface PlayerGuesses {
    [key: PlayerID]: {
      guess: Color;
    };
  }
  
export interface GuessShadePreviousRoundState {
    colorName: string;
    colorValue: Color;
    guesses: ShadePlayerGuesses;
}

const getSecretState = secretGetter<GuessShadeSecret>(GUESS_SHADE_ROUND_NAME);
const getPrivatePlayerState = privateStateGetter<GuessShadePrivatePlayerState>(GUESS_SHADE_ROUND_NAME);
const getPublicState = publicStateGetter<GuessShadePublicState>(GUESS_SHADE_ROUND_NAME);


export const GuessShadeRound: Round<GuessShadePrivatePlayerState, GuessShadePublicState, GuessShadePreviousRoundState> = {
    name: GUESS_SHADE_ROUND_NAME,
    initState: (G: SwatchState, ctx: Ctx) => {
        G.secret = {
            targetColor: {
                r: 0,
                g: 0,
                b: 0,
            },
        };
        for (const playerId of ctx.playOrder) {
            G.players[playerId] = {
                selectedColor: undefined,
            };
        }
    },
    onBegin: (G: SwatchState, ctx: Ctx) => {
        if (!G.secret || !ctx.random) {
            return;
        }
        const selectedColor = selectColor(ctx.random);
        const secret = getSecretState(G);
        const publicState = getPublicState(G);
        if (selectedColor) {
            secret.targetColor = selectedColor.color;
            publicState.targetColorName = selectedColor.name;
        }
    },
    scoreRound: (G: SwatchState) => {
        if (G.secret === undefined) {
            return;
        }
        const secret = getSecretState(G);
        const players = getPrivatePlayerState(G);
    
        // note: safe to use selectedColor!; as an invariant, everyone must have guessed
        // if we're scoring the round.
        const playerDistances = Object.keys(G.players).map((id) => ({
            id: id,
            distance: distance(secret.targetColor, players[id].selectedColor!),
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
            G.scores[firsts.id] += 2;
        }
        G.previousFirsts = places[0].map((place) => place.id);
        G.previousSeconds = [];
    
        if (places.length > 1) {
            for (const seconds of places[1]) {
                G.scores[seconds.id] += 1;
            }
            G.previousSeconds = places[1].map((place) => place.id);
        }
    },
    buildPreviousRound: (G) => {
        // Only need to do this on server
        if (!G.secret) {
            return;
        }

        const secret = getSecretState(G);
        const players = getPrivatePlayerState(G);
        const publicState = getPublicState(G);
        const previousPlayerGuesses: PlayerGuesses = {};

        for (const id of Object.keys(players)) {
            // Safe to use ! here; since we're building previous round, all players
            // have guessed
            previousPlayerGuesses[id] = {
                guess: players[id].selectedColor!,
            };
        }

        const previousRound = {
            name: GUESS_SHADE_ROUND_NAME,
            data: {
                colorName: publicState.targetColorName,
                colorValue: secret.targetColor,
                guesses: previousPlayerGuesses,
            },
        };

        G.previousRound = previousRound;
    },
    moves: {
        chooseColor: (G, ctx, color: Color) => {
            if (!ctx.playerID) {
              console.error('no player ID?');
              return;
            }

            const players = getPrivatePlayerState(G);

            players[ctx.playerID].selectedColor = color;
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
    getLastRoundState: lastRoundStateGetter<GuessShadePreviousRoundState>(GUESS_SHADE_ROUND_NAME),
};