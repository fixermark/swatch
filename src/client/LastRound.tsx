import { Ctx, FilteredMetadata } from "boardgame.io"
import { colorToCode } from "../game/Color";
import { SwatchState } from "../game/Game"
import { nameForPlayerId } from "../game/Player";


export interface LastRoundProps {
    gameState: SwatchState;
    context: Ctx;
    matchData: FilteredMetadata;
}

/**  
 * Rendering the last round of play 
 */

export const LastRound = ({gameState, context, matchData}: LastRoundProps) => {
    if (!gameState.previousRound) {
        return null;
    }

    const previousRound = gameState.previousRound.guessColorShade!;
    
    return <div>
        <p>Color name: {previousRound.colorName}</p>
        <div className="colorbox" style={{backgroundColor: `#${colorToCode(previousRound.colorValue)}`}} />
        {
            Object.keys(previousRound.players).map((id) => 
            <div className="playerGuess">
                <div className="playerName">{nameForPlayerId(id, matchData)}</div>
                <div className="colorbox" style={{backgroundColor: `#${colorToCode(previousRound.players[id].guess)}`}} />
            </div>
            )
        }
    </div>;
}