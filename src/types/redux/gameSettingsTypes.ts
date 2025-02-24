export interface GameSettingsStates {
    gameType: 'single' | 'teams' | 'online'
    playerNames: string[]
    gameMode: number | string
    gameWin: 'best-of' | 'first-to'
    numberOfLegs: number
    numberOfPlayers: number,
    throwTime: number,
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
