//Redux
import { AppDispatch } from '@/redux/store'
import { setStartIndex as setStartIndexClassic} from '@/redux/slices/game-classic/gameClassicSlice'
import { setStartIndex as setStartIndexCricket } from '@/redux/slices/game-cricket/gameCricketSlice'
//Types
import {
   GameClassicStates, 
   PlayerClassic, 
   TeamClassic 
} from '@/types/redux/gameClassicTypes'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'

/* 
   USED IN:
      ThrowValueSection component: 
         - handleSubmitThrowKeyboardButtons, 

      NumberButtons component:
         - handleSubmitThrowNumberButtons,

   SWITCH TO ANOTHER PLAYER OR TEAM STARTING THE LEG: 
   Example: If there are 4 players and startIndex === 3 (last player's turn), 
   after increasing startIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchStartPlayerOrTeamIndex = (
   gameMode: GameSettingsStates['gameMode'],
   startIndex: GameClassicStates['startIndex'],
   playersOrTeams: PlayerClassic[] | TeamClassic[] | PlayerCricket[] | TeamCricket[],
   dispatch: AppDispatch
) => {
   const nextStartPlayerOrTeamIndex = (startIndex + 1) % playersOrTeams.length
   dispatch(
      gameMode === 'Cricket'
         ? setStartIndexCricket(nextStartPlayerOrTeamIndex)
         : setStartIndexClassic(nextStartPlayerOrTeamIndex)
   )
}
