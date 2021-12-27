/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game";
import { GuessNameRound } from "../../../game/rounds/GuessNameRound";

export interface GuessNameProps {
    state: SwatchState;
    moves: Record<string, (...args: any[]) => void>;
    playerId: string;
}

export const GuessName = ({state, moves, playerId}: GuessNameProps) => {
    const publicState = GuessNameRound.getPublicState(state);
    const playerState = GuessNameRound.getPlayerState(state);

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