/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { Ctx, FilteredMetadata } from "boardgame.io";
import { SwatchState } from "../../game/Game";
import { GUESS_MADE_UP_NAME_ROUND_NAME } from "../../game/rounds/GuessMadeUpNameRound";
import { GUESS_NAME_ROUND_NAME } from "../../game/rounds/GuessNameRound";
import { GUESS_SHADE_ROUND_NAME } from "../../game/rounds/GuessShadeRound";
import { GuessMadeUpNameLastRound } from "./lastrounds/GuessMadeUpNameLastRound";
import { GuessNameLastRound } from "./lastrounds/GuessNameLastRound";
import { GuessShadeLastRound } from "./lastrounds/GuessShadeLastRound";

export interface LastRoundProps {
    gameState: SwatchState;
    context: Ctx;
    matchData: FilteredMetadata;
}

export const LastRound = ({gameState, context, matchData}: LastRoundProps) => {
    if (!gameState.previousRound) {
        return null;
    }

    if (gameState.previousRound.name === GUESS_SHADE_ROUND_NAME) {
        return <GuessShadeLastRound gameState={gameState} context={context} matchData={matchData} />
    }
    if (gameState.previousRound.name === GUESS_NAME_ROUND_NAME) {
        return <GuessNameLastRound gameState={gameState} context={context} matchData={matchData} />
    }
    if (gameState.previousRound.name === GUESS_MADE_UP_NAME_ROUND_NAME) {
        return <GuessMadeUpNameLastRound gameState={gameState} context={context} matchData={matchData} />
    }
    // unknown last round type
    return null;
}