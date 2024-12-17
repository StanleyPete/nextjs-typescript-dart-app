//Redux
import { AppDispatch } from '@/redux/store'
import {
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows
} from '@/redux/slices/game-classic/gameClassicSlice'
import { setPlayers, setHistoryClassicSingle } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { setTeams, setHistoryClassicTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Controllers
import { handleSwitchPlayerOrTeam } from '@/controllers/handleSwitchPlayerOrTeam'
import { playSound } from '@/controllers/playSound'
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
      ThrowValueSection component
     
   SUBMIT THROW HANDLER FOR SUBMIT SCORE BUTTON:
      Created for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to enter 0 values in the input field or click on button with 0 value
*/

export const handleSubmitThrowSubmitScoreButton = (
   gameType: GameSettingsStates['gameType'],
   playersOrTeams: PlayerClassic[] | TeamClassic[],
   index: GameClassicSingleStates['currentPlayerIndex'],
   currentPlayerIndexInTeam: GameClassicTeamsStates['currentPlayerIndexInTeam'],
   currentPlayerThrows: GameClassicStates['currentPlayerThrows'],
   history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
   isSoundEnabled: GameClassicStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]

   const throwSum = currentPlayerThrows.reduce(
      (acc: number, throwValue: number) => acc + throwValue,
      0
   )

   //CREATING HISTORY BASED ON CURRENT VALUES (BEFORE UPDATING STATS )
   let newHistoryEntry: HistoryEntryClassicSingle | HistoryEntryClassicTeams
   switch (gameType) {
   case 'single':
      newHistoryEntry = {
         historyPlayerIndex: index,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft + throwSum,
         historyTotalThrows: currentPlayerOrTeam.totalThrows,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   case 'teams':
      newHistoryEntry = {
         historyTeamIndex: index,
         historyPlayerIndexInTeam: currentPlayerIndexInTeam,
         historyPointsLeft: currentPlayerOrTeam.pointsLeft + throwSum,
         historyTotalThrows: currentPlayerOrTeam.totalThrows,
         historyLastScore: currentPlayerOrTeam.lastScore,
         historyLastAverage: currentPlayerOrTeam.average,
         historyTotalAttempts: currentPlayerOrTeam.totalAttempts,
      }
      break
   default:
      throw new Error('Invalid gameType')
   }

   //Updating lastScore, totalAttempts and average calculation
   currentPlayerOrTeam.lastScore = throwSum
   currentPlayerOrTeam.totalAttempts += 1
   currentPlayerOrTeam.average =
    currentPlayerOrTeam.totalThrows / currentPlayerOrTeam.totalAttempts

   //Updating history state
   if (gameType === 'single') {
      dispatch(
         setHistoryClassicSingle([
            ...(history as HistoryEntryClassicSingle[]),
        newHistoryEntry as HistoryEntryClassicSingle,
         ])
      )
   } else {
      dispatch(
         setHistoryClassicTeams([
            ...(history as HistoryEntryClassicTeams[]),
        newHistoryEntry as HistoryEntryClassicTeams,
         ])
      )
   }

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
   handleSwitchPlayerOrTeam(
      gameType,
      index,
      currentPlayerIndexInTeam,
      playersOrTeams,
      dispatch
   )

   //Updating player's state
   if (gameType === 'single') {
      dispatch(setPlayers(gamePlayersOrTeams))
   } else {
      dispatch(setTeams(gamePlayersOrTeams))
   }
}
