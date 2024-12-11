import { handleSwitchPlayer, handleSwitchTeam } from '@/controllers/handleSwitchPlayerOrTeam'
import { handleSwitchStartPlayerIndex, handleSwitchStartTeamIndex } from '@/controllers/handleSwitchStartPlayerOrTeamIndex'
import { checkGameEndHandlerRegular, checkGameEndHandlerTeams } from '@/controllers/checkGameEndHandler'
import { playSound } from '@/controllers/playSound'
import { setError } from '@/redux/slices/gameSettingsSlice'
import {
   setPlayers,
   setCurrentPlayerIndex,
   setHistory,
   setCurrentThrow,
   setIsDoubleActive,
} from '@/redux/slices/gameRegularSlice'
import {
   setTeams,
   setCurrentTeamIndex,
   setHistory as setHistoryTeams,
   setCurrentThrow as setCurrentThrowTeams,
   setIsDoubleActive as setIsDoubleActiveTeams,
} from '@/redux/slices/gameRegularTeamsSlice'
import { AppDispatch } from '@/redux/store'
import { Player, HistoryEntry, Team, HistoryEntryTeams } from '@/types/types'

export const handleSubmitThrowKeyboardButtonsRegular = (
   players: Player[],
   currentPlayerIndex: number,
   startPlayerIndex: number,
   history: HistoryEntry[],
   currentThrow: number,
   inputMultiplier: number,
   gameMode: string | number,
   numberOfLegs: number,
   gameWin: string,
   isSoundEnabled: boolean,
   isDoubleActive: boolean,
   dispatch: AppDispatch
) => {
   const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = gamePlayers[currentPlayerIndex]

   //Error hanlder (currentThrow over 180)
   if (currentThrow > 180) {
      dispatch(
         setError({
            isError: true,
            errorMessage: 'Score higher than 180 is not possible',
         })
      )
      dispatch(setCurrentThrow(0))
      return
   }

   if (invalidScores.includes(currentThrow)) {
      dispatch(
         setError({
            isError: true,
            errorMessage: `${currentThrow} is not possible`,
         })
      )
      dispatch(setCurrentThrow(0))
      return
   }

   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntry = {
      historyPlayerIndex: currentPlayerIndex,
      historyPointsLeft: currentPlayer.pointsLeft,
      historyTotalThrows:
      currentPlayer.totalThrows + currentThrow * inputMultiplier,
      historyLastScore: currentPlayer.lastScore,
      historyLastAverage: currentPlayer.average,
      historyTotalAttempts: currentPlayer.totalAttempts,
   }

   //Updating pointsLeft
   currentPlayer.pointsLeft -= currentThrow * inputMultiplier

   //End leg scenario
   if (isDoubleActive && currentPlayer.pointsLeft === 0) {
      // Additional history entries created if leg ends in order to properly Undo handler usage
      const newHistoryEntries = gamePlayers
         .map((player: Player, index: number) => {
            if (index === currentPlayerIndex) {
               return null //NewHistoryEntry not created for currentPlayerIndex!
            }
            return {
               historyPlayerIndex: index,
               historyPointsLeft: player.pointsLeft,
               historyTotalThrows: player.totalThrows,
               historyLastScore: player.lastScore,
               historyLastAverage: player.average,
               historyTotalAttempts: player.totalAttempts,
            }
         })
         .filter((entry: HistoryEntry | null) => entry !== null) //Skipping currentPlayerIndex (null)

      //Updating legs for current player
      currentPlayer.legs += 1

      //Updating game stats for new leg (for each player)
      gamePlayers.forEach((player: Player) => {
         player.pointsLeft = Number(gameMode)
         player.lastScore = 0
         player.totalThrows = 0
         player.totalAttempts = 0
         player.average = 0
         player.isInputPreffered = true
      })

      //Updating history state with currentPlayerIndex
      dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

      //Upadating player's state
      dispatch(setPlayers(gamePlayers))

      //Switching to next player who start the leg
      handleSwitchStartPlayerIndex(startPlayerIndex, players, dispatch)

      //Setting current player index:
      dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

      //End game check
      checkGameEndHandlerRegular(
         gamePlayers,
         gameWin,
         numberOfLegs,
         isSoundEnabled,
         dispatch
      )

      //Resetting isDoubleActive state
      dispatch(setIsDoubleActive(false))

      //Resetting input value
      dispatch(setCurrentThrow(0))

      return
   }

   //Scenario when updated pointsLeft are equal or less than 1
   if (currentPlayer.pointsLeft <= 1) {
      //Updating historyTotalThrows
      newHistoryEntry.historyTotalThrows = currentPlayer.totalThrows

      //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
      currentPlayer.pointsLeft += currentThrow * inputMultiplier
      currentPlayer.lastScore = 0
      currentPlayer.totalThrows += 0
      currentPlayer.totalAttempts += 1
      currentPlayer.average =
      currentPlayer.totalThrows / currentPlayer.totalAttempts

      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))

      //Upadating player's state
      dispatch(setPlayers(gamePlayers))

      //Sound effect
      playSound('no-score', isSoundEnabled)

      //Switching to the next player
      handleSwitchPlayer(currentPlayerIndex, players, dispatch)

      //Resetting input value
      dispatch(setCurrentThrow(0))

      return
   }

   //Updating lastScore, totalThrows, totalAttempts, average
   currentPlayer.lastScore = currentThrow * inputMultiplier
   currentPlayer.totalThrows += currentThrow * inputMultiplier
   currentPlayer.totalAttempts += 1
   currentPlayer.isInputPreffered = true
   currentPlayer.average =
    currentPlayer.totalThrows / currentPlayer.totalAttempts

   //Updating history state
   dispatch(setHistory([...history, newHistoryEntry]))

   //Upadating player's state
   dispatch(setPlayers(gamePlayers))

   //Sound effect
   if (currentThrow === 0) {
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(currentThrow.toString(), isSoundEnabled)
   }

   //Switching to the next player
   handleSwitchPlayer(currentPlayerIndex, players, dispatch)

   //Resetting input value
   dispatch(setCurrentThrow(0))
}

