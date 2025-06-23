'use client'
import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { socketService } from '@/socket/socket'

const StartOnlineGameButton= () => {
   const dispatch = useDispatch()
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const numberOfPlayers = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   const players =  useSelector((state: RootState) => state.gameOnline.players)
   const areAllPlayersReady = players.every(player => player.ready === true)
   const areAllPlayersInTheLobby = players.length === numberOfPlayers
   
   const handleStartGame = () => {
      if (!(areAllPlayersInTheLobby && areAllPlayersReady)) return dispatch(setError({ isError: true,  errorMessage: 'All players have to join the game and declare their readiness.' 
      }))
         
      if (role === 'host') return socketService.emitStartGame(gameId)
   }

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (focusedSection === 'startOnlineGameButton' && event.key === 'Enter') {
            handleStartGame()
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection])
   
   return (
      <div className="game-start">
         <button
            className={`game-start-button  ${focusedSection === 'startOnlineGameButton' ? 'focused' : ''}`} 
            onClick={handleStartGame}
         >
         Start game!
         </button>

      </div>
   )
}

export default StartOnlineGameButton
