'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '@/redux/slices/gameSettingsSlice'

const StartOnlineGameButton= () => {
   const router = useRouter()
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { numberOfPlayers } = useSelector((state: RootState) => state.gameSettings)
   const { players } = useSelector((state: RootState) => state.gameOnline)
   
   const areAllPlayersReady = players.every(player => player.ready === true)
   const areAllPlayersInTheLobby = players.length === numberOfPlayers
   

   const handleStartGame = () => {
      if (!(areAllPlayersInTheLobby && areAllPlayersReady)) {
          dispatch(setError({ isError: true, errorMessage: 'You cannot start the game. ' }))
         return
      }
      if (role === 'host') {
         socket?.emit('start-game', { gameId })

         socket?.once('game-start', () => {
            
            router.push(`../game/${gameId}`)
         })
      }
   }
   
   return (
      <div className="game-start">
         <button
            className="game-start-button" 
            onClick={handleStartGame}
            disabled={!(areAllPlayersInTheLobby && areAllPlayersReady)}
         >
         Start game!
         </button>

      </div>
   )
}

export default StartOnlineGameButton
