//Redux
import { AppDispatch } from '@/redux/store'
import { 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows, 
   setIsGameEnd, 
   setStartIndex, 
   setWinner 
} from '@/redux/slices/gameSlice'
import {
   initializeCricketPlayers,
   setCurrentPlayerIndex,
   setHistoryCricketSingle,
} from '@/redux/slices/game-cricket/gameCricketSingleSlice'
import {
   initializeCricketTeams,
   setCurrentPlayerIndexInTeam,
   setCurrentTeamIndex,
   setHistoryCricketTeams,
} from '@/redux/slices/game-cricket/gameCricketTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'

/* USED IN: 
      SettingsButtons component, 
      GameEndPopUp component 
*/
export const handleRestartGameCricket = (
   gameType: GameSettingsStates['gameType'],
   playerNames: GameSettingsStates['playerNames'],
   isGameEnd: GameStates['isGameEnd'],
   dispatch: AppDispatch
) => {
   if (gameType === 'single') {
      dispatch(initializeCricketPlayers({ playerNames }))
      dispatch(setCurrentPlayerIndex(0))
      dispatch(setHistoryCricketSingle([]))
   } else {
      dispatch(initializeCricketTeams({ playerNames }))
      dispatch(setCurrentTeamIndex(0))
      dispatch(setCurrentPlayerIndexInTeam(0))
      dispatch(setHistoryCricketTeams([]))
   }

   dispatch(setStartIndex(0))
   dispatch(setCurrentPlayerThrowsCount(0))
   dispatch(setCurrentPlayerThrows([]))

   if (isGameEnd) {
      dispatch(setIsGameEnd(false))
      dispatch(setWinner(null))
   }
}
