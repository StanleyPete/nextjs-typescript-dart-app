//Redux
import { AppDispatch } from '@/redux/store'
import { setPlayers, setCurrentThrow, setThrowValueSum, setCurrentPlayerThrowsCount, setCurrentPlayerThrows } from '@/redux/slices/game-online/gameOnlineSlice'
import { playSound } from '@/controllers/playSound'
import { GameOnlineStates, PlayerOnline } from '@/types/redux/gameOnlineTypes'

/*  
   USED IN: 
      ThrowValueSection component
     
   SUBMIT THROW HANDLER FOR SUBMIT SCORE BUTTON:
      Created for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to enter 0 values in the input field or click on button with 0 value
*/

export const handleSubmitThrowSubmitScoreButtonOnline = (
   players: PlayerOnline[],
   index: GameOnlineStates['currentPlayerIndex'],
   currentPlayerThrows: GameOnlineStates['currentPlayerThrows'],
   isSoundEnabled: GameOnlineStates['isSoundEnabled'],
   dispatch: AppDispatch
) => {
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = gamePlayers[index]

   const throwSum = (currentPlayerThrows as number[]).reduce(
      (acc: number, throwValue: number) => acc + throwValue,
      0
   )

   //Updating lastScore, totalAttempts and average calculation
   currentPlayer.lastScore = throwSum
   currentPlayer.attempts += 1
   currentPlayer.average =
   currentPlayer.totalThrows / currentPlayer.totalAttempts

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

   //Updating player's state
   dispatch(setPlayers(gamePlayers))
}
