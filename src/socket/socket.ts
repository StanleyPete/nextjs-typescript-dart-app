import { io, Socket } from 'socket.io-client'
import { store } from '@/redux/store'
import { RootState } from '@/redux/store'
import { setGameId, setRole, setPlayers, setGameTimeoutStartTime, setGameTimeoutDuartion, setIsConnected, setIsItYourTurn, setCurrentPlayerTurnStartTime, setCurrentPlayerTurnTimerDuartion, setIsGameStarted, setCurrentPlayerIndex, setMultiplier, setCurrentPlayerThrows, setCurrentThrow, setShowNumberButtons, setIsGameEnd, setWinner, setIsDoubleActive, setIsTimeout, setMessage as setLobbyMessage } from '@/redux/slices/game-online/gameOnlineSlice'
import { setIsLoading, setCurrentPlayersInLobby, setGameFound, setMessage, setIsLobbyJoined } from '@/redux/slices/game-online/joinRoomSlice'
import { setGameSettingsChange, setError } from '@/redux/slices/gameSettingsSlice'
import { setNumberOfPlayers, setGameMode, setGameWin, setNumberOfLegs, setThrowTime } from '@/redux/slices/gameSettingsSlice'
import { PlayerOnline } from '@/types/redux/gameOnlineTypes'
import { playSound } from '@/controllers/playSound'


class SocketService {
   private socket: Socket | null = null
   private url: string = 'http://localhost:3001'
   private registerEventListeners() {
      if (!this.socket) return

      this.socket.on('disconnect', () => {
         console.log('Disconnected from websocket server')
      })

      this.socket.on('connect_error', (err) => {
         console.error('Error, websocket server', err)
      })

      this.socket.on('game-timeout', (data) => {
         store.dispatch(setError({ isError: false, errorMessage: ''}))
         store.dispatch(setIsTimeout(true))
         store.dispatch(setLobbyMessage(data.message))
      })

      this.socket?.on('game-settings-changed', (data) => {
         store.dispatch(setGameSettingsChange(data.updatedGameSettings))              
      })

      this.socket.on('guest-joined-lobby', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
      })

