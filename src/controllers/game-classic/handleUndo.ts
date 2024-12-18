//Redux
import { AppDispatch } from '@/redux/store'
import {
   setThrowValueSum,
   setCurrentPlayerThrows,
   setCurrentPlayerThrowsCount,
} from '@/redux/slices/game-classic/gameClassicSlice'
import {
   setPlayers,
   setCurrentPlayerIndex,
   setHistoryClassicSingle,
} from '@/redux/slices/game-classic/gameClassicSingleSlice'
import {
   setTeams,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryClassicTeams,
} from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { 
   GameClassicStates, 
   GameClassicSingleStates, 
   GameClassicTeamsStates, 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/redux/gameClassicTypes'

/* 
   USED IN: 
      KeyboardButtons component,
      NumberButtons component,
      GameEndPopUp component    
*/

export const handleUndo = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerClassic[] | TeamClassic[],
   index: GameClassicSingleStates['currentPlayerIndex'] | GameClassicTeamsStates['currentTeamIndex'],
   history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
   showNumberButtons: GameClassicStates['showNumberButtons'],
   throwValueSum: GameClassicStates['throwValueSum'],
   currentPlayerThrows: GameClassicStates['currentPlayerThrows'],
   currentPlayerThrowsCount: GameClassicStates['currentPlayerThrowsCount'],
   gameMode: GameSettingsStates['gameMode'],
   dispatch: AppDispatch
) => {
   const lastEntry = history[history.length - 1]
   if (!lastEntry) return
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = 'historyPlayerIndex' in lastEntry
      ? gamePlayersOrTeams[lastEntry.historyPlayerIndex]
      : gamePlayersOrTeams[lastEntry.historyTeamIndex]

   //SCENARIO WHEN PLAYER OR TEAM HAS JUST FINISHED THE LEG
   if (
      history.length !== 0 &&
    lastEntry.historyTotalThrows === Number(gameMode)
   ) {
      currentPlayerOrTeam.legs -= 1

      //Updating game stats for each player or team
      gamePlayersOrTeams.forEach(
         (playerOrTeam: PlayerClassic | TeamClassic, index: number) => {
            const playerOrTeamHistory = [...history].reverse().find((entry) => {
               if ('historyPlayerIndex' in entry) {
                  return entry.historyPlayerIndex === index
               } else {
                  return entry.historyTeamIndex === index
               }
            })
            if (playerOrTeamHistory) {
               playerOrTeam.pointsLeft = playerOrTeamHistory.historyPointsLeft
               playerOrTeam.lastScore = playerOrTeamHistory.historyLastScore
               playerOrTeam.totalThrows = playerOrTeamHistory.historyTotalThrows === Number(gameMode)
                  ? playerOrTeamHistory.historyTotalThrows - playerOrTeamHistory.historyLastScore
                  : playerOrTeamHistory.historyTotalThrows
               playerOrTeam.totalAttempts = playerOrTeamHistory.historyTotalAttempts
               playerOrTeam.average = playerOrTeamHistory.historyLastAverage
            }
         }
      )

      //Removing last history entries (including additional entries created when player or team finished the leg + updating current player or team index and players or teams states
      if (gameType === 'single' && 'historyPlayerIndex' in lastEntry) {
         dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
         dispatch(setHistoryClassicSingle(history.slice(0, history.length - gamePlayersOrTeams.length) as HistoryEntryClassicSingle[]))
         dispatch(setPlayers(gamePlayersOrTeams))
         return
      } else if (gameType === 'teams' && 'historyTeamIndex' in lastEntry) {
         dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
         dispatch(setHistoryClassicTeams(history.slice(0, history.length - gamePlayersOrTeams.length) as HistoryEntryClassicTeams[]))
         dispatch(setTeams(gamePlayersOrTeams))
         return
      }
   }

   //UNDO HANDLER FOR KEYBOARD BUTTONS:
   if (!showNumberButtons) {
      //Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
      currentPlayerOrTeam.totalThrows -= currentPlayerOrTeam.lastScore
      currentPlayerOrTeam.pointsLeft = lastEntry.historyPointsLeft
      currentPlayerOrTeam.lastScore = lastEntry.historyLastScore
      currentPlayerOrTeam.average = lastEntry.historyLastAverage
      currentPlayerOrTeam.totalAttempts = lastEntry.historyTotalAttempts

      //Setting current player or team index and removing last history entry
      if (gameType === 'single' && 'historyPlayerIndex' in lastEntry) {
         dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
         dispatch(setHistoryClassicSingle(history.slice(0, -1) as HistoryEntryClassicSingle[]))
      } else if (gameType === 'teams' && 'historyTeamIndex' in lastEntry) {
         dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
         dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))
         dispatch(setHistoryClassicTeams(history.slice(0, -1) as HistoryEntryClassicTeams[]))
      }
   }

   //UNDO HANDLER FOR NUMBER BUTTONS
   if (showNumberButtons) {
      //SCENARIO 1: Empty history, currentPlayerThrowCount !== 0
      if (history.length === 0 && currentPlayerThrowsCount !== 0) {
         const currentPlayerOrTeam = gamePlayersOrTeams[index]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentPlayerOrTeam.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentPlayerOrTeam.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]

         dispatch(setThrowValueSum(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrows(updatedThrows))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      }

      //SCENARIO 2: History available and no currentPlayerThrowsCount
      else if (history.length !== 0 && currentPlayerThrowsCount === 0) {
      //Restoring pointsLeft, lastScore, average
         currentPlayerOrTeam.pointsLeft = lastEntry.historyPointsLeft
         currentPlayerOrTeam.lastScore = lastEntry.historyLastScore
         currentPlayerOrTeam.average = lastEntry.historyLastAverage
         currentPlayerOrTeam.totalThrows = lastEntry.historyTotalThrows - currentPlayerOrTeam.totalThrows
         currentPlayerOrTeam.totalAttempts = lastEntry.historyTotalAttempts

         //Setting current player or team index and removing last history entry
         if (gameType === 'single' && 'historyPlayerIndex' in lastEntry) {
            dispatch(setHistoryClassicSingle(history.slice(0, -1) as HistoryEntryClassicSingle[]))
            dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
         } else if (gameType === 'teams' && 'historyTeamIndex' in lastEntry) {
            dispatch(setHistoryClassicTeams(history.slice(0, -1) as HistoryEntryClassicTeams[]))
            dispatch(setCurrentTeamIndex(lastEntry.historyTeamIndex))
            dispatch(setCurrentPlayerIndexInTeam(lastEntry.historyPlayerIndexInTeam))
         }
      }
      //SCENARIO 3: History availble and currentPlayer has already thrown at least once
      else {
         const currentPlayer = gamePlayersOrTeams[index]

         //Temporary variables with updated throw count and throws array
         const updatedThrowCount = currentPlayerThrowsCount - 1
         const updatedThrows = [...currentPlayerThrows]

         //Updating pointsLeft, totalThrows and throwValueSum
         currentPlayer.pointsLeft += updatedThrows[updatedThrows.length - 1]
         currentPlayer.totalThrows -= updatedThrows[updatedThrows.length - 1]
         const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]

         dispatch(setThrowValueSum(updatedThrowValueSum))

         //Removing last available throw from temporary variable
         updatedThrows.pop()

         //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
         dispatch(setCurrentPlayerThrows(updatedThrows))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
      }
   }

   //Updating players state
   dispatch(
      gameType === 'single'
         ? setPlayers(gamePlayersOrTeams)
         : setTeams(gamePlayersOrTeams)
   )
}
