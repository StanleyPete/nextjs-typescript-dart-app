'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState, addSocketState  } from '@/redux/store'
import { setSocket } from '@/redux/slices/game-online/socketSlice'

let socket: Socket

const CreateAnOnlineGameButton = () => {
   const router = useRouter()
   const dispatch = useDispatch()
   
   const { playerNames, gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)

   const handleCreateOnlineGame = () => {
      if (!socket) {
         socket = io('http://localhost:3001')

         //Add socket state to redux
         addSocketState()

         //Connection listener
         socket.on('connect', () => {
            //Updating socket state in redux
            dispatch(setSocket(socket))
            
            //Create game emitter
            socket.emit('create-game', 
               { 
                  clientId: socket.id, 
                  playerName: playerNames[0],
                  settings: {
                     gameMode,
                     gameWin,
                     numberOfLegs
                  } 
               }
            )

            socket.on('game-created', (data) => {
               const { gameId } = data
               // console.log(`Game created with ID: ${gameId}`)
               router.push(`/game-online/lobby/${gameId}`)
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
