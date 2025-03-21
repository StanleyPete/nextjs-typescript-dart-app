import { Middleware } from '@reduxjs/toolkit'
import { AppDispatch } from '../store'
import io, { Socket } from 'socket.io-client'
import {
   createGame,
   guestReady,
   joinGame,
   joinLobby,
   startGame,
   updateGameSettings,
} from '../actions/websocketActions'
import {
   setCurrentPlayerIndex,
   setCurrentPlayerTurnStartTime,
   setCurrentPlayerTurnTimerDuartion,
   setGameId,
   setRole,
   setPlayers,
   setGameCreatedStartTime,
   setGameCreatedTimerDuartion,
   setIsConnected,
   setIsItYourTurn,
   setIsGameStarted,
} from '@/redux/slices/game-online/gameOnlineSlice'
import {
   setCurrentPlayersInLobby,
   setGameFound,
   setIsLoading,
   setIsLobbyJoined,
   setMessage,
} from '../slices/game-online/joinRoomSlice'
import {
   setGameMode,
   setNumberOfLegs,
   setThrowTime,
   setGameWin,
   setNumberOfPlayers,
   setError,
   setGameSettingsChange,
} from '../slices/gameSettingsSlice'
import { PlayerOnline } from '@/types/redux/gameOnlineTypes'

const websocketMiddleware = (store) => {
   let socket: Socket | null = null

   return (next) => (action) => {
      if (socket) {
         socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket')
            store.dispatch(setIsConnected(false))
            socket = null
         })

         socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error)
         })

         socket.on('join-lobby-guest-response', (data) => {
            const formattedPlayers = formatPlayers(data.gamePlayers)
            store.dispatch(
               setNumberOfPlayers(data.gameSettings.maxNumberOfPlayers)
            )
            store.dispatch(setGameMode(data.gameSettings.gameMode))
            store.dispatch(setGameWin(data.gameSettings.gameWin))
            store.dispatch(setNumberOfLegs(data.gameSettings.numberOfLegs))
            store.dispatch(setThrowTime(data.gameSettings.throwTime))
            store.dispatch(
               setGameCreatedStartTime(
                  data.gameSettings.gameCreatedTimerEndTime -
              data.gameCreatedTimerDuartion
               )
            )
            store.dispatch(
               setGameCreatedTimerDuartion(data.gameCreatedTimerDuartion)
            )
            store.dispatch(setPlayers(formattedPlayers))
            store.dispatch(setIsLobbyJoined(true))
         })

         socket.on('current-players-in-lobby-update', (data) => {
            store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
         })

         socket.on('host-left', (data) => {
            store.dispatch(setGameFound(false))
            store.dispatch(setMessage(data.message))
         })

         socket.on('game-is-full', (data) => {
            store.dispatch(setIsLoading(false))
            store.dispatch(setMessage(data.message))
         })

         socket?.on('game-settings-changed', (data) => {
            console.log(data)
            store.dispatch(setGameSettingsChange(data.updatedGameSettings))
            // store.dispatch(setGameMode(data.updatedGameSettings.gameMode))
            // store.dispatch(setNumberOfLegs(data.updatedGameSettings.numberOfLegs))
            // store.dispatch(setGameWin(data.updatedGameSettings.gameWin))
            // store.dispatch(setThrowTime(data.updatedGameSettings.throwTime))
            // store.dispatch(setPlayers(formatPlayers(data.gamePlayers)))
         })

         socket?.on('guest-joined-lobby', (data) => {
            updatePlayers(data.gamePlayers, store.dispatch)
         })

         socket?.on('player-left', (data) =>
            updatePlayers(data.gamePlayers, store.dispatch)
         )

         socket?.on('player-ready', (data) =>
            updatePlayers(data.gamePlayers, store.dispatch)
         )

         socket?.on('game-settings-change-failed', (data) => {
            store.dispatch(setError({ isError: true, errorMessage: data.message }))
         })

         socket?.on('host-change', () => {
            store.dispatch(setRole('host'))
         })

         socket?.on('your-turn-now', () => {
            store.dispatch(setIsItYourTurn(true))
         })

         socket?.on('game-start', (data) => onGameStart(data, store.dispatch))

         //UPDATE GAME SETTINGS
         if (updateGameSettings.match(action)) {
            const { gameId, updatedGameSettings } = action.payload
            socket?.emit('game-settings-change-request', {
               gameId,
               updatedGameSettings,
            })
         }

         //JOIN LOBBY
         if (joinLobby.match(action)) {
            const { gameId, playerName } = action.payload
            socket?.emit('join-lobby-guest-request', { gameId, playerName })
         }

         //GUEST READY
         if (guestReady.match(action)) {
            const { gameId } = action.payload
            socket?.emit('guest-ready', { gameId })
         }

         //START GAME
         if (startGame.match(action)) {
            const { gameId } = action.payload
            socket?.emit('start-game', { gameId })
         }
      }

      if (!socket) {
      // CREATE GAME
         if (createGame.match(action)) {
            const { playerName, settings } = action.payload
            socket = io('http://localhost:3001')
            socket.on('connect', () => {
               socket.emit('create-game-request', { playerName, settings })

               socket.once('game-created', (data) => {
                  const { gameId, gameCreatedStartTime, gameCreatedTimerDuartion } =
              data
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
                  store.dispatch(setGameCreatedStartTime(gameCreatedStartTime))
                  store.dispatch(
                     setGameCreatedTimerDuartion(gameCreatedTimerDuartion)
                  )
                  store.dispatch(setIsConnected(true))
               })
            })
         }

         //JOIN GAME (join room)
         if (joinGame.match(action)) {
            const { gameId } = action.payload
            socket = io('http://localhost:3001')
            socket.on('connect', () => {
               socket?.emit('check-if-game-exists-request', { gameId })

               socket.once('check-if-game-exists-response', (data) => {
                  store.dispatch(setGameId(gameId))
                  store.dispatch(setIsConnected(true))
                  store.dispatch(setIsLoading(false))
                  store.dispatch(setGameFound(true))
                  store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
                  store.dispatch(setRole('guest'))
               })
            })
         }
      }

      return next(action)
   }
}

