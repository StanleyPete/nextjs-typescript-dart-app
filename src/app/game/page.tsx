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
   isInputPreffered: boolean
}

interface HistoryEntry {
   historyPlayerIndex: number
   historyPointsLeft: number
   historyLastScore: number
   historyTotalThrows: number
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
      average: 0,
      isInputPreffered: true   
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
   // State to track current player throw value and display it in current throw section
   const [currentPlayerThrows, setCurrentPlayerThrows] = useState<number[]>([])
   // State to set multiplier for buttons (single, double, triple)
   const [multiplier, setMultiplier] = useState<number>(1)
   
   // Score input handler:
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }
   
   // Next player handler:
   const handleSwitchPlayer = () => {
      /* 
      Switch to another player: 
      //Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
      after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
      setCurrentPlayerIndex(nextPlayerIndex)
   }

   // Submit score handler for input:
   const handleSubmitThrowInput = () => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]

      // Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft, 
         historyTotalThrows: currentPlayer.totalThrows + currentThrow,
         historyLastScore: currentPlayer.lastScore,
         historyLastAverage: currentPlayer.average
      }
      
      // PointsLeft, lastScore, totalThrows, totalAttempts update
      currentPlayer.pointsLeft -= currentThrow
      currentPlayer.lastScore = currentThrow
      currentPlayer.totalThrows += currentThrow
      currentPlayer.totalAttempts += 1
      currentPlayer.isInputPreffered = true
      
      //Average calculatation
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
      
      // Updating history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      
      // Upadating player's state
      setPlayers(gamePlayers)
      
      // Switching to the next player
      handleSwitchPlayer()
     
      // Resetting input value
      setCurrentThrow(0)
   }

   //Submit score handler for buttons
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      const multiplierThrowValue = throwValue * multiplier
      
      // Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft + throwValueSum,
         historyTotalThrows: throwValueSum + multiplierThrowValue, 
         historyLastScore: currentPlayer.lastScore,
         historyLastAverage: currentPlayer.average
      }
      
      // Incrementing the currentPlayerThrowsCount to keep track of the throws
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      if (updatedThrowCount < 3) {
         // Updating pointsLeft, totalThrows and states when player has NOT thrown 3 times
         currentPlayer.pointsLeft -= multiplierThrowValue
         currentPlayer.totalThrows += multiplierThrowValue
         setThrowValueSum(prevSum => prevSum + multiplierThrowValue)
         setCurrentPlayerThrows(prevThrows => [...prevThrows, multiplierThrowValue].slice(-3))
         setCurrentPlayerThrowsCount(updatedThrowCount)
         setCurrentThrow(0)
      } else {
         // Updating pointsLeft, lastScore, totalThrows, totalAttempts when player has already thrown 3 times:
         currentPlayer.pointsLeft -= multiplierThrowValue
         currentPlayer.lastScore = throwValueSum + multiplierThrowValue
         currentPlayer.totalThrows += multiplierThrowValue
         currentPlayer.totalAttempts += 1
         
         //Average calculation:
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
         
         // Updating history state
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Resetting states:
         setThrowValueSum(0)
         setCurrentPlayerThrowsCount(0)
         setCurrentPlayerThrows([])
         setCurrentThrow(0)
         
         //Switching to the next player
         handleSwitchPlayer()
      }

      // Updating  player's state
      setPlayers(gamePlayers)
   }
   
   // Undo handler
   const handleUndo = () => {
      const lastEntry = history[history.length - 1]
      const gamePlayers = [...players]
      
      //Undo handler for input
      if(!showNumberButtons){
         if(history.length === 0) return
         
         const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]
         
         // Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
         currentPlayer.totalThrows -= currentPlayer.lastScore
         currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
         currentPlayer.lastScore = lastEntry.historyLastScore
         currentPlayer.average = lastEntry.historyLastAverage
         currentPlayer.totalAttempts -= 1
         
         // Setting currentPlayerIndex to the last player who played in the history
         setCurrentPlayerIndex(lastEntry.historyPlayerIndex) 
         
         // Removing last history entry
         setHistory(prevHistory => prevHistory.slice(0, -1))
      }
      
      //Undo handler for buttons
      if(showNumberButtons){
         //SCENARIO 1: Empty history, currentPlayerThrowCount !== 0
         if(history.length === 0 && currentPlayerThrowsCount !== 0){
            const currentPlayer = gamePlayers[currentPlayerIndex]
            
            //Temporary variables with updated throw count and throws array
            const updatedThrowCount = currentPlayerThrowsCount - 1
            const updatedThrows = [...currentPlayerThrows]
            
            //Updating pointsLeft, totalThrows and throwValueSum
            currentPlayer.pointsLeft += updatedThrows[updatedThrows.length -1]
            currentPlayer.totalThrows -= updatedThrows[updatedThrows.length -1]
            setThrowValueSum(prevSum => prevSum - currentPlayerThrows[currentPlayerThrows.length -1])
            
            // Removing last available throw from temporary variable
            updatedThrows.pop()
            
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            setCurrentPlayerThrows(updatedThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         } 
         //SCENARIO 2: Empty history
         else if (history.length === 0){
            return
         } 
         //SCENARIO 3: History available and no currentPlayerThrowsCount
         else if (history.length !== 0 && currentPlayerThrowsCount === 0){
            const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]
            
            // Restoring pointsLeft, lastScore, average
            currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
            currentPlayer.lastScore = lastEntry.historyLastScore
            currentPlayer.average = lastEntry.historyLastAverage
            currentPlayer.totalThrows -= lastEntry.historyTotalThrows
            currentPlayer.totalAttempts -= 1
            
            // Removing last history entry
            setHistory(prevHistory => prevHistory.slice(0, -1))
            
            // Setting currentPlayerIndex to the last player who played in the history
            setCurrentPlayerIndex(lastEntry.historyPlayerIndex) 
         }
         //SCENARIO 4: History availble and currentPlayer has already thrown at least once 
         else {
            const currentPlayer = gamePlayers[currentPlayerIndex]
            
            //Temporary variables with updated throw count and throws array
            const updatedThrowCount = currentPlayerThrowsCount - 1
            const updatedThrows = [...currentPlayerThrows]
            
            //Updating pointsLeft, totalThrows and throwValueSum
            currentPlayer.pointsLeft += updatedThrows[updatedThrows.length -1]
            currentPlayer.totalThrows -= updatedThrows[updatedThrows.length -1]
            setThrowValueSum(prevSum => prevSum - currentPlayerThrows[currentPlayerThrows.length -1])
            
            // Removing last available throw from temporary variable
            updatedThrows.pop()
   
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            setCurrentPlayerThrows(updatedThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         }
      }
      
      //Updating players state
      setPlayers(gamePlayers) 
   }
   
   // Restart game handler
   const handleRestartGame = () => {
      setPlayers(urlPlayers.map(player => ({
         ...player,
         pointsLeft: Number(player.pointsLeft),
         lastScore: 0, 
         totalThrows: 0,
         totalAttempts: 0,  
         average: 0,
         isInputPreffered: true    
      })))
      setCurrentPlayerIndex(0) 
      setCurrentThrow(0) 
      setHistory([]) 
      setThrowValueSum(0) 
      setCurrentPlayerThrowsCount(0) 
   }

   useEffect(() => {
      if (players[currentPlayerIndex].isInputPreffered) {
         setShowNumberButtons(false)
      } else {
         setShowNumberButtons(true)
      }
      console.log(history)
      console.log(players)
   }, [players, history, players[currentPlayerIndex].isInputPreffered, currentPlayerIndex])

   return (
      <div>
         {/*Players section:*/}
         <h1>{gameMode}</h1>
         <ul>
            {players.map((player: { name: string, pointsLeft: number, lastScore: number, average: number, isInputPreffered: boolean }, index: number) => (
               <li key={index}>
                  {player.name} - Points Left: {player.pointsLeft}, Last Score: {player.lastScore}, Average: {player.average}, isInputPreffered: {`${player.isInputPreffered}`}
               </li>
            ))}
         </ul>

         {/*Score section:*/}
         <div>  
            <label>
               <p>Current player: {players[currentPlayerIndex].name}</p>
               {/*Current throws section:*/}
               {showNumberButtons && (
                  <div className="current-player-throws">
                     <p>Throws:</p>
                     <div>
                        {Array.from({ length: 3 }, (_, i) => (
                           <span key={i}>
                              {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                           </span>
                        ))}
                     </div>
                  </div>
               )}
               {/* Toggle between input and number buttons */}
               <button onClick={() => {
                  {/* Resetting values when toggle button clicked */}
                  const gamePlayers = [...players]
                  const currentPlayer = gamePlayers[currentPlayerIndex]
                  if (currentPlayerThrowsCount > 0) {
               
                     //Resetting pointsLeft and totalThrows values
                     currentPlayer.pointsLeft += throwValueSum
                     currentPlayer.totalThrows -= throwValueSum
               
                     // Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
                     setThrowValueSum(0)
                     setCurrentPlayerThrows([])
                     setCurrentPlayerThrowsCount(0)         
                  }
                  
                  //Switching isInputPreffered
                  currentPlayer.isInputPreffered = !currentPlayer.isInputPreffered
                  //Updating player's state
                  setPlayers(gamePlayers)    
               }}>
                  {showNumberButtons ? 'Input' : 'Buttons'}
               </button>
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
                     {/* Multiplier buttons */}
                     <div className="multiplier-buttons">
                        <button onClick={() => setMultiplier(1)} className={multiplier === 1 ? 'active' : ''}>Single</button>
                        <button onClick={() => setMultiplier(2)} className={multiplier === 2 ? 'active' : ''}>Double</button>
                        <button onClick={() => setMultiplier(3)} className={multiplier === 3 ? 'active' : ''}>Triple</button>
                     </div>
                     {/* Score buttons */}
                     {Array.from({ length: 20 }, (_, i) => (
                        <button key={i + 1} onClick={() => handleSubmitThrowButtons(i + 1)}>{i + 1}</button>
                     ))}
                     <button onClick={() => handleSubmitThrowButtons(50)}>Bull - 50</button>
                     <button onClick={() => handleSubmitThrowButtons(25)}>Outer -25</button>
                     <button onClick={() => handleSubmitThrowButtons(0)}>0</button>
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