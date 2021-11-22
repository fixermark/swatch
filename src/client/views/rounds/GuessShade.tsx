import { Ctx, MoveMap } from "boardgame.io";
import React, { Fragment } from "react";
import { SwatchState } from "../../../game/Game";
import { GuessShadeRound, GUESS_SHADE_ROUND_NAME } from "../../../game/rounds/GuessShadeRound";
import { ROUNDS } from "../../../game/rounds/Rounds";
import { ColorChooser } from "../../controls/ColorChooser";

export interface GuessShadeProps {
    state: SwatchState,
    context: Ctx,
    moves: Record<string, (...args: any[]) => void>;
    playerId: string;
}

export const GuessShade = ({state, context, moves, playerId}: GuessShadeProps) => {
    const publicState = GuessShadeRound.getPublicState(state);

    return <div>
         <div className="direction">Guess the color for</div>
          <div className="colorname">{publicState.targetColorName}</div>
          <ColorChooser state={state} context={context} moves={moves} playerId={playerId}/>
    </div>;
}