import { PayloadAction } from '@reduxjs/toolkit'

export interface TeamsPlayerInput { teamIndex: number; playerIndexes: number[] }

export interface PlayerNamesInputProps { maxPlayers: number }

export type GameContext = 'gameRegular' | 'gameRegularTeams'

export interface GameContextProps { context: GameContext}

export type GameData = {
    playersOrTeams: Player[] | Team[]
    index: number
    history: HistoryEntry[] | HistoryEntryTeams[]
    showNumberButtons: boolean
    throwValueSum: number
    currentPlayerThrows: number[]
    currentPlayerThrowsCount: number
    isGameEnd: boolean
    winner: Player | Team | null
}

export type ScoreSectionDataType = {
    playersOrTeams: Player[] | Team[],
    index: number,
    showNumberButtons: boolean
}

export type ThrowValueSectionType = {
    playersOrTeams: Player[] | Team[],
    index: number,
    currentPlayerIndexInTeam?: number, 
    startIndex: number, 
    history: HistoryEntry[] | HistoryEntryTeams[]
    showNumberButtons: boolean, 
    throwValueSum: number, 
    currentThrow: number 
    currentPlayerThrowsCount: number, 
    currentPlayerThrows: number[], 
    multiplier: number, 
    isDoubleActive: boolean, 
    isSoundEnabled: boolean
}

export type KeyboardButtonsType = {
    playersOrTeams: Player[] | Team[], 
    index: number, 
    history: HistoryEntry[] | HistoryEntryTeams[], 
    currentThrow: number, 
    showNumberButtons: boolean, 
    throwValueSum: number, 
    currentPlayerThrowsCount: number, 
    currentPlayerThrows: number[],
}

export type NumberButtonsType = {
    playersOrTeams: Player[] | Team[],
    history: HistoryEntry[] | HistoryEntryTeams[], 
    index: number,
    currentPlayerIndexInTeam?: number, 
    startIndex: number, 
    showNumberButtons: boolean, 
    throwValueSum: number, 
    currentPlayerThrowsCount: number, 
    currentPlayerThrows: number[], 
    multiplier: number, 
    isSoundEnabled: boolean
}


//REDUX TYPES/INTERFACES
export interface Player {
    name: string
    legs: number
    pointsLeft: number
    lastScore: number
    totalThrows: number
    totalAttempts: number
    average: number
    isInputPreffered: boolean
}

export interface Team {
    name: string
    members: string[]
    legs: number
    pointsLeft: number
    lastScore: number
    totalThrows: number
    totalAttempts: number
    average: number
    isInputPreffered: boolean
}
export interface HistoryEntry {
    historyPlayerIndex: number
    historyPointsLeft: number
    historyLastScore: number
    historyTotalThrows: number
    historyLastAverage: number
    historyTotalAttempts: number
}

export interface HistoryEntryTeams {
    historyTeamIndex: number
    historyPlayerIndexInTeam: number
    historyPointsLeft: number
    historyLastScore: number
    historyTotalThrows: number
    historyLastAverage: number
    historyTotalAttempts: number
}


export interface GameSettingsState {
    gameType: 'regular' | 'teams' | 'online'
    playerNames: string[]
    gameMode: number | string;
    gameWin: 'best-of' | 'first-to'
    numberOfLegs: number
    isFirstLoad: boolean,
    error: {
     isError: boolean
     errorMessage: string
   }
  }

export interface GameRegularState {
    players: Player[]
    history: HistoryEntry[]
    currentThrow: number
    currentPlayerIndex: number
    startPlayerIndex: number
    showNumberButtons: boolean
    throwValueSum: number
    currentPlayerThrowsCount: number
    currentPlayerThrows: number[]
    multiplier: number
    isDoubleActive: boolean
    isGameEnd: boolean
    winner: Player | null
    isSoundEnabled: boolean
    initialSoundPlayed: boolean
 }

export interface GameRegularTeamsState {
    teams: Team[]
    history: HistoryEntryTeams[]
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

export interface ErrorState {
    isError: boolean
    errorMessage: string
  }

export type InitializePlayersType = (
    payload: { 
        playerNames: string[] 
        gameMode: number | string 
    }) => 
        PayloadAction<{ 
            playerNames: string[] 
            gameMode: number | string 
        }>

export type InitializeTeamsType = (
    payload: { 
        playerNames: string[] 
        gameMode: number | string 
    }) => PayloadAction<{ 
        playerNames: string[] 
        gameMode: number | string 
    }>


