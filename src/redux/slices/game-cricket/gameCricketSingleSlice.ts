import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayerCricket, HistoryEntryCricketSingle, GameCricketSingleStates } from '@/types/types'

const initialState: GameCricketSingleStates = {
   players: [],
   currentPlayerIndex: 0,
   historyCricketSingle: [],
}

const gameCricketSingleSlice = createSlice({
   name: 'gameCricketSingle',
   initialState,
   reducers: {
      initializeCricketPlayers(
         state,
         action: 
            PayloadAction<{
               playerNames: string[];
               gameMode: number | string;
            }>
      ) {state.players = action.payload.playerNames.map((name) => ({
            name,
            legs: 0,
            points: 0 ,
            scores: {
                '20': 0,
                '19': 0,
                '18': 0,
                '17': 0,
                '16': 0,
                '15': 0,
                'Bull': 0,
             }
         }))
      },
      setPlayers(state, action: PayloadAction<PlayerCricket[]>) {
         state.players = action.payload
      },
      setHistoryCricketSingle(state, action: PayloadAction<HistoryEntryCricketSingle[]>) {
         state.historyCricketSingle = action.payload
      },
      setCurrentPlayerIndex(state, action: PayloadAction<number>) {
         state.currentPlayerIndex = action.payload
      },
   },
})

export const {
   initializeCricketPlayers,
   setPlayers,
   setHistoryCricketSingle,
   setCurrentPlayerIndex,
} = gameCricketSingleSlice.actions

export default gameCricketSingleSlice.reducer
