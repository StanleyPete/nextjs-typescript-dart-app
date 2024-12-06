import { AppDispatch } from '@/redux/store'
import {
   setPlayers,
   setHistory,
   setCurrentPlayerIndex,
   setThrowValueSum,
   setCurrentPlayerThrows,
   setCurrentPlayerThrowsCount,
} from '@/redux/slices/gameRegularSlice'
import {
   setTeams,
   setHistory as setHistoryTeams,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setThrowValueSum as setThrowValueSumTeams,
   setCurrentPlayerThrows as setCurrentPlayerThrowsTeams,
   setCurrentPlayerThrowsCount as setCurrentPlayerThrowsCountTeams,
} from '@/redux/slices/gameRegularTeamsSlice'
import { Player, HistoryEntry, Team, HistoryEntryTeams } from '@/types/types'

//UNDO HANDLER FOR GAME REGULAR
export const handleUndoRegular = (
   players: Player[],
   currentPlayerIndex: number,
   history: HistoryEntry[],
   showNumberButtons: boolean,
   throwValueSum: number,
   currentPlayerThrows: number[],
   currentPlayerThrowsCount: number,
   gameMode: number | string,
   dispatch: AppDispatch
) => {
   const lastEntry = history[history.length - 1]
   const gamePlayers = JSON.parse(JSON.stringify(players))

   //Scenario when players have just finished previous leg
   if (
      history.length !== 0 &&
    lastEntry.historyTotalThrows === Number(gameMode)
   ) {
      const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

      currentPlayer.legs -= 1

      //Updating game stats for each player
      gamePlayers.forEach((player: Player, index: number) => {
         const playerHistory = [...history]
            .reverse()
            .find((entry) => entry.historyPlayerIndex === index)
         if (playerHistory) {
            player.pointsLeft = playerHistory.historyPointsLeft
            player.lastScore = playerHistory.historyLastScore
            player.totalThrows =
          playerHistory.historyTotalThrows === Number(gameMode)
             ? playerHistory.historyTotalThrows - playerHistory.historyLastScore
             : playerHistory.historyTotalThrows
            player.totalAttempts = playerHistory.historyTotalAttempts
            player.average = playerHistory.historyLastAverage
         }
      })

      //Setting currentPlayerIndex to the last player who played in the history
      dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))

      //Removing last history entries (inlcuding additional entries created when player finished leg)
      dispatch(setHistory(history.slice(0, history.length - gamePlayers.length)))

      //Updating players state
      dispatch(setPlayers(gamePlayers))

      return
   }

   //Undo handler for input
   if (!showNumberButtons) {
      if (history.length === 0) return

      const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

      //Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
      currentPlayer.totalThrows -= currentPlayer.lastScore
      currentPlayer.pointsLeft = lastEntry.historyPointsLeft
      currentPlayer.lastScore = lastEntry.historyLastScore
      currentPlayer.average = lastEntry.historyLastAverage
      currentPlayer.totalAttempts = lastEntry.historyTotalAttempts

      //Setting currentPlayerIndex to the last player who played in the history
      dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))

      //Removing last history entry
      dispatch(setHistory(history.slice(0, -1)))
   }

   //Undo handler for buttons
   if (showNumberButtons) {
      //SCENARIO 1: Empty history, currentPlayerThrowCount !== 0
      if (history.length === 0 && currentPlayerThrowsCount !== 0) {
         const currentPlayer = gamePlayers[currentPlayerIndex]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentPlayer.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentPlayer.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum =
        throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
         dispatch(setThrowValueSum(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrows(updatedThrows))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      }
      //SCENARIO 2: Empty history
      else if (history.length === 0) {
         return
      }
      //SCENARIO 3: History available and no currentPlayerThrowsCount
      else if (history.length !== 0 && currentPlayerThrowsCount === 0) {
         const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

         //Restoring pointsLeft, lastScore, average
         currentPlayer.pointsLeft = lastEntry.historyPointsLeft
         currentPlayer.lastScore = lastEntry.historyLastScore
         currentPlayer.average = lastEntry.historyLastAverage
         currentPlayer.totalThrows = lastEntry.historyTotalThrows
         currentPlayer.totalAttempts = lastEntry.historyTotalAttempts

         //Removing last history entry
         dispatch(setHistory(history.slice(0, -1)))

         //Setting currentPlayerIndex to the last player who played in the history
         dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
      }
      //SCENARIO 4: History availble and currentPlayer has already thrown at least once
      else {
         const currentPlayer = gamePlayers[currentPlayerIndex]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentPlayer.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentPlayer.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum =
        throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
         dispatch(setThrowValueSum(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrows(updatedThrows))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      }
   }

   //Updating players state
   dispatch(setPlayers(gamePlayers))
}

//UNDO HANDLER FOR GAME REGULAR TEAMS:
export const handleUndoRegularTeams = (
   teams: Team[],
   currentTeamIndex: number,
   history: HistoryEntryTeams[],
   showNumberButtons: boolean,
   throwValueSum: number,
   currentPlayerThrows: number[],
   currentPlayerThrowsCount: number,
   gameMode: number | string,
   dispatch: AppDispatch
) => {
   const lastEntry = history[history.length - 1]
   const gameTeams = JSON.parse(JSON.stringify(teams))

   //Scenario when players have just finished previous leg
   if (
      history.length !== 0 &&
    lastEntry.historyTotalThrows === Number(gameMode)
   ) {
      const currentTeam = gameTeams[lastEntry.historyTeamIndex]

      currentTeam.legs -= 1

      //Updating game stats for each team
      gameTeams.forEach((team: Team, index: number) => {
         const teamHistory = [...history]
            .reverse()
            .find((entry) => entry.historyTeamIndex === index)
         if (teamHistory) {
            team.pointsLeft = teamHistory.historyPointsLeft
            team.lastScore = teamHistory.historyLastScore
            team.totalThrows =
          teamHistory.historyTotalThrows === Number(gameMode)
             ? teamHistory.historyTotalThrows - teamHistory.historyLastScore
             : teamHistory.historyTotalThrows
            team.totalAttempts = teamHistory.historyTotalAttempts
            team.average = teamHistory.historyLastAverage
         }
      })

      //Setting currentTeamIndex to the last player who played in the history
      dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))

      //Removing last history entries (inlcuding additional entries created when team finished leg)
      dispatch(
         setHistoryTeams(history.slice(0, history.length - gameTeams.length))
      )

      //Updating players state
      dispatch(setTeams(gameTeams))

      return
   }

   //Undo handler for input
   if (!showNumberButtons) {
      if (history.length === 0) return

      const currentTeam = gameTeams[lastEntry.historyTeamIndex]

      //Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
      currentTeam.totalThrows -= currentTeam.lastScore
      currentTeam.pointsLeft = lastEntry.historyPointsLeft
      currentTeam.lastScore = lastEntry.historyLastScore
      currentTeam.average = lastEntry.historyLastAverage
      currentTeam.totalAttempts = lastEntry.historyTotalAttempts

      //Setting currentTeamIndex and currentPlayerIndexInTeam to the last team/player who played in the history
      dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
      dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))

      //Removing last history entry
      dispatch(setHistoryTeams(history.slice(0, -1)))
   }

   //Undo handler for buttons
   if (showNumberButtons) {
      //SCENARIO 1: Empty history, currentPlayerThrowCount !== 0
      if (history.length === 0 && currentPlayerThrowsCount !== 0) {
         const currentTeam = gameTeams[currentTeamIndex]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentTeam.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentTeam.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum =
        throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
         dispatch(setThrowValueSumTeams(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrowsTeams(updatedThrows))
         dispatch(setCurrentPlayerThrowsCountTeams(updatedThrowCount))
      }
      //SCENARIO 2: Empty history
      else if (history.length === 0) {
         return
      }
      //SCENARIO 3: History available and no currentPlayerThrowsCount
      else if (history.length !== 0 && currentPlayerThrowsCount === 0) {
         const currentTeam = gameTeams[lastEntry.historyTeamIndex]

         //Restoring pointsLeft, lastScore, average
         currentTeam.pointsLeft = lastEntry.historyPointsLeft
         currentTeam.lastScore = lastEntry.historyLastScore
         currentTeam.average = lastEntry.historyLastAverage
         currentTeam.totalThrows = lastEntry.historyTotalThrows
         currentTeam.totalAttempts = lastEntry.historyTotalAttempts

         //Removing last history entry
         dispatch(setHistoryTeams(history.slice(0, -1)))

         //Setting currentTeamIndex and currentPlayerIndexInTeam to the last team/player who played in the history
         dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
         dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))
      }
      //SCENARIO 4: History availble and currentPlayer has already thrown at least once
      else {
         const currentTeam = gameTeams[currentTeamIndex]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentTeam.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentTeam.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum =
        throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
         dispatch(setThrowValueSumTeams(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrowsTeams(updatedThrows))
         dispatch(setCurrentPlayerThrowsCountTeams(updatedThrowCount))
      }
   }

   //Updating players state
   dispatch(setTeams(gameTeams))
}
