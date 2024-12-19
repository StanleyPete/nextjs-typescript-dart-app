//Redux
import { AppDispatch } from '@/redux/store'
import { setStartIndex } from '@/redux/slices/gameSlice'

//Types
import { GameStates } from '@/types/redux/gameTypes'
import { PlayerClassic, TeamClassic } from '@/types/redux/gameClassicTypes'
import { PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'

/* 
   USED IN:
      game-classic: 
         - handleSubmitThrowKeyboardButtons
         - handleSubmitThrowNumberButtons
      game-cricket:
         - handleScoreButtons
         - handleSwitchStartPlayerOrTeamIndex

   SWITCH TO ANOTHER PLAYER OR TEAM STARTING THE LEG: 
      Example: If there are 4 players and startIndex === 3 (last player's turn), 
      after increasing startIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchStartPlayerOrTeamIndex = (
   startIndex: GameStates['startIndex'],
   playersOrTeams: PlayerClassic[] | TeamClassic[] | PlayerCricket[] | TeamCricket[],
   dispatch: AppDispatch
) => {
   const nextStartPlayerOrTeamIndex = (startIndex + 1) % playersOrTeams.length
   dispatch(setStartIndex(nextStartPlayerOrTeamIndex))
}
