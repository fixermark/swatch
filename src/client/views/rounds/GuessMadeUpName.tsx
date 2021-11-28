import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game";
import { GuessMadeUpNameRound } from "../../../game/rounds/GuessMadeUpNameRound";

export interface GuessMadeUpNameProps {
    state: SwatchState;
    moves: Record<string, (...args: any[]) => void>;
    playerId: string;
}

export const GuessMadeUpName = ({state, moves, playerId}: GuessMadeUpNameProps) => {
    const publicState = GuessMadeUpNameRound.getPublicState(state);
    const playerState = GuessMadeUpNameRound.getPlayerState(state);

    const guessedName = playerState[playerId].selectedName;

    return <div className="roundPanel">
        <div className="direction">Guess the name for</div>
        <div className="roundrow">
            <div 
                className="colorbox" 
                style={{backgroundColor: `#${colorToCode(publicState.targetColorShade)}`}} 
            />
        </div>
        { guessedName && <div>You guessed {guessedName}</div>}
        <ul className="colorNames">
            {publicState.candidateNames.map((name) => 
                <li key={name}>
                    <button 
                        className="guessbutton" 
                        disabled={guessedName !== undefined}
                        onClick={() => moves.guessName(name)}>
                            {name}
                        </button>
                </li>
            )}
        </ul>
    </div>
}