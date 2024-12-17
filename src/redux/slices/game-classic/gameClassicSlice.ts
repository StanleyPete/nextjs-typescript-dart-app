import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
   PlayerClassic,
   TeamClassic,
   GameClassicStates,
} from '@/types/components/componentsTypes'

const initialState: GameClassicStates = {
   startIndex: 0,
   showNumberButtons: false,
   currentThrow: 0,
   throwValueSum: 0,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   multiplier: 1,
   isDoubleActive: false,
   isGameEnd: false,
   winner: null,
   isSoundEnabled: true,
   initialSoundPlayed: false,
}

const gameClassicSlice = createSlice({
   name: 'gameClassic',
   initialState,
   reducers: {
      setStartIndex(state, action: PayloadAction<number>) {
         state.startIndex = action.payload
      },
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
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
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(
         state,
         action: PayloadAction<PlayerClassic | TeamClassic | null>
      ) {
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
   setStartIndex,
   setShowNumberButtons,
   setCurrentThrow,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setMultiplier,
   setIsDoubleActive,
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setInitialSoundPlayed,
} = gameClassicSlice.actions

export default gameClassicSlice.reducer
