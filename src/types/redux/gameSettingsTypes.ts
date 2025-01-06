export interface GameSettingsStates {
    gameType: 'single' | 'teams' | 'online'
    playerNames: string[]
    gameMode: number | string
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
