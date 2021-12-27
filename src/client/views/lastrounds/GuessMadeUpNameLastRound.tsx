/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { Ctx, FilteredMetadata, PlayerID } from "boardgame.io"
import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game"
import { nameForPlayerId } from "../../../game/Player";
import { GuessMadeUpNameRound } from "../../../game/rounds/GuessMadeUpNameRound";


export interface GuessMadeUpNameLastRoundProps {
    gameState: SwatchState;
    context: Ctx;
    matchData: FilteredMetadata;
}

/**  
 * Rendering the last round of play 
 */
export const GuessMadeUpNameLastRound = ({gameState, context, matchData}: GuessMadeUpNameLastRoundProps) => {
    if (!gameState.previousRound) {
        return null;
    }

    const previousRound = GuessMadeUpNameRound.getLastRoundState(gameState);
    
    const guessedByNames: Record<PlayerID, string> = {};

    for (const id of Object.keys(previousRound.guessedBy)) {
        const nameList = previousRound.guessedBy[id].map((guessId) => nameForPlayerId(guessId, matchData));
        guessedByNames[id] = nameList.length === 0 ? '<nobody>' : nameList.join(', ');
    }

    const guessedCorrectlyNames = previousRound.guessedCorrectly.map((id) => nameForPlayerId(id, matchData));
    const guessedCorrectlyReport = guessedCorrectlyNames.length === 0 ? '<nobody>' : guessedCorrectlyNames.join(', ');

    return <div className="lastroundblock">
        <h2>Last Round Results</h2>
        <h3>Color Name</h3>
            <p className="lastroundcolorname">{previousRound.colorName}</p>
            <div className="colorbox" style={{backgroundColor: `#${colorToCode(previousRound.colorValue)}`}} />
            <h3>Guesses</h3>
            <table className="guessMadeUpNameTable">
            {
                Object.keys(previousRound.madeUpNames).map((id) => (
                    <tr key={id}>
                        <td className="playerNameColumn">{nameForPlayerId(id, matchData)}:</td>
                        <td className="colorNameColumn">{previousRound.madeUpNames[id]}</td>
                        <td className="guesses">Guessed by: {guessedByNames[id]}</td>
                    </tr>
                ))
            }
            </table>
            <div className="lastroundrow">
                <span className="correctGuesses">Correct guesses:</span> {guessedCorrectlyReport}
            </div>
        </div>;

}