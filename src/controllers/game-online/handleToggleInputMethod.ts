//Redux
import { AppDispatch } from '@/redux/store'

import { setThrowValueSum, setCurrentPlayerThrowsCount, setCurrentPlayerThrows, setShowNumberButtons } from '@/redux/slices/game-online/gameOnlineSlice'
import { setPlayers } from '@/redux/slices/game-online/gameOnlineSlice'



import { GameOnlineStates, PlayerOnline } from '@/types/redux/gameOnlineTypes'


/* USED IN: ThrowValueSectionOnline component */

export const handleToggleInputMethodOnline = (
   players: PlayerOnline[],
   index: GameOnlineStates['currentPlayerIndex'],
   currentPlayerThrowsCount: GameOnlineStates['currentPlayerThrowsCount'],
   throwValueSum: GameOnlineStates['throwValueSum'],
   showNumberButtons: GameOnlineStates['showNumberButtons'],
   dispatch: AppDispatch
) => {
   //Resetting values when toggle button clicked
   const gamePlayers = JSON.parse(JSON.stringify(players))
   const currentPlayer = gamePlayers[index]
   if (currentPlayerThrowsCount > 0) {
      //Resetting pointsLeft and totalThrows values
      currentPlayer.pointsLeft += throwValueSum
      currentPlayer.totalThrows -= throwValueSum

      //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
   }

   //Switching showNumberButtons
   dispatch(setShowNumberButtons(!showNumberButtons))

   //Updating player's state
   dispatch(setPlayers(gamePlayers))
   
}
