import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Player {
   name: string
}

export interface Team {
   name: string
   members: Player[]
   legs: number
   pointsLeft: number
   lastScore: number
   totalThrows: number
   totalAttempts: number
   average: number
   isInputPreffered: boolean
}

export interface HistoryEntry {
   historyTeamIndex: number
   historyPlayerIndexInTeam: number
   historyPointsLeft: number
   historyLastScore: number
   historyTotalThrows: number
   historyLastAverage: number
   historyTotalAttempts: number
}

export interface GameRegularTeamsState {
   teams: Team[]
   history: HistoryEntry[]
   currentThrow: number
   currentPlayerIndex: number
   currentTeamIndex: number
   currentPlayerIndexInTeam: number
   startTeamIndex: number
   showNumberButtons: boolean
   throwValueSum: number
   currentPlayerThrowsCount: number
   currentPlayerThrows: number[]
   multiplier: number
   isDoubleActive: boolean
   isGameEnd: boolean
   winner: Team | null
   isSoundEnabled: boolean
   initialSoundPlayed: boolean
}

const initialState: GameRegularTeamsState = {
   teams: [],
   history: [],
   currentThrow: 0,
   currentPlayerIndex: 0,
   currentTeamIndex: 0,
   currentPlayerIndexInTeam: 0,
   startTeamIndex: 0,
   showNumberButtons: false,
   throwValueSum: 0,
   currentPlayerThrowsCount: 0,
   currentPlayerThrows: [],
   multiplier: 1,
   isDoubleActive: false,
   isGameEnd: false,
   winner: null,
   isSoundEnabled: true,
   initialSoundPlayed: false,
}

const gameRegularTeamsSlice = createSlice({
   name: 'gameRegularTeams',
   initialState,
   reducers: {
      initializeTeams(state, action: PayloadAction<{ playerNames: string[]; gameMode: number | string}>) {
         const gameModeNumber = typeof action.payload.gameMode === 'string' ? Number(action.payload.gameMode) : action.payload.gameMode

         const players: Player[] = action.payload.playerNames.map((name) => ({
            name,
         }))

         state.teams = [
            {
               name: 'Team 1',
               members: players.slice(0, 2),
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
               members: players.slice(2, 4), // Kolejne 2 osoby to drużyna 2
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
      setTeams(state, action: PayloadAction<Team[]>) {
         state.teams = action.payload
      },
      setHistory(state, action: PayloadAction<HistoryEntry[]>) {
         state.history = action.payload
      },
      setCurrentThrow(state, action: PayloadAction<number>) {
         state.currentThrow = action.payload
      },
      setCurrentPlayerIndex(state, action: PayloadAction<number>) {
         state.currentPlayerIndex = action.payload
      },
      setCurrentTeamIndex(state, action: PayloadAction<number>) {
         state.currentTeamIndex = action.payload
      },
      setCurrentPlayerIndexInTeam(state, action: PayloadAction<number>) {
         state.currentPlayerIndexInTeam = action.payload
      },
      setStartTeamIndex(state, action: PayloadAction<number>) {
         state.startTeamIndex = action.payload
      },
      setShowNumberButtons(state, action: PayloadAction<boolean>) {
         state.showNumberButtons = action.payload
      },
      setThrowValueSum(state, action: PayloadAction<number>) {
         state.throwValueSum = action.payload
      },
      setCurrentPlayerThrowsCount(state, action: PayloadAction<number>) {
         state.currentPlayerThrowsCount = action.payload
      },
      setCurrentPlayerThrows(state, action: PayloadAction<number[]>) {
         state.currentPlayerThrows = action.payload
      },
      setMultiplier(state, action: PayloadAction<number>) {
         state.multiplier = action.payload
      },
      setIsDoubleActive(state, action: PayloadAction<boolean>) {
         state.isDoubleActive = action.payload
      },
      setIsGameEnd(state, action: PayloadAction<boolean>) {
         state.isGameEnd = action.payload
      },
      setWinner(state, action: PayloadAction<Team | null>) {
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
   initializeTeams,
   setTeams,
   setHistory,
   setCurrentThrow,
   setCurrentPlayerIndex,
   setCurrentTeamIndex,
   setCurrentPlayerIndexInTeam,
   setStartTeamIndex,
   setShowNumberButtons,
   setThrowValueSum,
   setCurrentPlayerThrowsCount,
   setCurrentPlayerThrows,
   setMultiplier,
   setIsDoubleActive,
   setIsGameEnd,
   setWinner,
   setIsSoundEnabled,
   setInitialSoundPlayed,
} = gameRegularTeamsSlice.actions

export default gameRegularTeamsSlice.reducer
