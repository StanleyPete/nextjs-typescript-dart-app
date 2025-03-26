import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameOnlineStates, PlayerOnline } from '@/types/redux/gameOnlineTypes'

const initialState: GameOnlineStates = {
   isConnected: false,
   isGameStarted: false,
   gameId: '',
   role: '',
   players: [],
   currentPlayerIndex: 0,
   isItYourTurn: false,
   showNumberButtons: false,
   currentThrow: 0,
   isGameEnd: false,
   winner: null,
   isDoubleActive: false,
   multiplier: 1,
   currentPlayerThrows: [],
   isSoundEnabled: true,
   gameCreatedStartTime: 0,
   gameCreatedTimerDuartion: 0,
   currentPlayerTurnStartTime: 0,
   currentPlayerTurnTimerDuartion: 0,
}

const gameOnlineSlice = createSlice({
   name: 'gameOnline',
   initialState,
   reducers: {
      setIsConnected(state, action: PayloadAction<boolean>) {
         state.isConnected = action.payload
      },
      setIsGameStarted(state, action: PayloadAction<boolean>) {
         state.isGameStarted = action.payload
      },
      setGameId(state, action: PayloadAction<string>){
         state.gameId = action.payload
      },
      setRole(state, action: PayloadAction<'host' | 'guest'>){
         state.role = action.payload
      },
      setPlayers(state, action: PayloadAction<PlayerOnline[]>) {
         state.players = action.payload
      },
      setCurrentPlayerIndex(state, action: PayloadAction<number>) {
         state.currentPlayerIndex = action.payload
      },
      setIsItYourTurn(state, action: PayloadAction<boolean>) {
         state.isItYourTurn = action.payload
      },
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(state, action: PayloadAction<any>) {
         state.winner = action.payload
      },
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
      setMultiplier(state, action: PayloadAction<number>) {
         state.multiplier = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<number[]>) {
         state.currentPlayerThrows = action.payload
      },
      setIsSoundEnabled(state, action: PayloadAction<boolean>) {
         state.isSoundEnabled = action.payload
      },
      setGameCreatedStartTime(state, action: PayloadAction<number>) {
         state.gameCreatedStartTime = action.payload
      },
      setGameCreatedTimerDuartion(state, action: PayloadAction<number>) {
         state.gameCreatedTimerDuartion = action.payload
      },
      setCurrentPlayerTurnStartTime(state, action: PayloadAction<number>) {
         state.currentPlayerTurnStartTime = action.payload
      },
      setCurrentPlayerTurnTimerDuartion(state, action: PayloadAction<number>) {
         state.currentPlayerTurnTimerDuartion = action.payload
      },
   },
})

export const {
   setIsConnected,
   setIsGameStarted,
   setGameId,
   setRole,
   setPlayers,
   setCurrentPlayerIndex,
   setIsItYourTurn,
   setShowNumberButtons,
   setIsSoundEnabled,
   setIsDoubleActive,
   setCurrentThrow,
   setIsGameEnd,
   setWinner,
   setMultiplier,
   setCurrentPlayerThrows,
   setGameCreatedStartTime,
   setGameCreatedTimerDuartion,
   setCurrentPlayerTurnStartTime,
   setCurrentPlayerTurnTimerDuartion,
} = gameOnlineSlice.actions

export default gameOnlineSlice.reducer
