import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//Types
import { 
   GameSettingsStates, 
   ErrorState 
} from '@/types/redux/gameSettingsTypes'

const initialState: GameSettingsStates = {
   focusedSection: null,
   previousFocusedSection: null,
   gameType: 'single',
   playerNames: ['', ''],
   gameMode: 501,
   gameWin: 'best-of',
   numberOfLegs: 3,
   numberOfPlayers: 2,
   throwTime: 30,
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
      setFocusedSection(state, action: PayloadAction<null| string>) {
         state.focusedSection = action.payload
      },
      setPreviousFocusedSection(state, action: PayloadAction<null| string>) {
         state.previousFocusedSection = action.payload
      },
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
      setNumberOfPlayers(state, action: PayloadAction<number>) {
         state.numberOfPlayers = action.payload
      },
      setThrowTime(state, action: PayloadAction<number>) {
         state.throwTime = action.payload
      },  
      setIsFirstLoad: (state, action: PayloadAction<boolean>) => {
         state.isFirstLoad = action.payload
      },
      setError: (state, action: PayloadAction<ErrorState>) => {
         state.error = action.payload
      },
      setGameSettingsChange: (state, action: PayloadAction<any>) => {
         state.gameMode = action.payload.gameMode
         state.numberOfLegs = action.payload.numberOfLegs
         state.gameWin = action.payload.gameWin
         state.throwTime = action.payload.throwTime / 1000
      }
   },
})

export const {
   setFocusedSection,
   setPreviousFocusedSection,
   setPlayerNames,
   setGameMode,
   setGameType,
   setGameWin,
   setNumberOfLegs,
   setNumberOfPlayers,
   setThrowTime,
   setIsFirstLoad,
   setError,
   setGameSettingsChange,
} = gameSettingsSlice.actions
export default gameSettingsSlice.reducer
