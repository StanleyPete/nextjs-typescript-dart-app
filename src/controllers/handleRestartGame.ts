import { AppDispatch } from '@/redux/store'
import {
   setCurrentPlayerIndex,
   setHistory,
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setIsGameEnd,
   setWinner,
} from '@/redux/slices/gameRegularSlice'
import {
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistory as setHistoryTeams,
   setCurrentThrow as setCurrentThrowTeams,
   setThrowValueSum as setThrowValueSumTeams,
   setCurrentPlayerThrowsCount as setCurrentPlayerThrowsCountTeams,
   setIsGameEnd as setIsGameEndTeams,
   setWinner as setWinnerTeams,
} from '@/redux/slices/gameRegularTeamsSlice'
import { InitializePlayersType, InitializeTeamsType } from '@/types/types'

//Restart handler for game regular
export const handleRestartGameRegular = (
   playerNames: string[],
   gameMode: number | string,
   isGameEnd: boolean,
   initializePlayers: InitializePlayersType,
   dispatch: AppDispatch
) => {
   dispatch(initializePlayers({ playerNames, gameMode }))
   dispatch(setCurrentPlayerIndex(0))
   dispatch(setCurrentThrow(0))
   dispatch(setHistory([]))
   dispatch(setThrowValueSum(0))
   dispatch(setCurrentPlayerThrowsCount(0))

   if (isGameEnd) {
      dispatch(setIsGameEnd(false))
      dispatch(setWinner(null))
   }
}

//Restart handler for game regular teams
export const handleRestartGameRegularTeams = (
   playerNames: string[],
   gameMode: number | string,
   isGameEnd: boolean,
   initializeTeams: InitializeTeamsType,
   dispatch: AppDispatch
) => {
   dispatch(initializeTeams({ playerNames, gameMode }))
   dispatch(setCurrentTeamIndex(0))
   dispatch(setCurrentPlayerIndexInTeam(0))
   dispatch(setCurrentThrowTeams(0))
   dispatch(setHistoryTeams([]))
   dispatch(setThrowValueSumTeams(0))
   dispatch(setCurrentPlayerThrowsCountTeams(0))

   if (isGameEnd) {
      dispatch(setIsGameEndTeams(false))
      dispatch(setWinnerTeams(null))
   }
}
