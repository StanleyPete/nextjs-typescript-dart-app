export interface GameOnlineStates {
    isConnected: boolean
    isGameStarted: boolean
    gameId: string,
    role: string,
    players: PlayerOnline[],
    currentPlayerIndex: number,
    isItYourTurn: boolean,
    showNumberButtons: boolean,
    currentThrow: number,
    isGameEnd: boolean,
    winner: any,
    isDoubleActive: boolean,
    multiplier: number
    currentPlayerThrows: number[],
    isSoundEnabled: boolean,
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