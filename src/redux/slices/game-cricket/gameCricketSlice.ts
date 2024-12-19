import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//Types
import { GameCricketStates } from '@/types/redux/gameCricketTypes'

const initialState: GameCricketStates = {
   completedSectors: {
      '20': false,
      '19': false,
      '18': false,
      '17': false,
      '16': false,
      '15': false,
      'Bull': false,
   },
}

const gameCricketSlice = createSlice({
   name: 'gameClassic',
   initialState,
   reducers: {
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
   },
})

export const { setCompletedSectors } = gameCricketSlice.actions

export default gameCricketSlice.reducer