      this.socket.on('lobby-player-left', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
      })

      this.socket.on('game-player-left', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
      })

      this.socket.on('current-game-player-left', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         store.dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         store.dispatch(setIsItYourTurn(data.isItPlayersTurn))
      })

      this.socket.on('player-ready', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
      })


      this.socket.on('game-settings-change-failed', (data) => {
         store.dispatch(setError({ isError: true, errorMessage: data.message }))
      })

      this.socket.on('host-change', () => {
         store.dispatch(setRole('host'))
      })


      this.socket.on('game-start', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setGameSettingsChange(data.updatedGameSettings))
         store.dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         store.dispatch(setCurrentPlayerTurnTimerDuartion(data.currentPlayerTurnTimerDuartion))
         store.dispatch(setGameTimeoutDuartion(0))
         store.dispatch(setGameTimeoutStartTime(0))
         store.dispatch(setIsGameStarted(true))   
         store.dispatch(setIsItYourTurn(data.isItPlayersTurn))
         const isSoundEnabled = (store.getState() as RootState).gameOnline.isSoundEnabled
         playSound('game-is-on', isSoundEnabled )

      })

      this.socket.on('no-score-result', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         store.dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         store.dispatch(setIsItYourTurn(data.isItPlayersTurn))
         store.dispatch(setMultiplier(1))
         store.dispatch(setIsDoubleActive(false))
         store.dispatch(setCurrentPlayerThrows([]))
         store.dispatch(setCurrentThrow(0))
         const isSoundEnabled = (store.getState() as RootState).gameOnline.isSoundEnabled
         playSound('no-score', isSoundEnabled )


      })

      this.socket.on('score-submitted', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         store.dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         store.dispatch(setIsItYourTurn(data.isItPlayersTurn))
         store.dispatch(setMultiplier(1))
         store.dispatch(setIsDoubleActive(false))
         store.dispatch(setCurrentPlayerThrows([]))
         store.dispatch(setCurrentThrow(0))
         const isSoundEnabled = (store.getState() as RootState).gameOnline.isSoundEnabled
         if (data.score === 0){
            playSound('no-score', isSoundEnabled)
         } else {
            playSound(String(data.score), isSoundEnabled )
         }
      })

      this.socket.on('score-submitted-number-buttons', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         const currentPlayerThrows = (store.getState() as RootState).gameOnline.currentPlayerThrows
         const updatedThrows = [...currentPlayerThrows, data.score]
         store.dispatch(setCurrentPlayerThrows(updatedThrows))
         store.dispatch(setMultiplier(1))
      })

      this.socket.on('undo-submitted', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         const currentPlayerThrows = (store.getState() as RootState).gameOnline.currentPlayerThrows
         const updatedThrows = currentPlayerThrows.slice(0, -1)
         store.dispatch(setCurrentPlayerThrows(updatedThrows))
      })

      this.socket.on('input-method-changed', (data) => {
         const showNumberButtons = (store.getState() as RootState).gameOnline.showNumberButtons
         store.dispatch(setShowNumberButtons(!showNumberButtons))
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setMultiplier(1))
         store.dispatch(setIsDoubleActive(false))
         store.dispatch(setCurrentPlayerThrows([]))
         store.dispatch(setCurrentThrow(0))
      })

      this.socket.on('leg-end', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
         store.dispatch(setIsItYourTurn(data.isItPlayersTurn))
         store.dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
         store.dispatch(setCurrentPlayerThrows([]))
         store.dispatch(setMultiplier(1))
         store.dispatch(setIsDoubleActive(false))
         const isSoundEnabled = (store.getState() as RootState).gameOnline.isSoundEnabled
         playSound('and-the-leg', isSoundEnabled)
      })

      this.socket.on('game-end', (data) => {
         const formattedPlayers = this.formatPlayers(data.gamePlayers)
         store.dispatch(setGameTimeoutStartTime(data.gameTimeoutStartTime))
         store.dispatch(setGameTimeoutDuartion(data.gameTimeoutDuartion))
         store.dispatch(setPlayers(formattedPlayers))
         store.dispatch(setCurrentPlayerThrows([]))
         store.dispatch(setMultiplier(1))
         store.dispatch(setIsDoubleActive(false))
         store.dispatch(setWinner(data.winner))
         store.dispatch(setIsGameStarted(false))
         store.dispatch(setIsGameEnd(true))
         const isSoundEnabled = (store.getState() as RootState).gameOnline.isSoundEnabled
         playSound('and-the-game', isSoundEnabled)
      })


   }

   private formatPlayers(gamePlayers: any[]): PlayerOnline[] {
      return gamePlayers.map((player) => ({
         name: player.playerName,
         ready: player.ready,
         legs: player.legs,
         pointsLeft: player.pointsLeft,
         lastScore: player.lastScore,
         totalThrows: player.totalThrowsValue,
         attempts: player.attempts,
         average: player.average,
      }))
   }

   public connectAndCreateGame(playerName: string, settings: any) {
      if (this.socket) return
      this.socket = io(this.url)

      this.socket.once('connect', () => {
         this.socket?.emit('create-game-request', { playerName, settings })
         this.socket?.once('game-created', (data) => {
            const { gameId, gameTimeoutStartTime, gameTimeoutDuartion } = data
            const gamePlayer = {
               name: playerName,
               ready: true,
               legs: settings.numberOfLegs,
               pointsLeft: Number(settings.gameMode),
               lastScore: 0,
               totalThrows: 0,
               attempts: 0,
               average: 0,
            }
            store.dispatch(setGameId(gameId))
            store.dispatch(setRole('host'))
            store.dispatch(setPlayers([gamePlayer]))
            store.dispatch(setGameTimeoutStartTime(gameTimeoutStartTime))
            store.dispatch(setGameTimeoutDuartion(gameTimeoutDuartion))
            store.dispatch(setIsConnected(true))
         })
      })

      this.registerEventListeners()
   }

   public connectAndJoinGame(gameId: string) {
      if (this.socket) return
      this.socket = io(this.url)
      this.socket.once('connect', () => {

         this.socket?.emit('check-if-game-exists-request', { gameId })

         this.socket?.once('check-if-game-exists-response', (data) => {
            store.dispatch(setGameId(gameId))
            store.dispatch(setIsConnected(true))
            store.dispatch(setIsLoading(false))
            store.dispatch(setGameFound(true))
            store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
            store.dispatch(setRole('guest'))
         })

         this.socket?.once('game-not-found', (data) => {
            store.dispatch(setIsLoading(false))
            store.dispatch(setMessage(data.message))
         })

         this.socket?.once('game-is-full', (data) => {
            store.dispatch(setIsLoading(false))
            store.dispatch(setMessage(data.message))
         })

         this.socket?.once('host-left', (data) => {
            store.dispatch(setGameFound(false))
            store.dispatch(setMessage(data.message))
         })

         this.socket?.on('current-players-in-lobby-update', (data) => {
            store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
         })

         this.socket?.once('join-lobby-guest-response', (data) => {
            const formattedPlayers = this.formatPlayers(data.gamePlayers)
            store.dispatch(setNumberOfPlayers(data.gameSettings.maxNumberOfPlayers))
            store.dispatch(setGameMode(data.gameSettings.gameMode))
            store.dispatch(setGameWin(data.gameSettings.gameWin))
            store.dispatch(setNumberOfLegs(data.gameSettings.numberOfLegs))
            store.dispatch(setThrowTime(data.gameSettings.throwTime / 1000))
            store.dispatch(setGameTimeoutStartTime(data.gameSettings.gameTimeoutEndTime -
            data.gameTimeoutDuartion))
            store.dispatch(setGameTimeoutDuartion(data.gameTimeoutDuartion))
            store.dispatch(setPlayers(formattedPlayers))
            store.dispatch(setIsLobbyJoined(true))
            this.socket?.off('current-players-in-lobby-update')
         })
      })

      this.registerEventListeners()
      
   }

   public emitJoinLobby(gameId: string, playerName: string) {
      if (this.socket) {
         this.socket.emit('join-lobby-guest-request', { gameId, playerName })
      } 
   }

   public emitGuestReady(gameId: string) {
      if (this.socket) {
         this.socket.emit('guest-ready', { gameId })
      } 
   }

   public emitStartGame(gameId: string) {
      if (this.socket) {
         this.socket.emit('start-game', { gameId })
      } 
   }

   public emitSubmitScoreKeyboardButtons(gameId: string, score: number, multiplier: number) {
      if (this.socket) {
         this.socket.emit('submit-score-keyboard-buttons', { gameId, score, multiplier })
      } 
   }

   public emitSubmitScoreNumberButtons(gameId: string, score: number, multiplier: number) {
      if (this.socket) {
         this.socket.emit('submit-score-number-buttons', { gameId, score, multiplier })
      } 
   }

   public emitSubmitScoreNumberButtonsBeforeThirdThrow(gameId: string) {
      if (this.socket) {
         this.socket.emit('submit-score-number-buttons-before-third-throw', { gameId})
      } 
   }

   public emitUndo(gameId: string) {
      if (this.socket) {
         this.socket.emit('undo', { gameId})
      } 
   }

   public emitToggleInputMethod(gameId: string) {
      if (this.socket) {
         this.socket.emit('toggle-input-method', { gameId })
      } 
   }

   public emitUpdateGameSettings(gameId: string, updatedGameSettings: any) {
      if (!this.socket) return console.error('Socket not connected')
      this.socket?.emit('game-settings-change-request', { gameId, updatedGameSettings,})
   }

   public close() {
      if (this.socket) {
         this.socket.disconnect()
         this.socket = null
      }
   }
}

export const socketService = new SocketService()
