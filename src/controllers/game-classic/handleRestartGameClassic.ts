//Redux
import { AppDispatch } from '@/redux/store'
import {
   setStartIndex,
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setIsGameEnd,
   setWinner,
} from '@/redux/slices/game-classic/gameClassicSlice'
import {
   setCurrentPlayerIndex,
   setHistoryClassicSingle,
   initializePlayers,
} from '@/redux/slices/game-classic/gameClassicSingleSlice'
import {
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryClassicTeams,
   initializeTeams,
} from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameClassicStates } from '@/types/redux/gameClassicTypes'


/* USED IN: 
      SettingsButtons component, 
      GameEndPopUp component 
*/
export const handleRestartGameClassic = (
   gameType: GameSettingsStates['gameType'],
   playerNames: GameSettingsStates['playerNames'],
   gameMode: GameSettingsStates['gameMode'],
   isGameEnd: GameClassicStates['isGameEnd'],
   dispatch: AppDispatch
) => {
   if (gameType === 'single') {
      dispatch(initializePlayers({ playerNames, gameMode }))
      dispatch(setCurrentPlayerIndex(0))
      dispatch(setHistoryClassicSingle([]))
   } else {
      dispatch(initializeTeams({ playerNames, gameMode }))
      dispatch(setCurrentTeamIndex(0))
      dispatch(setCurrentPlayerIndexInTeam(0))
      dispatch(setHistoryClassicTeams([]))
   }

   dispatch(setStartIndex(0))
   dispatch(setCurrentThrow(0))
   dispatch(setThrowValueSum(0))
   dispatch(setCurrentPlayerThrowsCount(0))

   if (isGameEnd) {
      dispatch(setIsGameEnd(false))
      dispatch(setWinner(null))
   }
}
