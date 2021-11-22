import { Ctx, FilteredMetadata } from "boardgame.io"
import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game"
import { nameForPlayerId } from "../../../game/Player";
import { GuessShadeRound } from "../../../game/rounds/GuessShadeRound";


export interface GuessShadeLastRoundProps {
    gameState: SwatchState;
    context: Ctx;
    matchData: FilteredMetadata;
}

/**  
 * Rendering the last round of play 
 */
export const GuessShadeLastRound = ({gameState, context, matchData}: GuessShadeLastRoundProps) => {
    if (!gameState.previousRound) {
        return null;
    }

    const previousRound = GuessShadeRound.getLastRoundState(gameState);
    
    return <div className="lastroundblock">
        <h2>Last Round Results</h2>
        <h3>Color</h3>
        <p className="lastroundcolorname">{previousRound.colorName}</p>
        <div className="colorbox" style={{backgroundColor: `#${colorToCode(previousRound.colorValue)}`}} />
        <h3>Guesses</h3>
        <div className="lastroundrow">
        {
            Object.keys(previousRound.guesses).map((id) => {
                let addedClass = '';
                if (gameState.previousFirsts.includes(id)) {
                    addedClass = 'firstplace';
                } else if (gameState.previousSeconds.includes(id)) {
                    addedClass = 'secondplace';
                }
            return <div className={`playerGuess ${addedClass}`}>
                <div className="playerName">{nameForPlayerId(id, matchData)}</div>
                <div className="colorbox" style={{backgroundColor: `#${colorToCode(previousRound.guesses[id].guess)}`}} />
            </div>
            })
        }
        </div>
    </div>;
}