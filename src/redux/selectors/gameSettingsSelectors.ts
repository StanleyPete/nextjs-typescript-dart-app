import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const gameTypeState = (state: RootState) => state.gameSettings.gameType
const playerNamesState = (state: RootState) => state.gameSettings.playerNames
const gameModeState = (state: RootState) => state.gameSettings.gameMode
const gameWinState = (state: RootState) => state.gameSettings.gameWin
const numberOfLegsState = (state: RootState) => state.gameSettings.numberOfLegs
const numberOfPlayersState = (state: RootState) => state.gameSettings.numberOfPlayers
const throwTimeState = (state: RootState) => state.gameSettings.throwTime
const isFirstLoadState = (state: RootState) => state.gameSettings.isFirstLoad
const errorState = (state: RootState) => state.gameSettings.error

export const selectGameType = createSelector([gameTypeState], (gameType) => gameType)
export const selectPlayerNames = createSelector([playerNamesState], (playerNames) => playerNames)
export const selectGameMode = createSelector([gameModeState], (gameMode) => gameMode)
export const selectGameWin = createSelector([gameWinState], (gameWin) => gameWin)
export const selectNumberOfLegs = createSelector([numberOfLegsState], (numberOfLegs) => numberOfLegs)
export const selectNumberOfPlayers = createSelector([numberOfPlayersState], (numberOfPlayers) => numberOfPlayers)
export const selectThrowTime = createSelector([throwTimeState], (throwTime) => throwTime)
export const selectIsFirstLoad = createSelector([isFirstLoadState], (isFirstLoad) => isFirstLoad)
export const selectError = createSelector([errorState], (error) => error)
