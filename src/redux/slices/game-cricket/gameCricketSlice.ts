import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameCricketStates, PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'

const initialState: GameCricketStates = {
   startIndex: 0,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   completedSectors: {
      '20': false,
      '19': false,
      '18': false,
      '17': false,
      '16': false,
      '15': false,
      'Bull': false,
   },
   isGameEnd: false,
   winner: null,
   isSoundEnabled: true,
   initialSoundPlayed: false,
}

const gameCricketSlice = createSlice({
   name: 'gameClassic',
   initialState,
   reducers: {
      setStartIndex(state, action: PayloadAction<number>) {
         state.startIndex = action.payload
      },
      setCurrentPlayerThrowsCount(state, action: PayloadAction<number>) {
         state.currentPlayerThrowsCount = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<string[]>) {
         state.currentPlayerThrows = action.payload
      },
      setCompletedSectors(
         state,
         action: PayloadAction<{
        sector: keyof typeof state.completedSectors;
        completed: boolean;
      }>
      ) {
         const { sector, completed } = action.payload
         state.completedSectors[sector] = completed
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(
         state,
         action: PayloadAction<PlayerCricket | TeamCricket | null>
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
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setCompletedSectors,
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setInitialSoundPlayed,
} = gameCricketSlice.actions

export default gameCricketSlice.reducer
