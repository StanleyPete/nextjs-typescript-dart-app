'use client'
import React, { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import PageNotFound from '@/components/game-online/PageNotFound'
import InsertNewJoinerName from '@/components/game-online/InsertNewJoinerName'

let socket: Socket

const GameOnlineRequest = ({ params }: { params: { gameId: string } }) => {
   const { gameId } = params
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
   
   }, [gameId])



   return (
      <>
         {gameExists ? (
            <InsertNewJoinerName /> 
         ) : (
            <PageNotFound /> 
         )}
      </>
   )

}

export default GameOnlineRequest

