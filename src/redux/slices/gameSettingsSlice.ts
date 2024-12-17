import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
   GameSettingsStates,
   ErrorState,
} from '@/types/components/componentsTypes'

const initialState: GameSettingsStates = {
   gameType: 'single',
   playerNames: ['', ''],
   gameMode: 501,
   gameWin: 'best-of',
   numberOfLegs: 3,
   isFirstLoad: true,
   error: {
      isError: false,
      errorMessage: '',
   },
}

const gameSettingsSlice = createSlice({
   name: 'gameSettings',
   initialState,
   reducers: {
      setGameType: (
         state,
         action: PayloadAction<GameSettingsStates['gameType']>
      ) => {
         state.gameType = action.payload
      },
      setPlayerNames(state, action: PayloadAction<string[]>) {
         state.playerNames = action.payload
      },
      setGameMode(state, action: PayloadAction<number | string>) {
         state.gameMode = action.payload
      },
      setGameWin(state, action: PayloadAction<'best-of' | 'first-to'>) {
         state.gameWin = action.payload
      },
      setNumberOfLegs(state, action: PayloadAction<number>) {
         state.numberOfLegs = action.payload
      },
      setIsFirstLoad: (state, action: PayloadAction<boolean>) => {
         state.isFirstLoad = action.payload
      },
      setError: (state, action: PayloadAction<ErrorState>) => {
         state.error = action.payload
      },
   },
})

export const {
   setPlayerNames,
   setGameMode,
   setGameType,
   setGameWin,
   setNumberOfLegs,
   setIsFirstLoad,
   setError,
} = gameSettingsSlice.actions
export default gameSettingsSlice.reducer
