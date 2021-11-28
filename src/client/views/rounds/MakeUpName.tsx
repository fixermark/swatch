import { Ctx } from "boardgame.io";
import { useState } from "react";
import { colorToCode } from "../../../game/Color";
import { SwatchState } from "../../../game/Game";
import { MakeUpNameRound } from "../../../game/rounds/MakeUpNameRound";

export interface MakeUpNameProps {
    state: SwatchState,
    moves: Record<string, (...args: any[]) => void>;
    playerId: string;
}

export const MakeUpName = ({state, moves, playerId}: MakeUpNameProps) => {
    const publicState = MakeUpNameRound.getPublicState(state);
    const playerState = MakeUpNameRound.getPlayerState(state);

    const [colorName, setColorName] = useState('');

    const nameChosen = playerState[playerId].madeUpName !== undefined;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        moves.makeUpName(colorName);
    };

    return <div className="roundPanel">
        <div className="direction">Make up a name for this color:</div>
        <div className="roundrow">
            <div 
                className="colorbox" 
                style={{backgroundColor: `#${colorToCode(publicState.targetColorShade)}`}} 
            />
        </div>
        <form onSubmit={onSubmit}>
            <div className="roundrow">
                <input disabled={nameChosen} type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} />
            </div>
            <div className="roundrow">
                <button disabled={nameChosen} type="submit">Submit name</button>
            </div>
        </form>
    </div>;
}