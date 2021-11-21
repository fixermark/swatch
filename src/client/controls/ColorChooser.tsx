import { Ctx, PlayerID } from "boardgame.io"
import React, { Fragment } from "react";
import { codeToColor } from "../../game/Color";
import { SwatchState } from "../../game/Game"

export interface GuessColorProps {
    state: SwatchState;
    context: Ctx;
    moves: Record<string, (...args: any[]) => void>;
    playerId: PlayerID;
}

export const ColorChooser = ({state, context, moves, playerId}: GuessColorProps) => {
    const [selectedColor, setSelectedColor] = React.useState<string>('#000000');

    const colorSelected = context.activePlayers ? context.activePlayers[playerId] !== "chooseColor" : true;
    return <Fragment>
        <div><input className="guesscolor" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}/></div>
        { colorSelected && <div>Color selected!</div>}
        <div><button className="guessbutton" disabled={colorSelected} onClick={() => moves.chooseColor(codeToColor(selectedColor.slice(1)))}>Choose color</button></div>
        </Fragment>;
}