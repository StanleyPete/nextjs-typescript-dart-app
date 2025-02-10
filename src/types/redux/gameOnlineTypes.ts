export interface GameOnlineStates {
    players: PlayerOnline[]
    currentPlayerIndex: number
    startIndex: number,
    showNumberButtons: boolean,
    currentThrow: number,
    isDoubleActive: boolean,
    throwValueSum: number,
    multiplier: number
    currentPlayerThrowsCount: number,
    currentPlayerThrows: number[],
    isGameEnd: boolean,
    winner: PlayerOnline | null,
    isInputPreffered: boolean
    isSoundEnabled: boolean,
    initialSoundPlayed: boolean,
}

export interface PlayerOnline {
    name: string
    legs: number
    pointsLeft: number
    lastScore: number
    average: number
    
}