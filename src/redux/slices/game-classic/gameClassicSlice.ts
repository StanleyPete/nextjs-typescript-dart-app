import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//Types
import { GameClassicStates } from '@/types/redux/gameClassicTypes'

const initialState: GameClassicStates = {
   showNumberButtons: false,
   currentThrow: 0,
   throwValueSum: 0,
   multiplier: 1,
   isDoubleActive: false,
}

const gameClassicSlice = createSlice({
   name: 'gameClassic',
   initialState,
   reducers: {
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
      },
      setThrowValueSum(state, action: PayloadAction<number>) {
         state.throwValueSum = action.payload
      },
      setMultiplier(state, action: PayloadAction<number>) {
         state.multiplier = action.payload
      },
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
   },
})

export const {
   setShowNumberButtons,
   setCurrentThrow,
   setThrowValueSum,
   setMultiplier,
   setIsDoubleActive,
} = gameClassicSlice.actions

export default gameClassicSlice.reducer
