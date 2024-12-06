import { handleSwitchPlayer } from '@/controllers/handleSwitchPlayer'
import { playSound } from '@/controllers/playSound'
import { AppDispatch } from '@/redux/store'
import { Player, HistoryEntry } from '@/types/types'
import {
   setPlayers,
   setHistory,
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
} from '@/redux/slices/gameRegularSlice'

/*  
    SUBMIT THROW HANDLER FOR SUBMIT SCORE BUTTON:
    Created for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value
*/
export const handleSubmitThrowSubmitScoreButton = (
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
