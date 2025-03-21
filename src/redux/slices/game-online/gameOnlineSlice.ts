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
   startIndex: 0,
   showNumberButtons: false,
   currentThrow: 0,
   isDoubleActive: false,
   throwValueSum: 0,
   multiplier: 1,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   isGameEnd: false,
   winner: null,
   isInputPreffered: true,
   isSoundEnabled: true,
   initialSoundPlayed: false,
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
      setStartIndex(state, action: PayloadAction<number>) {
         state.startIndex = action.payload
      },
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
      },
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
      setThrowValueSum(state, action: PayloadAction<number>) {
         state.throwValueSum = action.payload
      },
      setMultiplier(state, action: PayloadAction<number>) {
         state.multiplier = action.payload
      },
      setCurrentPlayerThrowsCount(state, action: PayloadAction<number>) {
         state.currentPlayerThrowsCount = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<number[]>) {
         state.currentPlayerThrows = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(state, action: PayloadAction<PlayerOnline | null>) {
         state.winner = action.payload
      },
      setIsInputPreffered(state, action: PayloadAction<boolean>) {
         state.isInputPreffered = action.payload
      },
      setIsSoundEnabled(state, action: PayloadAction<boolean>) {
         state.isSoundEnabled = action.payload
      },
      setInitialSoundPlayed(state, action: PayloadAction<boolean>) {
         state.initialSoundPlayed = action.payload
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

      updatePlayerReadiness(state, action: PayloadAction<{ index: number; ready: boolean }>) {
         if (state.players[action.payload.index]) {
            state.players[action.payload.index].ready = action.payload.ready
         }
      },
      updatePlayerLegs(state, action: PayloadAction<{ index: number; legs: number }>) {
         if (state.players[action.payload.index]) {
            state.players[action.payload.index].legs = action.payload.legs
         }
      },
      updatePlayerPointsLeft(state, action: PayloadAction<{ index: number; pointsLeft: number }>) {
         if (state.players[action.payload.index]) {
            state.players[action.payload.index].pointsLeft = action.payload.pointsLeft
         }
      },
      updatePlayerLastScore(state, action: PayloadAction<{ index: number; lastScore: number }>) {
         if (state.players[action.payload.index]) {
            state.players[action.payload.index].lastScore = action.payload.lastScore
         }
      },
      updatePlayerAverage(state, action: PayloadAction<{ index: number; average: number }>) {
         if (state.players[action.payload.index]) {
            state.players[action.payload.index].average = action.payload.average
         }
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
   setStartIndex,
   setShowNumberButtons,
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setIsDoubleActive,
   setCurrentThrow,
   setThrowValueSum,
   setMultiplier,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setIsInputPreffered,
   setInitialSoundPlayed,
   setGameCreatedStartTime,
   setGameCreatedTimerDuartion,
   setCurrentPlayerTurnStartTime,
   setCurrentPlayerTurnTimerDuartion,
   updatePlayerLegs,
   updatePlayerPointsLeft,
   updatePlayerLastScore,
   updatePlayerAverage,
} = gameOnlineSlice.actions

export default gameOnlineSlice.reducer
