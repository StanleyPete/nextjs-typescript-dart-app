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
   setError
} from '@/redux/slices/gameSettingsSlice'
import { 
   setSocket, 
   setRole, 
   setGameId 
} from '@/redux/slices/game-online/socketSlice'
import '../../styles/insert-new-joiner-name.scss'
import ErrorPopUp from '@/components/ErrorPopUp'

let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameId } = params
   const [isLoading, setIsLoading] = useState(true)
   const [ gameFound, setGameFound ] = useState<boolean>(false)
   const [ currentPlayerInLobby, setCurrentPlayerInLobby ] = useState<string>('')
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   const { role } = useSelector((state: RootState) => state.socket) || 'guest'
   
   const handlePlayerNameChange = (role: string, event: React.ChangeEvent<HTMLInputElement>) => {
      if (role === 'guest') {
         dispatch(setPlayerNames([playerNames[0], event.target.value]))
      } else {
         dispatch(setPlayerNames([event.target.value]))
      }
   }

   const validatePlayerNames = () => {
      if (role === 'guest'){
         if (playerNames.some((name: string) => name.trim() === '')) {
            dispatch(setError({ isError: true, errorMessage: 'Please enter your name!' }))
            return false
         }
        
      } else {
         if(playerNames[0] === '') {
            dispatch(setError({ isError: true, errorMessage: 'Please enter your name!' }))
            return false
         }
      }
      return true
   }

   const joinGameLobby = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!validatePlayerNames()) {
         event.preventDefault()
         return
      }

      socket.emit('join-lobby-guest-request', 
         { 
            gameId,
            playerName: role === 'guest' ? playerNames[1] : playerNames[0] 
         }
      )
      
      socket.once('join-lobby-guest-response', (data) => {
         dispatch(setGameMode(data.gameSettings.gameMode))
         dispatch(setGameWin(data.gameSettings.gameWin))
         dispatch(setNumberOfLegs(data.gameSettings.numberOfLegs))
         if (data.host) {
            dispatch(setRole('host'))
            dispatch(setPlayerNames([playerNames[0]]))
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

         socket.once('check-if-game-exists-response', (data) => {
            if (data.exists) {
               setIsLoading(false)
               setGameFound(true)
               setCurrentPlayerInLobby(data.host)
               dispatch(setPlayerNames([data.host, '']))
               dispatch(setGameMode(data.settings.gameMode))
               dispatch(setGameWin(data.settings.gameWin))
               dispatch(setNumberOfLegs(data.settings.numberOfLegs))
               dispatch(setGameId(gameId))
            } else {
               setIsLoading(false)
               setGameFound(false)
            }
         })

         socket.once('host-left-response', () => {
            setCurrentPlayerInLobby('Host left! You are host now!')
            dispatch(setRole('host'))
            dispatch(setPlayerNames([playerNames[1]]))
         })     
      })
      
      return () => {
         socket.off('check-if-game-exists-response')
         socket.off('host-left-response')
      }

   }, [])

   useEffect(() => {
      console.log(playerNames)
   },[playerNames])
     
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
                        value={role === 'guest' ? playerNames[1] : playerNames[0]}
                        placeholder='Player name...' 
                        onChange={(e) => handlePlayerNameChange(role || 'guest', e)}
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
         < ErrorPopUp />
      </>
   )
}

export default GameOnlineRequest

