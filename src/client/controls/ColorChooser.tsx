/*
 * Copyright 2021 Mark T. Tomczak
 * Licensed under the MIT License (https://opensource.org/licenses/MIT)
 */

import { Ctx, PlayerID } from "boardgame.io"
import React, { Fragment } from "react";
import { codeToColor, Color, colorToCode } from "../../game/Color";
import { SwatchState } from "../../game/Game"

export interface GuessColorProps {
    state: SwatchState;
    context: Ctx;
    moves: Record<string, (...args: any[]) => void>;
    playerId: PlayerID;
}

export const ColorChooser = ({state, context, moves, playerId}: GuessColorProps) => {
    const [selectedColor, setSelectedColor] = React.useState<string>('#000000');
    const colorValue = codeToColor(selectedColor.slice(1));

    const colorSelected = context.activePlayers ? context.activePlayers[playerId] !== "guessShade" : true;
    return <div className="colorChooser">
        <div className="colorChooserControlRow">
            <div className="colorChooserBox">
                <input className="guesscolor" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}/>
            </div>
            {colorValue && 
                <div className="chooseColorSliders">
                    <div><input type="range" min="0" max="255" value={colorValue.r} onChange={(e) => updateColor(setSelectedColor, colorValue, 'r', e.target.value)}/>red</div>
                    <div><input type="range" min="0" max="255" value={colorValue.g} onChange={(e) => updateColor(setSelectedColor, colorValue, 'g', e.target.value)}/>green</div>
                    <div><input type="range" min="0" max="255" value={colorValue.b} onChange={(e) => updateColor(setSelectedColor, colorValue, 'b', e.target.value)}/>blue</div>
                </div>
            }
        </div>
        <div className="colorChooserSubmit">
            { colorSelected && <div>Color selected!</div>}
            <div><button className="guessbutton" disabled={colorSelected} onClick={() => moves.chooseColor(codeToColor(selectedColor.slice(1)))}>Submit choice</button></div>
        </div>
    </div>;
}

/**
 * Update color with a new value
 * @param setSelectedColor Accessor to update color
 * @param currentColor current RGB color value
 * @param component Which piece of color to change
 * @param value new value to assign to component of currentColor
 */
function updateColor(
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>, 
    currentColor: Color,
    component: string, 
    value: string): void {

    const colorNumber = parseInt(value, 10);
    const newColor = {...currentColor, [component]: colorNumber};
    setSelectedColor(`#${colorToCode(newColor)}`);
}
