import { Ctx, FilteredMetadata } from "boardgame.io"
import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game"
import { nameForPlayerId } from "../../../game/Player";
import { GuessNameRound } from "../../../game/rounds/GuessNameRound";


export interface GuessNameLastRoundProps {
    gameState: SwatchState;
    context: Ctx;
    matchData: FilteredMetadata;
}

/**  
 * Rendering the last round of play 
 */
export const GuessNameLastRound = ({gameState, context, matchData}: GuessNameLastRoundProps) => {
    if (!gameState.previousRound) {
        return null;
    }

    const previousRound = GuessNameRound.getLastRoundState(gameState);
    
    return <div className="lastroundblock">
        <h2>Last Round Results</h2>
        <h3>Color Name</h3>
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
                <div>{previousRound.guesses[id].guess}</div>
            </div>
            })
        }
        </div>
    </div>;
}