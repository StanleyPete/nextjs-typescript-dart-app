import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const showNumberButtonsState = (state: RootState) => state.gameClassic.showNumberButtons
const currentThrowState = (state: RootState) => state.gameClassic.currentThrow
const throwValueSumState = (state: RootState) => state.gameClassic.throwValueSum
const multiplierState = (state: RootState) => state.gameClassic.multiplier
const isDoubleActiveState = (state: RootState) => state.gameClassic.isDoubleActive

export const selectShowNumberButtons = createSelector([showNumberButtonsState], (showNumberButtons) => showNumberButtons)
export const selectCurrentThrow = createSelector([currentThrowState], (currentThrow) => currentThrow)
export const selectThrowValueSum = createSelector([throwValueSumState], (throwValueSum) => throwValueSum)
export const selectMultiplier = createSelector([multiplierState], (multiplier) => multiplier)
export const selectIsDoubleActive = createSelector([isDoubleActiveState], (isDoubleActive) => isDoubleActive)
