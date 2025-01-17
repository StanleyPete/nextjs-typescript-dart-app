'use client'
import React, { useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'
import PageNotFound from '@/components/game-online/PageNotFound'
import '../../styles/insert-new-joiner-name.scss'
import { useDispatch } from 'react-redux'
import { addSocketState } from '@/redux/store'
import { 
   setGameMode, 
   setGameWin, 
   setNumberOfLegs 
} from '@/redux/slices/gameSettingsSlice'
import { setSocket, setRole, setGameId } from '@/redux/slices/game-online/socketSlice'


let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameId } = params
   const [gameFound, setGameFound] = useState<boolean>(false)
   const [playerName, setPlayerName] = useState('')
   const [currentPlayerInLobby, setCurrentPlayerInLobby] = useState<string>('')

 

   const handlePlayerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPlayerName(event.target.value)
   }
    
   useEffect(() => {
      if (!socket) {
         socket = io('http://localhost:3001')
      }
 
      
      //Connection listener
      socket.on('connect', () => {
         //Add socket state to redux
         addSocketState()
         //Updating socket state in redux
         dispatch(setSocket(socket))
         dispatch(setRole('guest'))

         //Check if game exsists emitter
         socket.emit('check-if-game-exists', { gameId })

         socket.on('game-exists', (data) => {
   
            if (data.exists) {
               setGameFound(true)
               setCurrentPlayerInLobby(data.host)
               dispatch(setGameMode(data.settings.gameMode))
               dispatch(setGameWin(data.settings.gameWin))
               dispatch(setNumberOfLegs(data.settings.numberOfLegs))
               dispatch(setGameId(gameId))
            } else {
               setGameFound(false)
            }
         })

         socket.on('host-left', () => {
            setCurrentPlayerInLobby('Host left! You are host now!')
            dispatch(setRole('host'))
         })

         
      })
      
      console.log('UseEffect completed')

      return () => {
         socket.off('game-exists')
         // socket.off('host-left')
      }

   }, [])

   const joinGame = () => {
      socket.emit('join-game-guest', { gameId, playerName: playerName })
      
      socket.once('guest-joined', (data) => {
         if (data.host) {
            dispatch(setRole('host'))
         }

         console.log('Przekierowanie do lobby...', `/game-online/lobby/${gameId}`)
         router.push(`/game-online/lobby/${gameId}`)
      })
   }
   
   return (
      <>
         {gameFound ? (
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
                     onClick={joinGame}
                  >
                     Join game lobby
                  </button>
   
               </div>
            
            </div> 
         ) : (
            <PageNotFound /> 
         )}
      </>
   )
}

export default GameOnlineRequest

