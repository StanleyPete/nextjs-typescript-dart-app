import { PlayerClassic, TeamClassic } from './gameClassicTypes'
import { PlayerCricket, TeamCricket } from './gameCricketTypes'

//USED IN BOTH SINGLE AND TEAMS GAME TYPES AS WELL AS CLASSIC AND CRICKET MODES
export interface GameStates {
    startIndex: number,
    currentPlayerThrowsCount: number,
    currentPlayerThrows: string[] | number[],
    isGameEnd: boolean,
    winner: PlayerClassic | PlayerCricket | TeamClassic | TeamCricket | null,
    isSoundEnabled: boolean,
    initialSoundPlayed: boolean,
}