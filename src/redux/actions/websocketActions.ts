import { createAction } from '@reduxjs/toolkit'

interface GameSettings {
    gameMode: string | number;
    gameWin: string;
    numberOfLegs: number;
    numberOfPlayers: number;
    throwTime: number;
 }

 interface UpdatedGameSettings {
    gameMode?: string | number;
    gameWin?: string;
    numberOfLegs?: number;
    numberOfPlayers?: number;
    throwTime?: number;
 }

export const createGame = createAction<{ playerName: string, settings: GameSettings }>('create-game')

export const joinGame = createAction<{ gameId: string }>('join-game')

export const updateGameSettings = createAction<{ gameId: string, updatedGameSettings: UpdatedGameSettings }>('update-game-settings')

export const joinLobby = createAction<{ gameId: string, playerName: string }>('join-lobby')

export const guestReady = createAction<{ gameId: string }>('guest-ready')

export const startGame = createAction<{ gameId: string }>('start-game')





