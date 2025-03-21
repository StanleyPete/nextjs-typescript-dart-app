import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const startIndexState = (state: RootState) => state.game.startIndex
const currentPlayerThrowsCountState = (state: RootState) => state.game.currentPlayerThrowsCount
const currentPlayerThrowsState = (state: RootState) => state.game.currentPlayerThrows
const isGameEndState = (state: RootState) => state.game.isGameEnd
const winnerState = (state: RootState) => state.game.winner
const isSoundEnabledState = (state: RootState) => state.game.isSoundEnabled
const initialSoundPlayedState = (state: RootState) => state.game.initialSoundPlayed

export const selectStartIndex = createSelector([startIndexState], (startIndex) => startIndex)
export const selectCurrentPlayerThrowsCount = createSelector([currentPlayerThrowsCountState], (currentPlayerThrowsCount) => currentPlayerThrowsCount)
export const selectCurrentPlayerThrows = createSelector([currentPlayerThrowsState], (currentPlayerThrows) => currentPlayerThrows)
export const selectIsGameEnd = createSelector([isGameEndState], (isGameEnd) => isGameEnd)
export const selectWinner = createSelector([winnerState], (winner) => winner)
export const selectIsSoundEnabled = createSelector([isSoundEnabledState], (isSoundEnabled) => isSoundEnabled)
export const selectInitialSoundPlayed = createSelector([initialSoundPlayedState], (initialSoundPlayed) => initialSoundPlayed)