//SUBMIT SCORE HANDLER FOR TEAMS
export const handleSubmitThrowKeyboardButtonsTeams = (
   teams: Team[],
   currentTeamIndex: number,
   currentPlayerIndexInTeam: number,
   startTeamIndex: number,
   history: HistoryEntryTeams[],
   currentThrow: number,
   inputMultiplier: number,
   gameMode: string | number,
   numberOfLegs: number,
   gameWin: string,
   isSoundEnabled: boolean,
   isDoubleActive: boolean,
   dispatch: AppDispatch
) => {
   const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
   const gameTeams = JSON.parse(JSON.stringify(teams))
   const currentTeam = gameTeams[currentTeamIndex]

   //Error hanlder (currentThrow over 180)
   if (currentThrow > 180) {
      dispatch(
         setError({
            isError: true,
            errorMessage: 'Score higher than 180 is not possible',
         })
      )
      dispatch(setCurrentThrowTeams(0))
      return
   }

   if (invalidScores.includes(currentThrow)) {
      dispatch(
         setError({
            isError: true,
            errorMessage: `${currentThrow} is not possible`,
         })
      )
      dispatch(setCurrentThrowTeams(0))
      return
   }

   //Creating newHistoryEntry
   const newHistoryEntry: HistoryEntryTeams = {
      historyTeamIndex: currentTeamIndex,
      historyPlayerIndexInTeam: currentPlayerIndexInTeam,
      historyPointsLeft: currentTeam.pointsLeft,
      historyTotalThrows:
      currentTeam.totalThrows + currentThrow * inputMultiplier,
      historyLastScore: currentTeam.lastScore,
      historyLastAverage: currentTeam.average,
      historyTotalAttempts: currentTeam.totalAttempts,
   }

   //Updating pointsLeft
   currentTeam.pointsLeft -= currentThrow * inputMultiplier

   //End leg scenario
   if (isDoubleActive && currentTeam.pointsLeft === 0) {
      // Additional history entries created if leg ends in order to properly use Undo handler
      const newHistoryEntries = gameTeams
         .map((team: Team, index: number) => {
            if (index === currentTeamIndex) {
               return null //NewHistoryEntry not created for currentTeamIndex!
            }
            return {
               historyTeamIndex: index,
               historyPlayerIndexInTeam: 
                  currentPlayerIndexInTeam - 1 === -1
                     ? 1
                     : currentPlayerIndexInTeam - 1,
               historyPointsLeft: team.pointsLeft,
               historyTotalThrows: team.totalThrows,
               historyLastScore: team.lastScore,
               historyLastAverage: team.average,
               historyTotalAttempts: team.totalAttempts,
            }
         })
         .filter((entry: HistoryEntryTeams | null) => entry !== null) //Skipping currentTeamIndex (null)

      //Updating legs for current team
      currentTeam.legs += 1

      //Updating game stats for new leg (for each team)
      gameTeams.forEach((team: Team) => {
         team.pointsLeft = Number(gameMode)
         team.lastScore = 0
         team.totalThrows = 0
         team.totalAttempts = 0
         team.average = 0
         team.isInputPreffered = true
      })

      //Updating history state with currentTeamIndex
      dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

      //Upadating team's state
      dispatch(setTeams(gameTeams))

      //Switching to the next team which starts the leg
      handleSwitchStartTeamIndex(startTeamIndex, teams, dispatch)

      //Setting current player index:
      dispatch(setCurrentTeamIndex((startTeamIndex + 1) % teams.length))

      //End game check
      checkGameEndHandlerTeams(gameTeams, gameWin, numberOfLegs, isSoundEnabled, dispatch)

      //Resetting isDoubleActive state
      dispatch(setIsDoubleActiveTeams(false))

      //Resetting input value
      dispatch(setCurrentThrowTeams(0))

      return
   }

   //Scenario when updated pointsLeft are equal or less than 1
   if (currentTeam.pointsLeft <= 1) {
      //Updating historyTotalThrows
      newHistoryEntry.historyTotalThrows = currentTeam.totalThrows

      //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
      currentTeam.pointsLeft += currentThrow * inputMultiplier
      currentTeam.lastScore = 0
      currentTeam.totalThrows += 0
      currentTeam.totalAttempts += 1
      currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

      //Updating history state
      dispatch(setHistoryTeams([...history, newHistoryEntry]))

      //Upadating team's state
      dispatch(setTeams(gameTeams))

      //Sound effect
      playSound('no-score', isSoundEnabled)

      //Switching to the next player
      handleSwitchTeam(currentTeamIndex, currentPlayerIndexInTeam, teams, dispatch)

      //Resetting input value
      dispatch(setCurrentThrowTeams(0))

      return
   }

   //Updating lastScore, totalThrows, totalAttempts, average
   currentTeam.lastScore = currentThrow * inputMultiplier
   currentTeam.totalThrows += currentThrow * inputMultiplier
   currentTeam.totalAttempts += 1
   currentTeam.isInputPreffered = true
   currentTeam.average = currentTeam.totalThrows / currentTeam.totalAttempts

   //Updating history state
   dispatch(setHistoryTeams([...history, newHistoryEntry]))

   //Upadating teams's state
   dispatch(setTeams(gameTeams))

   //Sound effect
   if (currentThrow === 0) {
      playSound('no-score', isSoundEnabled)
   } else {
      playSound(currentThrow.toString(), isSoundEnabled)
   }

   //Switching to the next team
   handleSwitchTeam(currentTeamIndex, currentPlayerIndexInTeam, teams, dispatch)

   //Resetting input value
   dispatch(setCurrentThrowTeams(0))
}
