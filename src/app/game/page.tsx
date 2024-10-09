'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Player {
   name: string
   pointsLeft: number
   lastThrow: number
   average: number
}

const Game = () => {
   const router = useRouter()
   const searchParams = useSearchParams()

   //Declaring gameMode and players based on URL
   const gameMode = searchParams.get('mode') || 'default'
   const urlPlayers: Player[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))

   // Players state declared in order to keep and update pointsLeft, lastThrow, average:
   const [players, setPlayers] = useState<Player[]>(urlPlayers)
   // CurrentThrow state declared in order to temporarily keep score filled in the score input
   const [currentThrow, setCurrentThrow] = useState<number>(0)
   // CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)

   // Funkcja do obsługi zmiany wartości inputu
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }

   // Submit throw handler:
   const handleSubmitThrow = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]

      // PointsLeft and lastThorw update:
      currentPlayer.lastThrow = currentThrow
      currentPlayer.pointsLeft -= currentThrow

      setPlayers(gamePlayers)

      /* 
      Switch to another player: 
      //Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
      after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length 
      setCurrentPlayerIndex(nextPlayerIndex)

      // Resetting input value
      setCurrentThrow(0)
   }


   return (
      <div>
         {/*Players section:*/}
         <h1>{gameMode}</h1>
         <ul> {players.map((player, index: number) => (
            <li key={index}>
               {player.name} - points left: {player.pointsLeft}, Last Throw: {player.lastThrow}, Average: {player.average}
            </li>
         ))}
         </ul>

         {/*Score section:*/}
         <div>
            
            <label>
               <p>Current player: {players[currentPlayerIndex].name}</p>
               <input
                  type="number"
                  value={currentThrow}
                  onChange={(e) => handleThrowChange(e.target.value)}
               />
            </label>
            <button onClick={handleSubmitThrow}>Submit Score</button>
         </div>

         <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
         <button>Restart game</button>
      </div>
   )
}
 
export default Game