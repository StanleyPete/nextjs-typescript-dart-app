import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
   TeamClassic,
   HistoryEntryClassicTeams,
   GameClassicTeamsStates,
} from '@/types/components/componentsTypes'

const initialState: GameClassicTeamsStates = {
   teams: [],
   historyClassicTeams: [],
   currentTeamIndex: 0,
   currentPlayerIndexInTeam: 0,
}

const gameClassicTeamsSlice = createSlice({
   name: 'gameClassicTeams',
   initialState,
   reducers: {
      initializeTeams(
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

         const { playerNames } = action.payload

         state.teams = [
            {
               name: 'Team 1',
               members: playerNames.slice(0, 2),
               legs: 0,
               pointsLeft: gameModeNumber,
               lastScore: 0,
               totalThrows: 0,
               totalAttempts: 0,
               average: 0,
               isInputPreffered: true,
            },
            {
               name: 'Team 2',
               members: playerNames.slice(2, 4),
               legs: 0,
               pointsLeft: gameModeNumber,
               lastScore: 0,
               totalThrows: 0,
               totalAttempts: 0,
               average: 0,
               isInputPreffered: true,
            },
         ]
      },
      setTeams(state, action: PayloadAction<TeamClassic[]>) {
         state.teams = action.payload
      },
      setCurrentTeamIndex(state, action: PayloadAction<number>) {
         state.currentTeamIndex = action.payload
      },
      setCurrentPlayerIndexInTeam(state, action: PayloadAction<number>) {
         state.currentPlayerIndexInTeam = action.payload
      },
      setHistoryClassicTeams(
         state,
         action: PayloadAction<HistoryEntryClassicTeams[]>
      ) {
         state.historyClassicTeams = action.payload
      },
   },
})

export const {
   initializeTeams,
   setTeams,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryClassicTeams,
} = gameClassicTeamsSlice.actions

export default gameClassicTeamsSlice.reducer
