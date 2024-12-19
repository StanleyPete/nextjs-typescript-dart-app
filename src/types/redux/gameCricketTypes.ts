import { PayloadAction } from '@reduxjs/toolkit'

export interface GameCricketStates {
    completedSectors: Record<'20' | '19' | '18' | '17' | '16' | '15' | 'Bull', boolean>,
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

export interface HistoryEntryCricketSingle {
    historyPlayerIndex: number
    historyPoints: number
    historyScores: { [key: string]: number }
    historyThrows: string[]
    historyLegs: number
    historyLastThrowSector: '20' | '19' | '18' | '17' | '16' | '15' | 'Bull' | ''
 }
 
export interface HistoryEntryCricketTeams {
    historyTeamIndex: number
    historyPlayerIndexInTeam: number
    historyPoints: number
    historyScores: { [key: string]: number }
    historyThrows: string[]
    historyLegs: number
    historyLastThrowSector: '20' | '19' | '18' | '17' | '16' | '15' | 'Bull' | ''
 }

export type InitializeCricketPlayersType = (
    payload: { 
        playerNames: string[] 
    }) => 
        PayloadAction<{ 
            playerNames: string[] 
        }>
export type InitializeCricketTeamsType = (
    payload: { 
        playerNames: string[] 
    }) => 
        PayloadAction<{ 
            playerNames: string[] 
        }>
 