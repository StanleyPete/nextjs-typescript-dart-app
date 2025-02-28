//Redux
import { AppDispatch } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'
import { SocketState } from '@/types/redux/socketTypes'

/* USED IN: 
      ThrowValueSection component when showNumberButtons === false, 
      Handles BUTTONS from 0 - 9
*/

export const handleSubmitThrowKeyboardButtonsOnline = (
   currentThrow: GameOnlineStates['currentThrow'],
   inputMultiplier: number,
   dispatch: AppDispatch,
   socket: SocketState['socket'],
   gameId: SocketState['gameId']
) => {
   // ERROR (currentThrow over 180)
   if (currentThrow > 180) {
      dispatch(setError({isError: true, errorMessage: 'Score higher than 180 is not possible', }))
      dispatch(setCurrentThrow(0))
      return
   }

   //ERROR (invalid scores)
   const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
   if (invalidScores.includes(currentThrow)) {
      dispatch(setError({ isError: true, errorMessage: `${currentThrow} is not possible`}))
      dispatch(setCurrentThrow(0))
      return
   }

   const playerThrow = currentThrow * inputMultiplier
  
   socket?.emit('submit-score', {
      gameId: gameId,
      score: playerThrow
   })
   
   dispatch(setCurrentThrow(0))
   return
}
