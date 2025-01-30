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
   setPlayerNames
} from '@/redux/slices/gameSettingsSlice'
import { 
   setSocket, 
   setRole, 
   setGameId 
} from '@/redux/slices/game-online/socketSlice'
import '../../styles/insert-new-joiner-name.scss'

let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameId } = params
   const [isLoading, setIsLoading] = useState(true)
   const [ gameFound, setGameFound ] = useState<boolean>(false)
   const [ playerName, setPlayerName ] = useState('')
   const [ currentPlayerInLobby, setCurrentPlayerInLobby ] = useState<string>('')
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   
   const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPlayerName(event.target.value)
   }

   const joinGameLobby = () => {
      socket.emit('join-lobby-guest-request', { gameId, playerName: playerName })
      
      socket.once('join-lobby-guest-response', (data) => {
         if (data.host) {
            dispatch(setRole('host'))
            dispatch(setPlayerNames([playerName]))
         } else {
            dispatch(setPlayerNames([playerNames[0], playerName]))
         }
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

         socket.on('check-if-game-exists-response', (data) => {
            if (data.exists) {
               setIsLoading(false)
               setGameFound(true)
               setCurrentPlayerInLobby(data.host)
               dispatch(setPlayerNames([data.host, playerName]))
               dispatch(setGameMode(data.settings.gameMode))
               dispatch(setGameWin(data.settings.gameWin))
               dispatch(setNumberOfLegs(data.settings.numberOfLegs))
               dispatch(setGameId(gameId))
            } else {
               setIsLoading(false)
               setGameFound(false)
            }
         })

         socket.on('host-left-response', () => {
            setCurrentPlayerInLobby('Host left! You are host now!')
            dispatch(setPlayerNames([playerName, '']))
            dispatch(setRole('host'))
         })     
      })
      
      return () => {
         socket.off('check-if-game-exists-response')
         socket.off('host-left-response')
      }

   }, [])
     
   return (
      <>
         {isLoading ? (
            <p style={{ color: 'white' }}>Loading...</p>
         ) : gameFound ? (
            <div className='main-container'>
               <h1 className='game-online-header'>GAME ONLINE</h1>
               <p className='current-player-in-lobby'>(Current player in lobby: {currentPlayerInLobby})</p>
               <div className="players-section main-form">
                  <p className="players header">Enter your name:</p>
                  <div className="player-input">
                     <input
                        className='full-width'
                        type="text"
                        value={playerName}
                        placeholder='Player name...' 
                        onChange={handlePlayerNameChange}
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
            <p style={{ color: 'white' }}>Page not found</p>
         )}
      </>
   )
}

export default GameOnlineRequest

