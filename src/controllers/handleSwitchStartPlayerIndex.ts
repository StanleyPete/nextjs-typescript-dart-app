import { AppDispatch } from '@/redux/store'
import { setStartPlayerIndex } from '@/redux/slices/gameRegularSlice'
import { Player } from '@/types/types'

/* Switch to another player who starts the leg: 
       Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
       after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
*/

export const handleSwitchStartPlayerIndex = (
   startPlayerIndex: number,
   players: Player[],
   dispatch: AppDispatch
) => {
   const nextPlayerIndex = (startPlayerIndex + 1) % players.length
   dispatch(setStartPlayerIndex(nextPlayerIndex))
}
