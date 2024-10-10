'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Player {
   name: string
   pointsLeft: number
   lastScore: number
   totalThrows: number
   totalAttempts: number
   average: number
}

interface HistoryEntry {
   historyPlayerIndex: number
   historyPointsLeft: number
   historyLastScore: number
   historyLastAverage: number
}

const Game = () => {
   const router = useRouter()
   const searchParams = useSearchParams()

   //Declaring gameMode and players based on URL
   const gameMode = searchParams.get('mode')
   const urlPlayers: Player[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))

   // Players state declared with initial values in order to keep and update pointsLeft, lastScore, totalThrows, totalAttempts, average:
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map(player => ({
      ...player,
      pointsLeft: Number(player.pointsLeft), // Initial pointsLeft sent via URL
      lastScore: 0,
      totalThrows: 0,
      totalAttempts: 0, 
      average: 0    
   })))

   // State to track history of moves
   const [history, setHistory] = useState<HistoryEntry[]>([])
   // CurrentThrow state declared in order to temporarily keep score filled in the score input
   const [currentThrow, setCurrentThrow] = useState<number>(0)
   // CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
   // State to toggle between input and number buttons
   const [showNumberButtons, setShowNumberButtons] = useState<boolean>(false)
   // State to track total throws sum for current player when using buttons
   const [throwValueSum, setThrowValueSum] = useState<number>(0)
   // State to track throws count for each player when using buttons
   const [currentPlayerThrowsCount, setCurrentPlayerThrowsCount] = useState<number>(0)

   // Score input handler:
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }

   // Submit throw handler for input:
   const handleSubmitThrowInput = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]

      // Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft, // Points left before the throw
         historyLastScore: currentPlayer.lastScore, // lastScore before the throw
         historyLastAverage: currentPlayer.average
      }
      
      // PointsLeft, lastScore, totalThrows, totalAttempts update
      currentPlayer.pointsLeft -= currentThrow
      currentPlayer.lastScore = currentThrow
      currentPlayer.totalThrows += currentThrow
      currentPlayer.totalAttempts += 1
      
      //Average calculatation
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
      
      // Update history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      
      // Upade player's state
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

   //Submit score handler for buttons
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      
      currentPlayer.pointsLeft -= throwValue
      setThrowValueSum(prevSum => prevSum + throwValue)
      
      // Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft + throwValueSum + throwValue, // Points left before the throw
         historyLastScore: currentPlayer.lastScore, // The score just submitted
         historyLastAverage: currentPlayer.average
      }
      
      // Update the players state
      setPlayers(gamePlayers)
      
      // Incrementing the currentPlayerThrowsCount to keep track of the throws
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      if (updatedThrowCount < 3) {
         // Updating currentPlayerThrosCount when player has NOT thrown 3 times
         setCurrentPlayerThrowsCount(updatedThrowCount)
      } else {
         // Updating lastScore, totalThrows, totalAttempts when player has already thrown 3 times:
         currentPlayer.lastScore = throwValueSum + throwValue
         currentPlayer.totalThrows += throwValueSum + throwValue
         currentPlayer.totalAttempts += 1

         //Average calculation:
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts

         // Updating history state
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])
         setCurrentPlayerThrowsCount(0)
         
         // Switching to the next player
         const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
         setCurrentPlayerIndex(nextPlayerIndex)
         setThrowValueSum(0)
      }
   }
   
   // Restart game handler
   const handleRestartGame = () => {
      setPlayers(urlPlayers.map(player => ({
         ...player,
         pointsLeft: Number(player.pointsLeft),
         lastScore: 0, 
         totalThrows: 0,
         totalAttempts: 0,  
         average: 0     
      })))
      setCurrentPlayerIndex(0) // Reset to the first player
      setCurrentThrow(0) // Reset current throw input
      setHistory([]) // Reset history
      setThrowValueSum(0) //Reset throw value sum
      setCurrentPlayerThrowsCount(0) // Reset throw count
      setShowNumberButtons(false) // Reset to input view
   }

   // Undo handler
   const handleUndo = () => {
      if(history.length === 0) return
      
      //Declaring last history entry available
      const lastEntry = history[history.length - 1]

      const gamePlayers = [...players]

      // Update current player's state
      const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

      // Restoring pointsLeft, lastScore
      currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
      currentPlayer.lastScore = lastEntry.historyLastScore
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
            {players.map((player: { name: string, pointsLeft: number, lastScore: number, average: number }, index: number) => (
               <li key={index}>
                  {player.name} - Points Left: {player.pointsLeft}, Last Score: {player.lastScore}, Average: {player.average}
               </li>
            ))}
         </ul>

         {/*Score section:*/}
         <div>  
            <label>
               <p>Current player: {players[currentPlayerIndex].name}</p>
               {/* Toggle between input and number buttons */}
               <button onClick={() => setShowNumberButtons(!showNumberButtons)}>{showNumberButtons ? 'Input' : 'Buttons'}</button>
               {!showNumberButtons ? (
                  <div className='score-input'>
                     <input
                        type="number"
                        value={currentThrow}
                        onChange={(e) => handleThrowChange(e.target.value)}
                     />
                     <button onClick={() => handleSubmitThrowInput()}>Submit Score</button>
                  </div>
               ) : (
                  <div className='score-buttons'>
                     {Array.from({ length: 20 }, (_, i) => (
                        <button key={i + 1} onClick={() => handleSubmitThrowButtons(i + 1)}>{i + 1}</button>
                     ))}
                     <button onClick={() => handleSubmitThrowButtons(50)}>Bull - 50</button>
                     <button onClick={() => handleSubmitThrowButtons(25)}>Outer -25</button>
                  </div>
               )}   
            </label>
            <button onClick={handleUndo}>Undo</button>
         </div>

         <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
         <button onClick={handleRestartGame}>Restart game</button>
      </div>
   )
}
 
export default Game