import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TeamCricket, HistoryEntryCricketTeams, GameCricketTeamsStates } from '@/types/types'

const initialState: GameCricketTeamsStates = {
   teams: [],
   currentTeamIndex: 0,
   currentPlayerIndexInTeam: 0,
   historyCricketTeams: []
}

const gameCricketTeamsSlice = createSlice({
   name: 'gameCricketTeams',
   initialState,
   reducers: {
      initializeCricketTeams(
         state,
         action: PayloadAction<{
        playerNames: string[];
        gameMode: number | string;
      }>
      ) {
         const { playerNames } = action.payload
         state.teams = [
            {
               name: 'Team 1',
               members: playerNames.slice(0, 2),
               legs: 0,
               points: 0,
               scores: {
                '20': 0,
                '19': 0,
                '18': 0,
                '17': 0,
                '16': 0,
                '15': 0,
                'Bull': 0,
             }
            },
            {
               name: 'Team 2',
               members: playerNames.slice(2, 4),
               legs: 0,
               points: 0,
               scores: {
                '20': 0,
                '19': 0,
                '18': 0,
                '17': 0,
                '16': 0,
                '15': 0,
                'Bull': 0,
             }
            },
         ]
      },
      setTeams(state, action: PayloadAction<TeamCricket[]>) {
         state.teams = action.payload
      },
      setCurrentTeamIndex(state, action: PayloadAction<number>) {
         state.currentTeamIndex = action.payload
      },
      setCurrentPlayerIndexInTeam(state, action: PayloadAction<number>) {
         state.currentPlayerIndexInTeam = action.payload
      },
      setHistoryCricketTeams(state, action: PayloadAction<HistoryEntryCricketTeams[]>) {
         state.historyCricketTeams = action.payload
      },
   },
})

export const {
   initializeCricketTeams,
   setTeams,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setHistoryCricketTeams,
} = gameCricketTeamsSlice.actions

export default gameCricketTeamsSlice.reducer
