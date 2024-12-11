import { handleSwitchPlayer, handleSwitchTeam } from '@/controllers/handleSwitchPlayerOrTeam'
import { playSound } from '@/controllers/playSound'
import { AppDispatch } from '@/redux/store'
import { Player, HistoryEntry, Team, HistoryEntryTeams } from '@/types/types'
import {
   setPlayers,
   setHistory,
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
} from '@/redux/slices/gameRegularSlice'
import {
   setTeams,
   setHistory as setHistoryTeams,
   setCurrentThrow as setCurrentThrowTeams,
   setThrowValueSum as setThrowValueSumTeams,
   setCurrentPlayerThrowsCount as setCurrentPlayerThrowsCountTeams,
   setCurrentPlayerThrows as setCurrentPlayerThrowsTeams,
} from '@/redux/slices/gameRegularTeamsSlice'

/*  
    SUBMIT THROW HANDLER FOR SUBMIT SCORE BUTTON:
    Created for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value
*/
export const handleSubmitThrowSubmitScoreButtonRegular = (
   players: Player[],
   currentPlayerIndex: number,
   currentPlayerThrows: number[],
   history: HistoryEntry[],
   isSoundEnabled: boolean,
   dispatch: AppDispatch
) => {
   const updatedPlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = updatedPlayers[currentPlayerIndex]

   const throwSum = currentPlayerThrows.reduce(
      (acc: number, throwValue: number) => acc + throwValue,
      0
   )

   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntry = {
      historyPlayerIndex: currentPlayerIndex,
      historyPointsLeft: currentPlayer.pointsLeft + throwSum,
      historyTotalThrows: currentPlayer.totalThrows,
      historyLastScore: currentPlayer.lastScore,
      historyLastAverage: currentPlayer.average,
      historyTotalAttempts: currentPlayer.totalAttempts,
   }

   //Updating lastScore, totalAttempts and average calculation
   currentPlayer.lastScore = throwSum
   currentPlayer.totalAttempts += 1
   currentPlayer.average =
    currentPlayer.totalThrows / currentPlayer.totalAttempts

   //Updating history state
   dispatch(setHistory([...history, newHistoryEntry]))

   //Sound-effect
   if (throwSum === 0) {
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(throwSum.toString(), isSoundEnabled)
   }

   //Resetting states
   dispatch(setThrowValueSum(0))
   dispatch(setCurrentPlayerThrows([]))
   dispatch(setCurrentPlayerThrowsCount(0))
   dispatch(setCurrentThrow(0))

   //Switching to the next player
   handleSwitchPlayer(currentPlayerIndex, players, dispatch)

   //Updating player's state
   dispatch(setPlayers(updatedPlayers))
}

export const handleSubmitThrowSubmitScoreButtonTeams = (
   teams: Team[],
   currentTeamIndex: number,
   currentPlayerIndexInTeam: number,
   currentPlayerThrows: number[],
   history: HistoryEntryTeams[],
   isSoundEnabled: boolean,
   dispatch: AppDispatch
) => {
   const updatedTeams = JSON.parse(JSON.stringify(teams))
   const currentTeam = updatedTeams[currentTeamIndex]

   const throwSum = currentPlayerThrows.reduce((acc: number, throwValue: number) => acc + throwValue, 0)

   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntryTeams = {
      historyTeamIndex: currentTeamIndex,
      historyPlayerIndexInTeam: currentPlayerIndexInTeam,
      historyPointsLeft: currentTeam.pointsLeft + throwSum,
      historyTotalThrows: currentTeam.totalThrows, 
      historyLastScore: currentTeam.lastScore,
      historyLastAverage: currentTeam.average,
      historyTotalAttempts: currentTeam.totalAttempts
   }
   
   //Updating lastScore and totalAttempts
   currentTeam.lastScore = throwSum
   currentTeam.totalAttempts += 1

   //Average calculation:
   currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

   //Updating history state
   dispatch(setHistoryTeams([...history, newHistoryEntry]))

   //Sound-effect
   if(throwSum === 0){
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(throwSum.toString(), isSoundEnabled)
   }
   
   //Resetting states
   dispatch(setThrowValueSumTeams(0))
   dispatch(setCurrentPlayerThrowsTeams([]))
   dispatch(setCurrentPlayerThrowsCountTeams(0))
   dispatch(setCurrentThrowTeams(0))

   //Switching to the next player
   handleSwitchTeam(currentTeamIndex, currentPlayerIndexInTeam, teams, dispatch)
   
   //Updating player's state
   dispatch(setTeams(updatedTeams))
}
