import { AppDispatch } from '@/redux/store'
import { setCurrentPlayerIndex } from '@/redux/slices/gameRegularSlice'
import { Player } from '@/types/types'

/* Switch to another player: 
       Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
       after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchPlayer = (
   currentPlayerIndex: number,
   players: Player[],
   dispatch: AppDispatch
) => {
   const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
   dispatch(setCurrentPlayerIndex(nextPlayerIndex))
}
