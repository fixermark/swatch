/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { FilteredMetadata, PlayerID } from "boardgame.io";
import { SwatchState } from "./Game";

const ANONYMOUS_PLAYER = '<anonymous player>';

export function nameForPlayerId(id: PlayerID, matchData: FilteredMetadata): string {
    const metadata = matchData.find((data) => data.id === parseInt(id, 10));

    if (!metadata) {
        return ANONYMOUS_PLAYER;
    }

    return metadata.name ? metadata.name : ANONYMOUS_PLAYER;
}

export function scoreForPlayer(id: PlayerID, gameState: SwatchState) {
    return gameState.scores[id];
}