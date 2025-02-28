export interface GameOnlineStates {
    players: PlayerOnline[],
    currentPlayerIndex: number,
    isItYourTurn: boolean,
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
    gameCreatedStartTime: number,
    gameCreatedTimerDuartion: number,
    currentPlayerTurnStartTime: number,
    currentPlayerTurnTimerDuartion: number,
}

export interface PlayerOnline {
    name: string,
    ready: boolean
    legs: number
    pointsLeft: number
    lastScore: number
    totalThrows: number
    attempts: number
    average: number
    
}