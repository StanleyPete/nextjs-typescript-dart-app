import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const isConnectedState = (state: RootState) => state.gameOnline.isConnected
const isGameStartedState = (state: RootState) => state.gameOnline.isGameStarted
const gameIdState = (state: RootState) => state.gameOnline.gameId 
const roleState = (state: RootState) => state.gameOnline.role
const playersState = (state: RootState) => state.gameOnline.players 
const currentPlayerIndexState = (state: RootState) => state.gameOnline.currentPlayerIndex
const isItYourTurnState = (state: RootState) => state.gameOnline.isItYourTurn
const startIndexState = (state: RootState) => state.gameOnline.startIndex
const showNumberButtonsState = (state: RootState) => state.gameOnline.showNumberButtons
const currentThrowState = (state: RootState) => state.gameOnline.currentThrow
const isDoubleActiveState = (state: RootState) => state.gameOnline.isDoubleActive
const throwValueSumState = (state: RootState) => state.gameOnline.throwValueSum
const multiplierState = (state: RootState) => state.gameOnline.multiplier
const currentPlayerThrowsCountState = (state: RootState) => state.gameOnline.currentPlayerThrowsCount
const currentPlayerThrowsState = (state: RootState) => state.gameOnline.currentPlayerThrows
const isGameEndState = (state: RootState) => state.gameOnline.isGameEnd
const winnerState = (state: RootState) => state.gameOnline.winner
const isInputPrefferedState = (state: RootState) => state.gameOnline.isInputPreffered
const isSoundEnabledState = (state: RootState) => state.gameOnline.isSoundEnabled
const initialSoundPlayedState = (state: RootState) => state.gameOnline.initialSoundPlayed
const gameCreatedStartTimeState = (state: RootState) => state.gameOnline.gameCreatedStartTime
const gameCreatedTimerDuartionState = (state: RootState) => state.gameOnline.gameCreatedTimerDuartion
const currentPlayerTurnStartTimeState = (state: RootState) => state.gameOnline.currentPlayerTurnStartTime
const currentPlayerTurnTimerDuartionState = (state: RootState) => state.gameOnline.currentPlayerTurnTimerDuartion

export const selectIsConnected = createSelector([isConnectedState], (isConnected) => isConnected)
export const selectIsGameStarted = createSelector([isGameStartedState], (isGameStarted) => isGameStarted)
export const selectGameId = createSelector([gameIdState], (gameId) => gameId)
export const selectRole = createSelector([roleState], (role) => role)
export const selectPlayers = createSelector([playersState], (players) => players)
export const selectCurrentPlayerIndex = createSelector([currentPlayerIndexState], (currentPlayerIndex) => currentPlayerIndex)
export const selectIsItYourTurn = createSelector([isItYourTurnState], (isItYourTurn) => isItYourTurn)
export const selectStartIndex = createSelector([startIndexState], (startIndex) => startIndex)
export const selectShowNumberButtons = createSelector([showNumberButtonsState], (showNumberButtons) => showNumberButtons)
export const selectCurrentThrow = createSelector([currentThrowState], (currentThrow) => currentThrow)
export const selectIsDoubleActive = createSelector([isDoubleActiveState], (isDoubleActive) => isDoubleActive)
export const selectThrowValueSum = createSelector([throwValueSumState], (throwValueSum) => throwValueSum)
export const selectMultiplier = createSelector([multiplierState], (multiplier) => multiplier)
export const selectCurrentPlayerThrowsCount = createSelector([currentPlayerThrowsCountState], (currentPlayerThrowsCount) => currentPlayerThrowsCount)
export const selectCurrentPlayerThrows = createSelector([currentPlayerThrowsState], (currentPlayerThrows) => currentPlayerThrows)
export const selectIsGameEnd = createSelector([isGameEndState], (isGameEnd) => isGameEnd)
export const selectWinner = createSelector([winnerState], (winner) => winner)
export const selectIsInputPreffered = createSelector([isInputPrefferedState], (isInputPreffered) => isInputPreffered)
export const selectIsSoundEnabled = createSelector([isSoundEnabledState], (isSoundEnabled) => isSoundEnabled)
export const selectInitialSoundPlayed = createSelector([initialSoundPlayedState], (initialSoundPlayed) => initialSoundPlayed)
export const selectGameCreatedStartTime = createSelector([gameCreatedStartTimeState], (gameCreatedStartTime) => gameCreatedStartTime)
export const selectGameCreatedTimerDuartion = createSelector([gameCreatedTimerDuartionState], (gameCreatedTimerDuartion) => gameCreatedTimerDuartion)
export const selectCurrentPlayerTurnStartTime = createSelector([currentPlayerTurnStartTimeState], (currentPlayerTurnStartTime) => currentPlayerTurnStartTime)
export const selectCurrentPlayerTurnTimerDuaration = createSelector([currentPlayerTurnTimerDuartionState], (currentPlayerTurnTimerDuaration) => currentPlayerTurnTimerDuaration)

const numberOfPlayersState = (state: RootState) => state.gameSettings.numberOfPlayers

export const selectNumberOfPlayers = createSelector([numberOfPlayersState], (numberOfPlayers) => numberOfPlayers)