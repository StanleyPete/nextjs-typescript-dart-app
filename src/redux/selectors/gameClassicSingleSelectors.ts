import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const playersState = (state: RootState) => state.gameClassicSingle.players
const historyClassicSingleState = (state: RootState) => state.gameClassicSingle.historyClassicSingle
const currentPlayerIndexState = (state: RootState) => state.gameClassicSingle.currentPlayerIndex

export const selectPlayers = createSelector([playersState], (players) => players)
export const selectHistoryClassicSingle = createSelector([historyClassicSingleState], (historyClassicSingle) => historyClassicSingle)
export const selectCurrentPlayerIndex = createSelector([currentPlayerIndexState], (currentPlayerIndex) => currentPlayerIndex)
