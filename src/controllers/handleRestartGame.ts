//Redux
import { AppDispatch } from '@/redux/store'
import {
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setIsGameEnd,
   setWinner,
} from '@/redux/slices/gameClassicSlice'
import { 
   setCurrentPlayerIndex, 
   setHistoryClassicSingle 
} from '@/redux/slices/gameClassicSingleSlice'
import {
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryClassicTeams,
   initializeTeams
} from '@/redux/slices/gameClassicTeamsSlice'
//Types
import { 
   InitializePlayersType, 
   InitializeTeamsType,
   GameSettingsStates,
   GameClassicStates 
} from '@/types/types'

//Restart handler for game regular
export const handleRestartGame = (
   gameType: GameSettingsStates['gameType'],
   playerNames: GameSettingsStates['playerNames'],
   gameMode: GameSettingsStates['gameMode'],
   isGameEnd: GameClassicStates['isGameEnd'],
   initializePlayers: InitializePlayersType | InitializeTeamsType,
   dispatch: AppDispatch
) => {
   if (gameType === 'single'){
      dispatch(initializePlayers({ playerNames, gameMode }))
      dispatch(setCurrentPlayerIndex(0))
      dispatch(setHistoryClassicSingle([]))
   } else {
      dispatch(initializeTeams({ playerNames, gameMode }))
      dispatch(setCurrentTeamIndex(0))
      dispatch(setCurrentPlayerIndexInTeam(0))
      dispatch(setHistoryClassicTeams([]))
   } 

   dispatch(setCurrentThrow(0))
   dispatch(setThrowValueSum(0))
   dispatch(setCurrentPlayerThrowsCount(0))

   if (isGameEnd) {
      dispatch(setIsGameEnd(false))
      dispatch(setWinner(null))
   }
}

