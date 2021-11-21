import { FilteredMetadata, PlayerID } from "boardgame.io"
import { SwatchState } from "../../game/Game"
import { nameForPlayerId, scoreForPlayer } from "../../game/Player"

export interface ScoresProps {
    state: SwatchState;
    matchData: FilteredMetadata;
    thisPlayerId: PlayerID;
}

export const Scores = ({state, matchData, thisPlayerId}: ScoresProps) => {
    return <div className="playerScoresSection">
    <div>Scores:</div>
    <div className="playerScores">
    {
      matchData && matchData.map(({id}) => 
      <div key={id}>
        <span className={thisPlayerId && id === parseInt(thisPlayerId, 10) ? 'thisPlayer' : ''}>
          {nameForPlayerId(id.toString(), matchData)}: {scoreForPlayer(id.toString(), state)}
        </span>
      </div>
      )
    }
    </div>
  </div>;
}