export interface GameSettingsStates {
    focusedSection: null | string
    previousFocusedSection: null | string
    gameType: 'single' | 'teams' | 'online'
    playerNames: string[]
    gameMode: number | string
    gameWin: 'best-of' | 'first-to'
    numberOfLegs: number
    numberOfPlayers: number,
    throwTime: number,
    backFromGame: boolean,
    error: {
        isError: boolean
        errorMessage: string
    }
}

export interface ErrorState {
    isError: boolean
    errorMessage: string
}