// HELPERS/UTILS:
const formatPlayers = (gamePlayers: any[]): PlayerOnline[] =>
   gamePlayers.map((player) => ({
      name: player.playerName,
      ready: player.ready,
      legs: player.legs,
      pointsLeft: player.pointsLeft,
      lastScore: player.lastScore,
      totalThrows: player.totalThrowsValue,
      attempts: player.attempts,
      average: player.average,
   }))

const updatePlayers = (gamePlayers: [], dispatch: AppDispatch) => {
   dispatch(setPlayers(formatPlayers(gamePlayers)))
}
const handleGameSettingsChanged = (
   updatedGameSettings: any,
   dispatch: AppDispatch
) => {
   dispatch(setGameMode(updatedGameSettings.gameMode))
   dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
   dispatch(setGameWin(updatedGameSettings.gameWin))
   dispatch(setThrowTime(updatedGameSettings.throwTime))
}

const onGameSettingsChanged = (
   data: { updatedGameSettings: any; gamePlayers: [] },
   dispatch: AppDispatch
) => {
   handleGameSettingsChanged(data.updatedGameSettings, dispatch)
   updatePlayers(data.gamePlayers, dispatch)
}

const onGameStart = (
   data: {
    updatedGameSettings: any;
    gamePlayers: [];
    currentPlayerIndex: number;
    currentPlayerTurnStartTime: number;
    currentPlayerTurnTimerDuartion: number;
  },
   dispatch: AppDispatch
) => {
   updatePlayers(data.gamePlayers, dispatch)
   handleGameSettingsChanged(data.updatedGameSettings, dispatch)
   dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
   dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
   dispatch(
      setCurrentPlayerTurnTimerDuartion(data.currentPlayerTurnTimerDuartion)
   )
   dispatch(setIsGameStarted(true))
}

export default websocketMiddleware

// const websocketMiddleware: Middleware = (store) => {
//    let socket: Socket | null
//    return (next) => (action: any) => {

//       // CREATE GAME
//       if (createGame.match(action)) {
//          const { playerName, settings } = action.payload

//          socket = io('http://localhost:3001')

//          socket.on('connect', () => {
//             socket?.emit('create-game-request', { playerName, settings })
//          })

//          socket.once('game-created', (data) => {
//             const { gameId, gameCreatedStartTime, gameCreatedTimerDuartion } = data
//             const gamePlayer = {
//                name: playerName,
//                ready: true,
//                legs: settings.numberOfLegs,
//                pointsLeft: Number(settings.gameMode),
//                lastScore: 0,
//                totalThrows: 0,
//                attempts: 0,
//                average: 0
//             }
//             store.dispatch(setGameId(gameId))
//             store.dispatch(setRole('host'))
//             store.dispatch(setPlayers([gamePlayer]))
//             store.dispatch(setGameCreatedStartTime(gameCreatedStartTime))
//             store.dispatch(setGameCreatedTimerDuartion(gameCreatedTimerDuartion))
//             store.dispatch(setIsConnected(true))
//          })

//          socket.on('disconnect', () => {
//             console.log('Disconnected from WebSocket serverTest2')
//             store.dispatch(setIsConnected(false))
//             socket = null
//          })

//          socket.on('connect_error', (error) => {
//             console.error('WebSocket connection error:', error)
//          })

//       }

//       //JOIN GAME (join room)
//       if (joinGame.match(action)) {
//          const { gameId } = action.payload
//          socket = io('http://localhost:3001')

//          socket.on('connect', () => {
//             socket?.emit('check-if-game-exists-request', { gameId })
//          })

//          socket.once('check-if-game-exists-response', (data) => {
//             store.dispatch(setGameId(gameId))
//             store.dispatch(setIsConnected(true))
//             store.dispatch(setIsLoading(false))
//             store.dispatch(setGameFound(true))
//             store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
//             store.dispatch(setRole('guest'))
//          })

