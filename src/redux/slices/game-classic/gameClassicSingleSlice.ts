import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
   PlayerClassic,
   HistoryEntryClassicSingle,
   GameClassicSingleStates,
} from '@/types/components/componentsTypes'

const initialState: GameClassicSingleStates = {
   players: [],
   historyClassicSingle: [],
   currentPlayerIndex: 0,
}

const gameClassicSingleSlice = createSlice({
   name: 'gameClassicSingle',
   initialState,
   reducers: {
      initializePlayers(
         state,
         action: PayloadAction<{
        playerNames: string[];
        gameMode: number | string;
      }>
      ) {
         const gameModeNumber =
        typeof action.payload.gameMode === 'string'
           ? Number(action.payload.gameMode)
           : action.payload.gameMode

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
      setPlayers(state, action: PayloadAction<PlayerClassic[]>) {
         state.players = action.payload
      },
      setHistoryClassicSingle(
         state,
         action: PayloadAction<HistoryEntryClassicSingle[]>
      ) {
         state.historyClassicSingle = action.payload
      },
      setCurrentPlayerIndex(state, action: PayloadAction<number>) {
         state.currentPlayerIndex = action.payload
      },
   },
})

export const {
   initializePlayers,
   setPlayers,
   setHistoryClassicSingle,
   setCurrentPlayerIndex,
} = gameClassicSingleSlice.actions

export default gameClassicSingleSlice.reducer
