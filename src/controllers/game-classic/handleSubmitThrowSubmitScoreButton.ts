//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/gameSlice'
import { setCurrentThrow, setThrowValueSum } from '@/redux/slices/game-classic/gameClassicSlice'
import { setPlayers, setHistoryClassicSingle } from '@/redux/slices/game-classic/gameClassicSingleSlice'
import { setTeams, setHistoryClassicTeams } from '@/redux/slices/game-classic/gameClassicTeamsSlice'
//Controllers
import { handleSwitchPlayerOrTeamClassic } from '@/controllers/game-classic/handleSwitchPlayerOrTeamClassic'
import { playSound } from '@/controllers/playSound'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GameStates } from '@/types/redux/gameTypes'
import {
   GameClassicSingleStates,
   GameClassicTeamsStates,
   PlayerClassic,
   TeamClassic,
   HistoryEntryClassicSingle,
   HistoryEntryClassicTeams,
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
   currentPlayerThrows: GameStates['currentPlayerThrows'],
   history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
   isSoundEnabled: GameStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   const gamePlayersOrTeams = JSON.parse(JSON.stringify(playersOrTeams))
   const currentPlayerOrTeam = gamePlayersOrTeams[index]

   const throwSum = (currentPlayerThrows as number[]).reduce(
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
   dispatch(
      gameType === 'single'
         ? setHistoryClassicSingle([
            ...(history as HistoryEntryClassicSingle[]),
          newHistoryEntry as HistoryEntryClassicSingle,
         ])
         : setHistoryClassicTeams([
            ...(history as HistoryEntryClassicTeams[]),
          newHistoryEntry as HistoryEntryClassicTeams,
         ])
   )

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
   handleSwitchPlayerOrTeamClassic(
      gameType,
      index,
      currentPlayerIndexInTeam,
      playersOrTeams,
      dispatch
   )

   //Updating player's state
   dispatch(
      gameType === 'single'
         ? setPlayers(gamePlayersOrTeams)
         : setTeams(gamePlayersOrTeams)
   )
}