//          socket.on('current-players-in-lobby-update', (data) => {
//             store.dispatch(setCurrentPlayersInLobby(data.currentPlayers))
//          })

//          socket.on('host-left', (data) => {
//             store.dispatch(setGameFound(false))
//             store.dispatch(setMessage(data.message))
//          })

//          socket.once('game-is-full', (data) => {
//             store.dispatch(setIsLoading(false))
//             store.dispatch(setMessage(data.message))
//          })
//       }

//       //UPDATE GAME SETTINGS
//       if (updateGameSettings.match(action)) {
//          const { gameId, updatedGameSettings } = action.payload
//          socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )

//       }

//       //JOIN LOBBY
//       if (joinLobby.match(action)) {
//          const { gameId, playerName } = action.payload
//          socket?.emit('join-lobby-guest-request', { gameId, playerName })

//          socket?.once('join-lobby-guest-response', (data) => {
//             const formattedPlayers = formatPlayers(data.gamePlayers)
//             store.dispatch(setNumberOfPlayers(data.gameSettings.maxNumberOfPlayers))
//             store.dispatch(setGameMode(data.gameSettings.gameMode))
//             store.dispatch(setGameWin(data.gameSettings.gameWin))
//             store.dispatch(setNumberOfLegs(data.gameSettings.numberOfLegs))
//             store.dispatch(setThrowTime(data.gameSettings.throwTime))
//             store.dispatch(setGameCreatedStartTime(data.gameSettings.gameCreatedTimerEndTime - data.gameCreatedTimerDuartion))
//             store.dispatch(setGameCreatedTimerDuartion(data.gameCreatedTimerDuartion))
//             store.dispatch(setPlayers(formattedPlayers))
//             store.dispatch(setIsLobbyJoined(true))
//          })

//       }

//        //GUEST READY
//        if (guestReady.match(action)) {
//          const { gameId } = action.payload
//          socket?.emit('guest-ready', { gameId })
//        }

//        //START GAME
//        if (startGame.match(action)) {
//          const { gameId } = action.payload
//          socket?.emit('start-game', { gameId })

//        }

//       // LISTENERS

//       socket?.on('game-settings-changed', (data) => {
//          onGameSettingsChanged(data, store.dispatch)
//       })

//       socket?.on('guest-joined-lobby', (data) => {
//          updatePlayers(data.gamePlayers, store.dispatch)
//       })

//       socket?.on('player-left', (data) => updatePlayers(data.gamePlayers, store.dispatch))

//       socket?.on('player-ready', (data) => updatePlayers(data.gamePlayers, store.dispatch))

//       socket?.on('game-settings-change-failed', (data) => {
//          store.dispatch(setError({ isError: true, errorMessage: data.message }))
//       })

//       socket?.on('host-change', () => {
//          store.dispatch(setRole('host'))
//       })

//       socket?.on('your-turn-now', () => {
//          store.dispatch(setIsItYourTurn(true))
//       })

//       socket?.on('game-start', (data) => onGameStart(data, store.dispatch))

//       console.log(socket)
//       return next(action)
//    }
// }

// // HELPERS/UTILS:
// const formatPlayers = (gamePlayers: any[]): PlayerOnline[] =>
//    gamePlayers.map(player => ({
//       name: player.playerName,
//       ready: player.ready,
//       legs: player.legs,
//       pointsLeft: player.pointsLeft,
//       lastScore: player.lastScore,
//       totalThrows: player.totalThrowsValue,
//       attempts: player.attempts,
//       average: player.average
// }))

// const updatePlayers = (gamePlayers: [], dispatch: AppDispatch) => {
//    dispatch(setPlayers(formatPlayers(gamePlayers)))
// }
// const handleGameSettingsChanged = (updatedGameSettings: any , dispatch: AppDispatch) => {
//    dispatch(setGameMode(updatedGameSettings.gameMode))
//    dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
//    dispatch(setGameWin(updatedGameSettings.gameWin))
//    dispatch(setThrowTime(updatedGameSettings.throwTime))
// }

// const onGameSettingsChanged = (data: { updatedGameSettings: any, gamePlayers: [] }, dispatch: AppDispatch) => {
//    handleGameSettingsChanged(data.updatedGameSettings, dispatch)
//    updatePlayers(data.gamePlayers, dispatch)
// }

// const onGameStart = (data: { updatedGameSettings: any, gamePlayers: [], currentPlayerIndex: number, currentPlayerTurnStartTime: number,currentPlayerTurnTimerDuartion: number}, dispatch: AppDispatch) => {
//       updatePlayers(data.gamePlayers, dispatch)
//       handleGameSettingsChanged(data.updatedGameSettings, dispatch)
//       dispatch(setCurrentPlayerIndex(data.currentPlayerIndex))
//       dispatch(setCurrentPlayerTurnStartTime(data.currentPlayerTurnStartTime))
//       dispatch(setCurrentPlayerTurnTimerDuartion(data.currentPlayerTurnTimerDuartion))
//       dispatch(setIsGameStarted(true))
//    }

// export default websocketMiddleware
