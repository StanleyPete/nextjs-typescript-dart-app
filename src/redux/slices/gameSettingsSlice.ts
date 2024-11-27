import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GameSettingsState {
  gameType: 'regular' | 'teams' | 'online'
  playerNames: string[]
  gameMode: number | string;
  gameWin: 'best-of' | 'first-to'
  numberOfLegs: number
  error: {
   isError: boolean
   errorMessage: string
 }
}

const initialState: GameSettingsState = {
   gameType: 'regular',
   playerNames: ['', ''],
   gameMode: 501,
   gameWin: 'best-of',
   numberOfLegs: 3,
   error: {
      isError: false,
      errorMessage: ''
   }
}

interface ErrorState {
   isError: boolean
   errorMessage: string
 }

const gameSettingsSlice = createSlice({
   name: 'gameSettings',
   initialState,
   reducers: {
      setGameType: (state, action: PayloadAction<'regular' | 'teams' | 'online'>) => {
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
      setError: (state, action: PayloadAction<ErrorState>) => {
         state.error = action.payload
      }
   },
})

export const { setGameType, setPlayerNames, setGameMode, setGameWin, setNumberOfLegs, setError } = gameSettingsSlice.actions
export default gameSettingsSlice.reducer