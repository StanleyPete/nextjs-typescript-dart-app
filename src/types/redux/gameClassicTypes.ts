import { PayloadAction } from '@reduxjs/toolkit'

export interface GameClassicStates{
    showNumberButtons: boolean
    currentThrow: number
    throwValueSum: number
    multiplier: number
    isDoubleActive: boolean
}

export interface GameClassicSingleStates {
    players: PlayerClassic[]
    currentPlayerIndex: number
    historyClassicSingle: HistoryEntryClassicSingle[]
}

export interface GameClassicTeamsStates {
    teams: TeamClassic[]
    currentTeamIndex: number
    currentPlayerIndexInTeam: number
    historyClassicTeams: HistoryEntryClassicTeams[]
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

export interface HistoryEntryClassicSingle {
    historyPlayerIndex: number
    historyPointsLeft: number
    historyLastScore: number
    historyTotalThrows: number
    historyLastAverage: number
    historyTotalAttempts: number
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

