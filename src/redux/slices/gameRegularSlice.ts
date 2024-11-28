import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Player {
   name: string
   legs: number
   pointsLeft: number
   lastScore: number
   totalThrows: number
   totalAttempts: number
   average: number
   isInputPreffered: boolean
}

export interface HistoryEntry {
   historyPlayerIndex: number
   historyPointsLeft: number
   historyLastScore: number
   historyTotalThrows: number
   historyLastAverage: number
   historyTotalAttempts: number
}

export interface GameRegularState {
   players: Player[]
   history: HistoryEntry[]
   currentThrow: number
   currentPlayerIndex: number
   startPlayerIndex: number
   showNumberButtons: boolean
   throwValueSum: number
   currentPlayerThrowsCount: number
   currentPlayerThrows: number[]
   multiplier: number
   isError: boolean
   errorMessage: string
   isDoubleActive: boolean
   isGameEnd: boolean
   winner: Player | null
   isSoundEnabled: boolean
   initialSoundPlayed: boolean
}

const initialState: GameRegularState = {
   players: [],
   history: [],
   currentThrow: 0,
   currentPlayerIndex: 0,
   startPlayerIndex: 0,
   showNumberButtons: false,
   throwValueSum: 0,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   multiplier: 1,
   isError: false,
   errorMessage: '',
   isDoubleActive: false,
   isGameEnd: false,
   winner: null,
   isSoundEnabled: true,
   initialSoundPlayed: false,
}

const gameRegularSlice = createSlice({
   name: 'gameRegular',
   initialState,
   reducers: {
      initializePlayers(state, action: PayloadAction<{ playerNames: string[]; gameMode: number | string}>) {
         const gameModeNumber = typeof action.payload.gameMode === 'string' ? Number(action.payload.gameMode) : action.payload.gameMode
         state.players = action.payload.playerNames.map((name) => ({
            name,
            pointsLeft: gameModeNumber,
            legs: 0,
            lastScore: 0,
            totalThrows: 0,
            totalAttempts: 0,
            average: 0,
            isInputPreffered: true,
         }))
      },
      setPlayers(state, action: PayloadAction<Player[]>) {
         state.players = action.payload
      },
      setHistory(state, action: PayloadAction<HistoryEntry[]>) {
         state.history = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
      },
      setCurrentPlayerIndex(state, action: PayloadAction<number>) {
         state.currentPlayerIndex = action.payload
      },
      setStartPlayerIndex(state, action: PayloadAction<number>) {
         state.startPlayerIndex = action.payload
      },
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setThrowValueSum(state, action: PayloadAction<number>) {
         state.throwValueSum = action.payload
      },
      setCurrentPlayerThrowsCount(state, action: PayloadAction<number>) {
         state.currentPlayerThrowsCount = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<number[]>) {
         state.currentPlayerThrows = action.payload
      },
      setMultiplier(state, action: PayloadAction<number>) {
         state.multiplier = action.payload
      },
      setIsError(state, action: PayloadAction<boolean>) {
         state.isError = action.payload
      },
      setErrorMessage(state, action: PayloadAction<string>) {
         state.errorMessage = action.payload
      },
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(state, action: PayloadAction<Player | null>) {
         state.winner = action.payload
      },
      setIsSoundEnabled(state, action: PayloadAction<boolean>) {
         state.isSoundEnabled = action.payload
      },
      setInitialSoundPlayed(state, action: PayloadAction<boolean>) {
         state.initialSoundPlayed = action.payload
      },
   },
})

export const {
   initializePlayers,
   setPlayers,
   setHistory,
   setCurrentThrow,
   setCurrentPlayerIndex,
   setStartPlayerIndex,
   setShowNumberButtons,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setMultiplier,
   setIsError,
   setErrorMessage,
   setIsDoubleActive,
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setInitialSoundPlayed,
} = gameRegularSlice.actions

export default gameRegularSlice.reducer
