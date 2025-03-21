import { createSelector } from 'reselect'
import { RootState } from '@/redux/store'

const isLoadingState = (state: RootState) => state.joinRoom?.isLoading ?? true
const gameFoundState = (state: RootState) => state.joinRoom?.gameFound ?? false
const messageState = (state: RootState) => state.joinRoom?.message ?? ''
const currentPlayersInLobbyState = (state: RootState) => state.joinRoom?.currentPlayersInLobby ?? []
const isLobbyJoinedState = (state: RootState) => state.joinRoom?.isLobbyJoined ?? false

export const selectIsLoading = createSelector([isLoadingState], (isLoading) => isLoading)
export const selectGameFound = createSelector([gameFoundState], (gameFound) => gameFound)
export const selectMessage = createSelector([messageState], (message) => message)
export const selectCurrentPlayersInLobby = createSelector([currentPlayersInLobbyState], (currentPlayersInLobby) => currentPlayersInLobby)
export const selectIsLobbyJoined = createSelector([isLobbyJoinedState], (isLobbyJoined) => isLobbyJoined)
