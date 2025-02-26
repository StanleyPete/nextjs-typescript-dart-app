'use client'
import React, { useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'
//Redux
import { useDispatch, useSelector } from 'react-redux'
import { RootState, addSocketState } from '@/redux/store'
import { 
   setGameMode, 
   setGameWin, 
   setNumberOfLegs, 
   setPlayerNames,
   setError,
   setNumberOfPlayers,
   setThrowTime
} from '@/redux/slices/gameSettingsSlice'
import { 
   setSocket, 
   setRole, 
   setGameId 
} from '@/redux/slices/game-online/socketSlice'
import '../../styles/insert-new-joiner-name.scss'
import ErrorPopUp from '@/components/ErrorPopUp'
import { setGameNotStartedTimeoutEndTime, setPlayers } from '@/redux/slices/game-online/gameOnlineSlice'
import { PlayerOnline } from '@/types/redux/gameOnlineTypes'

let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameId } = params
   const [ isLoading, setIsLoading] = useState(true)
   const [ gameFound, setGameFound ] = useState<boolean>(false)
   const [ message, setMessage] = useState<string>('')
   const [ currentPlayersInLobby, setCurrentPlayersInLobby ] = useState<string[]>([])
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   const { role } = useSelector((state: RootState) => state.socket) || 'guest' 
   
   const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
      dispatch(setPlayerNames([event.target.value]))
   }

   const validatePlayerNames = () => {
      if (playerNames.some((name: string) => name.trim() === '')) {
         dispatch(setError({ isError: true, errorMessage: 'Please enter your name!' }))
         return false
      }
      return true
   }

   const joinGameLobby = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!validatePlayerNames()) {
         event.preventDefault()
         return
      }

      socket.emit('join-lobby-guest-request', { gameId, playerName: playerNames[0] })
      
      socket.once('guest-joined-lobby', (data) => {
         dispatch(setNumberOfPlayers(data.gameSettings.maxNumberOfPlayers))
         dispatch(setGameMode(data.gameSettings.gameMode))
         dispatch(setGameWin(data.gameSettings.gameWin))
         dispatch(setNumberOfLegs(data.gameSettings.numberOfLegs)) 
         dispatch(setThrowTime(data.gameSettings.throwTime))
         dispatch(setGameNotStartedTimeoutEndTime(data.gameSettings.gameNotStartedTimeoutEndTime))
         const formattedPlayers: PlayerOnline[] = data.gamePlayers.map((player: any) => ({
            name: player.playerName,
            ready: player.ready,
            role: player.role,
            legs: player.legs,
            pointsLeft: player.pointsLeft,
            lastScore: player.lastScore,
            totalThrows: player.totalThrowsValue,
            attempts: player.attempts,
            average: player.average
         }))
         dispatch(setPlayers(formattedPlayers))
         router.push(`/game-online/lobby/${gameId}`)
      })
   }
    
   useEffect(() => {
      if (!socket) {
         socket = io('http://localhost:3001')
      }
   
      socket.on('connect', () => {
         addSocketState()
         dispatch(setSocket(socket))
         dispatch(setRole('guest'))

         socket.emit('check-if-game-exists-request', { gameId })

         socket.once('check-if-game-exists-response', (data) => {
            setIsLoading(false)
            setGameFound(true)
            setCurrentPlayersInLobby(data.currentPlayers)
            dispatch(setGameId(gameId))
         })

         socket.on('current-players-in-lobby-update', (data) => {
            setCurrentPlayersInLobby(data.currentPlayers)
         })

         socket.on('host-left', (data) => {
            setGameFound(false)
            setMessage(data.message)
         })
         
         socket.on('game-is-full', (data) => {
            setIsLoading(false)
            setMessage(data.message)
         })
      })
      
      return () => {
         socket.off('game-is-full')
         socket.off('host-left')
         socket.off('check-if-game-exists-response')
         socket.off('current-players-in-lobby-update')
      }

   }, [])

   // useEffect(() => {
   //    console.log(playerNames)
   // },[playerNames])
     
   return (
      <>
         {isLoading ? (
            <p style={{ color: 'white' }}>Loading...</p>
         ) : gameFound ? (
            <div className='main-container'>
               <h1 className='game-online-header'>GAME ONLINE</h1>
               <p className='current-player-in-lobby'>Current players in lobby: {currentPlayersInLobby.length > 0 ? currentPlayersInLobby.join(', ') : 'None'}</p>
               <div className="players-section main-form">
                  <p className="players header">Enter your name:</p>
                  <div className="player-input">
                     <input
                        className='full-width'
                        type="text"
                        value={role === 'guest' ? playerNames[1] : playerNames[0]}
                        placeholder='Player name...' 
                        onChange={(e) => handlePlayerNameChange(e)}
                     />
                  </div>
               </div>
               <div className="game-start">
                  <button 
                     className="game-start-button"
                     onClick={joinGameLobby}
                  >
                     Join game lobby
                  </button>
               </div>
            </div> 
         ) : (
            <p style={{ color: 'white' }}>{message}</p>
         )}
         < ErrorPopUp />
      </>
   )
}

export default GameOnlineRequest

