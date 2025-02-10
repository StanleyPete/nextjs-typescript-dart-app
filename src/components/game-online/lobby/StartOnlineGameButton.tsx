'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { GuestReadyProp } from '@/types/components/componentsTypes'
import { setPlayers } from '@/redux/slices/game-online/gameOnlineSlice'

const StartOnlineGameButton:React.FC<GuestReadyProp> = ({ guestReady }) => {
   const router = useRouter()
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { playerNames, gameMode } = useSelector((state: RootState) => state.gameSettings)

   const handleStartGame = () => {
      if (socket && role === 'host' && guestReady) {
         socket.emit('start-game', { gameId })

         socket.once('game-start', () => {
            const gamePlayers = [
               {
                  name: playerNames[0],
                  legs: 0,
                  pointsLeft: Number(gameMode),
                  lastScore: 0,
                  average: 0,
               },
               {
                  name: playerNames[1],
                  legs: 0,
                  pointsLeft: Number(gameMode),
                  lastScore: 0,
                  average: 0,
               },
            ]
            dispatch(setPlayers(gamePlayers))
            router.push(`../game/${gameId}`)
         })
      }
   }
   
   return (
      <div className="game-start">
         <button
            className="game-start-button" 
            style={{
               filter: !guestReady ? 'brightness(0.6)' : 'none',
               boxShadow: !guestReady ? 'inset 0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.3)',
               cursor: !guestReady ? 'not-allowed' : 'pointer',
               transition: 'all 0.2s ease-in-out'
            }}
            disabled={!guestReady}
            onClick={handleStartGame}
         >
         Start game!
         </button>

      </div>
   )
}

export default StartOnlineGameButton
