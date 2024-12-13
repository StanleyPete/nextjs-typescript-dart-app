import { PayloadAction } from '@reduxjs/toolkit'

//REDUX TYPES/INTERFACES
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



//PAGES
export type GameClassicPageSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[]
    history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[]
}

//COMPONENTS
export type CurrentPlayerThrowSectionComponentTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[]
    index: number,
    currentPlayerIndexInTeam: number | 0
}

export type ScoreSectionComponentSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[],
    index: number,
}

export type ThrowValueSectionComponentSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[],
    index: number,
    currentPlayerIndexInTeam: number | undefined, 
    history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[]
}

export type KeyboardButtonsComponentSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[], 
    index: number,
    history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[], 
}

export type NumberButtonsComponentSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[],
    index: number,
    currentPlayerIndexInTeam: number | undefined, 
    history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],  
}

export type GameEndPopUpComponentSelectorTypes = {
    playersOrTeams: PlayerClassic[] | TeamClassic[]
    index: number
    history: HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[]
}


export interface TeamsPlayerInput { 
    teamIndex: number 
    playerIndexes: number[] 
}

export interface PlayerNamesInputProps { maxPlayers: number }





