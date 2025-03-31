'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { addGameOnlineStates } from '@/redux/store'
import { setPlayerNames, setError } from '@/redux/slices/gameSettingsSlice'
import ErrorPopUp from '@/components/ErrorPopUp'
import { socketService } from '@/socket/socket'
import '../../styles/insert-new-joiner-name.scss'
import Footer from '@/components/Footer'

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const dispatch = useDispatch()
   const router = useRouter()
   const { gameId } = params
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const isLoading = useSelector((state: RootState) => state.joinRoom?.isLoading) ?? true
   const gameFound = useSelector((state: RootState) => state.joinRoom?.gameFound) ?? false 
   const message = useSelector((state: RootState) => state.joinRoom?.message) ?? ''
   const currentPlayersInLobby = useSelector((state: RootState) => state.joinRoom?.currentPlayersInLobby) ?? []
   const isLobbyJoined = useSelector((state: RootState) => state.joinRoom?.isLobbyJoined) ?? false
 
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
      socketService.emitJoinLobby(gameId, playerNames[0])
   }
    
   useEffect(() => {
      addGameOnlineStates()
      socketService.connectAndJoinGame(gameId)
   }, [])

   useEffect(() => {
      if (isLobbyJoined) return router.replace(`/game-online/lobby/${gameId}`)
   }, [isLobbyJoined])

   useEffect(() => {
      if (message) return router.replace('/game-online/status')
   }, [message])


   return (
      <>
         {isLoading ? (
            <p style={{ color: 'white' }}>Loading...</p>
         ) : gameFound && (
            <div className='main-container'>
               <h1 className='game-online-header'>GAME ONLINE</h1>
               <p className='current-player-in-lobby'>
                  Current players in lobby: { currentPlayersInLobby.length > 0 
                     ? currentPlayersInLobby.join(', ') 
                     : 'None' }
               </p>
               <div className="players-section main-form">
                  <p className="players header">Enter your name:</p>
                  <div className="player-input">
                     <input
                        className='full-width'
                        type="text"
                        value={playerNames[0]}
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
               <Footer githubLogoSrc='/github-mark.svg'/>
            </div> )}
         < ErrorPopUp />
      </>
   )
}

export default GameOnlineRequest

