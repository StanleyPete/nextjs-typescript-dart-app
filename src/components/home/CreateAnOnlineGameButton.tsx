'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

let socket: Socket

const CreateAnOnlineGameButton = () => {
   const router = useRouter()
   
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   const handleCreateOnlineGame = () => {
      if (!socket) {
         socket = io('http://localhost:3001')

         socket.on('connect', () => {
            console.log('Connected to WebSocket server with ID:', socket.id)
            socket.emit(
               'create-game', 
               { 
                  playerName: playerNames[0], 
                  clientId: socket.id 
               }
            )

            socket.on('game-created', (data) => {
               const { gameId } = data
               console.log(`Game created with ID: ${gameId}`)
               router.push(`/game-online/${gameId}`)
            })
            
         })

         socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server')
         })

         socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error)
         })
      } 
   }

   return (
      <button
         className="game-start-button"
         onClick={handleCreateOnlineGame}
      >
        Create an online game!
      </button>
   )
}

export default CreateAnOnlineGameButton
