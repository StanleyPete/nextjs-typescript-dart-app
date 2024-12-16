import { PayloadAction } from '@reduxjs/toolkit'

//REDUX TYPES/INTERFACES
export interface GameCricketStates {
    startIndex: number,
    currentPlayerThrowsCount: number,
    currentPlayerThrows: string[],
    completedSectors: Record<'20' | '19' | '18' | '17' | '16' | '15' | 'Bull', boolean>,
    isGameEnd: boolean,
    winner: PlayerCricket | TeamCricket | null,
    isSoundEnabled: boolean,
    initialSoundPlayed: boolean,
}

export interface PlayerCricket {
    name: string,
    legs: number,
    points: number,
    scores: { [key: string]: number}
}

export interface TeamCricket {
    name: string,
    members: string[],
    legs: number,
    points: number,
    scores: { [key: string]: number}
}

export interface GameCricketSingleStates {
    players: PlayerCricket[]
    currentPlayerIndex: number
    historyCricketSingle: HistoryEntryCricketSingle[]
}

export interface GameCricketTeamsStates {
    teams: TeamCricket[]
    currentTeamIndex: number
    currentPlayerIndexInTeam: number
    historyCricketTeams: HistoryEntryCricketTeams[]
}

export interface HistoryEntryCricketSingle {
   historyPlayerIndex: number
   historyPoints: number
   historyScores: { [key: string]: number }
   historyThrows: string[]
   historyLegs: number
   historyLastThrowSector: string
}

export interface HistoryEntryCricketTeams {
    historyPlayerIndex: number
   historyPlayerIndexInTeam: number
   historyPoints: number
   historyScores: { [key: string]: number }
   historyThrows: string[]
   historyLegs: number
   historyLastThrowSector: string
}

export interface GameSettingsStates {
    gameType: 'single' | 'teams' | 'online'
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

export interface ErrorState {
    isError: boolean
    errorMessage: string
}

export interface GameClassicStates{
    startIndex: number
    showNumberButtons: boolean
    currentThrow: number
    throwValueSum: number
    currentPlayerThrowsCount: number
    currentPlayerThrows: number[]
    multiplier: number
    isDoubleActive: boolean
    isGameEnd: boolean
    winner: PlayerClassic | TeamClassic | null
    isSoundEnabled: boolean
    initialSoundPlayed: boolean
}

export interface PlayerClassic {
    name: string
    legs: number
    pointsLeft: number
    lastScore: number
    totalThrows: number
    totalAttempts: number
    average: number
    isInputPreffered: boolean
}

export interface HistoryEntryClassicSingle {
    historyPlayerIndex: number
    historyPointsLeft: number
    historyLastScore: number
    historyTotalThrows: number
    historyLastAverage: number
    historyTotalAttempts: number
}

export interface GameClassicSingleStates {
    players: PlayerClassic[]
    currentPlayerIndex: number
    historyClassicSingle: HistoryEntryClassicSingle[]
}

export interface TeamClassic {
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

export interface HistoryEntryClassicTeams {
    historyTeamIndex: number
    historyPlayerIndexInTeam: number
    historyPointsLeft: number
    historyLastScore: number
    historyTotalThrows: number
    historyLastAverage: number
    historyTotalAttempts: number
}

export interface GameClassicTeamsStates {
    teams: TeamClassic[]
    currentTeamIndex: number
    currentPlayerIndexInTeam: number
    historyClassicTeams: HistoryEntryClassicTeams[]
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

export interface TeamsPlayerInput { 
    teamIndex: number 
    playerIndexes: number[] 
}

export interface PlayerNamesInputProps { maxPlayers: number }







