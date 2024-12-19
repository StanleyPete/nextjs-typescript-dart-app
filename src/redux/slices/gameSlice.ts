import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//Types
import { GameStates } from '@/types/redux/gameTypes'
import { PlayerClassic, TeamClassic } from '@/types/redux/gameClassicTypes'
import { PlayerCricket, TeamCricket } from '@/types/redux/gameCricketTypes'

//USED IN BOTH SINGLE AND TEAMS GAME TYPES AS WELL AS CLASSIC AND CRICKET MODES
const initialState: GameStates = {
   startIndex: 0,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   isGameEnd: false,
   winner: null,
   isSoundEnabled: true,
   initialSoundPlayed: false,
}

const gameSlice = createSlice({
   name: 'game',
   initialState,
   reducers: {
      setStartIndex(state, action: PayloadAction<number>) {
         state.startIndex = action.payload
      },
      setCurrentPlayerThrowsCount(state, action: PayloadAction<number>) {
         state.currentPlayerThrowsCount = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<number[]|string[]>) {
         state.currentPlayerThrows = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(
         state,
         action: PayloadAction<PlayerClassic | PlayerCricket | TeamClassic | TeamCricket | null>
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
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setInitialSoundPlayed,
} = gameSlice.actions
 
export default gameSlice.reducer