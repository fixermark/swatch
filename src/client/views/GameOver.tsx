import { FilteredMetadata, PlayerID } from 'boardgame.io';
import {EndGameState, SwatchState} from '../../game/Game';
import { nameForPlayerId } from '../../game/Player';
import { Scores } from './Scores';

export interface GameOverProps {
    state: SwatchState;
    matchData: FilteredMetadata;
    thisPlayerId: PlayerID;
    gameOver: EndGameState;
}

export const GameOver = ({state, matchData, thisPlayerId, gameOver}: GameOverProps) => {
    let winDescription: string;
    const winnerNames = gameOver.winners.map((id) => nameForPlayerId(id, matchData));

    if (winnerNames.length > 1) {
        let winnerNameList: string;
        if (winnerNames.length === 2) {
            winnerNameList = winnerNames.join(' and ');
        } else {
            winnerNameList = `${winnerNames.slice(0,winnerNames.length - 1).join(', ')}` +
            `, and ${winnerNames[winnerNames.length - 1]}`;
        }
        winDescription = `${winnerNameList} win!`;
    } else {
        winDescription = `${winnerNames[0]} wins!`;
    }

    return <div className="gameOver">
        <div className="victor">{winDescription}</div>
        <Scores state={state} matchData={matchData} thisPlayerId={thisPlayerId} />
    </div>;
}