'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import io, { Socket } from 'socket.io-client'

let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const { gameId } = params
   const router = useRouter()
   const [gameExists, setGameExists] = useState<boolean>(false)
    

   useEffect(() => {
      if (!socket) {
         socket = io('http://localhost:3001')
      }
      console.log(`To jest params z [gameId]/page.tsx: ${params}`)

      socket.emit('check-if-game-exists', { gameId })

      socket.on('game-exists', (data) => {
         if (data.exists) {
            setGameExists(true)
            console.log('Game Exists')
         } else {
            setGameExists(false)
            console.log('Game Do not exists')
         }
      })

      return () => {
         socket.disconnect()
         socket = null
      }
   }, [gameId])

   if (gameExists) {
      return <p>Loading...</p>
   }

   if (!gameExists) {
      return <p>Game not found. Please check the URL or create a new game.</p>
   }

}

export default GameOnlineRequest

