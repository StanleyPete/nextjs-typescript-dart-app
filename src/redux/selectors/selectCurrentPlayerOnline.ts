import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'


const selectPlayers = (state: RootState) => state.gameOnline.players
const selectCurrentPlayerIndex = (state: RootState) => state.gameOnline.currentPlayerIndex

export const selectCurrentPlayer = createSelector(
   [selectPlayers, selectCurrentPlayerIndex],
   (players, currentPlayerIndex) => players[currentPlayerIndex]
)
