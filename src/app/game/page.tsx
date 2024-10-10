'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Player {
   name: string
   pointsLeft: number
   lastThrow: number
   totalAttempts: number
   average: number
}

interface HistoryEntry {
   historyPlayerIndex: number
   historyPointsLeft: number
   historyLastThrow: number
   historyLastAverage: number
}

const Game = () => {
   const router = useRouter()
   const searchParams = useSearchParams()

   //Declaring gameMode and players based on URL
   const gameMode = searchParams.get('mode')
   const urlPlayers: Player[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))

   // Players state declared in order to keep and update pointsLeft, lastThrow, average:
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map(player => ({
      ...player,
      lastThrow: 0, // Initial lastThrow
      totalAttempts: 0, //Initial totalAttempts
      average: 0,    // Initial average
      pointsLeft: Number(player.pointsLeft) // Initial pointsLeft sent via URL
   })))

   // State to track history of moves
   const [history, setHistory] = useState<HistoryEntry[]>([])
   // CurrentThrow state declared in order to temporarily keep score filled in the score input
   const [currentThrow, setCurrentThrow] = useState<number>(0)
   // CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)

   // Score input handler:
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }

   // Submit throw handler:
   const handleSubmitThrow = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]

      // Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft, // Points left before the throw
         historyLastThrow: currentPlayer.lastThrow, // The score just submitted
         historyLastAverage: currentPlayer.average
      }
      
      // PointsLeft, lastThrow, totalAttempts update
      currentPlayer.pointsLeft -= currentThrow
      currentPlayer.lastThrow = currentThrow
      currentPlayer.totalAttempts += 1
      
      // Update history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
    
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
   
   // Restart game handler
   const handleRestartGame = () => {
      setPlayers(urlPlayers.map(player => ({
         ...player,
         lastThrow: 0,  // Reset lastThrow
         average: 0,     // Reset average
         pointsLeft: player.pointsLeft // Reset pointsLeft to initial state
      })))
      setCurrentPlayerIndex(0) // Reset to the first player
      setCurrentThrow(0) // Reset current throw input
      setHistory([])
   }

   // Undo handler
   const handleUndo = () => {
      if(history.length === 0) return
      
      //Declaring last history entry available
      const lastEntry = history[history.length - 1]

      const gamePlayers = [...players]

      // Update current player's state
      const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

      // Restoring pointsLeft, lastThrow
      currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
      currentPlayer.lastThrow = lastEntry.historyLastThrow
      currentPlayer.average = lastEntry.historyLastAverage

      //Updating players state
      setPlayers(gamePlayers) 
      
      // Removing last history entry
      setHistory(prevHistory => prevHistory.slice(0, -1))
      // Setting the last player who played
      setCurrentPlayerIndex(lastEntry.historyPlayerIndex) 
   }

   //Added for tests
   useEffect(() => {
      console.log(history)
   }, [history])
   

   return (
      <div>
         {/*Players section:*/}
         <h1>{gameMode}</h1>
         <ul>
            {players.map((player: { name: string, pointsLeft: number, lastThrow: number, average: number }, index: number) => (
               <li key={index}>
                  {player.name} - Points Left: {player.pointsLeft}, Last Throw: {player.lastThrow}, Average: {player.average}
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
            <button onClick={handleUndo}>Undo</button>
         </div>

         <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
         <button onClick={handleRestartGame}>Restart game</button>
      </div>
   )
}
 
export default Game