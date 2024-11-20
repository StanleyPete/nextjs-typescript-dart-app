'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import GamePlayersSectionRegular from '@/components/GamePlayersSectionRegular'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'

interface Player {
   name: string
   legs: number
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
   historyTotalAttempts: number
}

const Game = () => {
   const router = useRouter()
   const searchParams = useSearchParams()
   
   //Declaring gameMode, gameWinType, numberOfLegs and players based on URL
   const gameMode = searchParams.get('mode')
   const gameWinType = searchParams.get('game-win-type')
   const numberOfLegs = searchParams.get('number-of-legs')
   const urlPlayers: string[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))

   //Players state declared with initial values in order to keep and update pointsLeft, lastScore, totalThrows, totalAttempts, average:
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map((playerName: string) => ({
      name: playerName,
      pointsLeft: Number(gameMode), // Initial pointsLeft sent via URL
      legs: 0,
      lastScore: 0,
      totalThrows: 0,
      totalAttempts: 0, 
      average: 0,
      isInputPreffered: true   
   })))

   //State to track history of moves
   const [history, setHistory] = useState<HistoryEntry[]>([])
   //CurrentThrow state declared in order to temporarily keep score filled in the score input
   const [currentThrow, setCurrentThrow] = useState<number>(0)
   //CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
   //State to track which player starts the leg
   const [startPlayerIndex, setStartPlayerIndex] = useState<number>(0)
   //State to toggle between input and number buttons
   const [showNumberButtons, setShowNumberButtons] = useState<boolean>(false)
   //State to track total throws sum for current player when using buttons
   const [throwValueSum, setThrowValueSum] = useState<number>(0)
   //State to track throws count for each player when using buttons
   const [currentPlayerThrowsCount, setCurrentPlayerThrowsCount] = useState<number>(0)
   //State to track current player throw value and display it in current throw section
   const [currentPlayerThrows, setCurrentPlayerThrows] = useState<number[]>([])
   //State to set multiplier for buttons (single, double, triple)
   const [multiplier, setMultiplier] = useState<number>(1)
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')
   //State to turn on double points for input handler
   const [isDoubleActive, setIsDoubleActive] = useState<boolean>(false)
   //State to check if game ends
   const [isGameEnd, setIsGameEnd] = useState<boolean>(false)
   //State to set winner of the game
   const [winner, setWinner] = useState<Player | null>(null)
   //State to track if the sound is on/off
   const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true)
   //State to track if initial sound message ('game is on') has been played
   const [initialSoundPlayed, setInitialSoundPlayed] = useState<boolean>(false)
   
   
   //SCORE INPUT HANDLER
   const handleThrowChange = (value: string) => {
      setCurrentThrow(Number(value))
   }
   
   //NEXT PLAYER HANDLER
   const handleSwitchPlayer = () => {
      /* Switch to another player: 
         Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
         after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
      setCurrentPlayerIndex(nextPlayerIndex)
   }

   //NEXT PLAYER WHO STARTS THE LEG HANDLER
   const handleStartPlayerIndex = () => {
      setStartPlayerIndex(prevIndex => (prevIndex + 1) % players.length)
   }

   //SOUND EFFECT HANDLER
   const playSound = (fileName: string) => {
      if(isSoundEnabled){
         const audio = new Audio(`/sounds/${fileName}.mp3`)
         audio.play().catch(error => console.log('Error:', error))
      }
   }

   //SOUND TOGGLE HANDLER
   const toggleSound = () => {
      setIsSoundEnabled(prev => !prev)
   }

   //SUBMIT SCORE HANDLER FOR INPUT
   const handleSubmitThrowInput = (inputMultiplier: number) => {
      const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      
      //Error hanlder (currentThrow over 180)
      if(currentThrow > 180){
         setErrorMessage('Score higher than 180 is not possible')
         setIsError(true)
         setCurrentThrow(0)
         return
      }

      if(invalidScores.includes(currentThrow)){
         setErrorMessage(`${currentThrow} is not possible`)
         setIsError(true)
         setCurrentThrow(0)
         return
      }

      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft, 
         historyTotalThrows: currentPlayer.totalThrows + (currentThrow * inputMultiplier),
         historyLastScore: currentPlayer.lastScore,
         historyLastAverage: currentPlayer.average,
         historyTotalAttempts: currentPlayer.totalAttempts
      }
      
      //Updating pointsLeft
      currentPlayer.pointsLeft -= (currentThrow * inputMultiplier)
      
      //End leg scenario
      if(isDoubleActive && currentPlayer.pointsLeft === 0) {
         // Additional history entries created if leg ends in order to properly Undo handler usage 
         const newHistoryEntries = players
            .map((player, index) => {
               if (index === currentPlayerIndex) {
                  return null //NewHistoryEntry not created for currentPlayerIndex!
               }
               return {
                  historyPlayerIndex: index, 
                  historyPointsLeft: player.pointsLeft, 
                  historyTotalThrows: player.totalThrows, 
                  historyLastScore: player.lastScore, 
                  historyLastAverage: player.average, 
                  historyTotalAttempts: player.totalAttempts 
               }
            })
            .filter(entry => entry !== null) //Skipping currentPlayerIndex (null)

         //Updating history with additional history entries
         setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])
         
         //Updating legs for current player
         currentPlayer.legs += 1
         
         //Updating game stats for new leg (for each player)
         players.forEach(player => {
            player.pointsLeft = Number(gameMode)
            player.lastScore = 0
            player.totalThrows = 0
            player.totalAttempts = 0
            player.average = 0
            player.isInputPreffered = true
         })

         //Updating history state with currentPlayerIndex
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Upadating player's state
         setPlayers(gamePlayers) 

         //Switching to next player who start the leg
         handleStartPlayerIndex()

         //Setting current player index:
         setCurrentPlayerIndex((startPlayerIndex + 1) % players.length)

         //End game check
         checkGameEndHandler()

         //Resetting isDoubleActive state
         setIsDoubleActive(false)

         //Resetting input value
         setCurrentThrow(0)
         
         return
      }

      //Scenario when updated pointsLeft are equal or less than 1
      if(currentPlayer.pointsLeft <= 1){
         //Updating historyTotalThrows
         newHistoryEntry.historyTotalThrows = currentPlayer.totalThrows

         //Updating pointsLeft, lastScore, totalThrows, totalAttempts and average
         currentPlayer.pointsLeft += (currentThrow * inputMultiplier)
         currentPlayer.lastScore = 0
         currentPlayer.totalThrows += 0
         currentPlayer.totalAttempts += 1
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts

         //Updating history state
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Upadating player's state
         setPlayers(gamePlayers)

         //Sound effect
         playSound('no-score')

         //Switching to the next player
         handleSwitchPlayer()

         //Resetting input value
         setCurrentThrow(0)

         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average
      currentPlayer.lastScore = (currentThrow * inputMultiplier)
      currentPlayer.totalThrows += (currentThrow * inputMultiplier)
      currentPlayer.totalAttempts += 1
      currentPlayer.isInputPreffered = true
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
      
      //Updating history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])
      
      //Upadating player's state
      setPlayers(gamePlayers)

      //Sound effect
      if (currentThrow === 0) {
         playSound('no-score')
      } else {
         playSound(currentThrow.toString())
      }
      
      //Switching to the next player
      handleSwitchPlayer()
     
      //Resetting input value
      setCurrentThrow(0)
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gamePlayers = [...players]
      const currentPlayer = gamePlayers[currentPlayerIndex]
      const multiplierThrowValue = throwValue * multiplier
      
      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft + throwValueSum,
         historyTotalThrows: currentPlayer.totalThrows + multiplierThrowValue, 
         historyLastScore: currentPlayer.lastScore,
         historyLastAverage: currentPlayer.average,
         historyTotalAttempts: currentPlayer.totalAttempts
      }
      
      // Incrementing the currentPlayerThrowsCount to keep track of the throws
      const updatedThrowCount = currentPlayerThrowsCount + 1
      
      //Scenario when player has not thrown 3 times yet
      if (updatedThrowCount < 3) {
         //Updating pointsLeft
         currentPlayer.pointsLeft -= multiplierThrowValue

         //End leg scenario when player has NOT thrown 3 times yet, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentPlayer.pointsLeft === 0){
            const newHistoryEntries = players
               .map((player, index) => {
                  if (index === currentPlayerIndex) {
                     return null //NewHistoryEntry not created for currentPlayerIndex
                  }
                  return {
                     historyPlayerIndex: index, 
                     historyPointsLeft: player.pointsLeft, 
                     historyTotalThrows: player.totalThrows, 
                     historyLastScore: player.lastScore, 
                     historyLastAverage: player.average, 
                     historyTotalAttempts: player.totalAttempts 
                  }
               })
               .filter(entry => entry !== null) //Skipping currentPlayerIndex (null)

            //Updating history with additional history entries
            setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])
            
            //Updating legs
            currentPlayer.legs += 1 

            //Updating game stats for new leg (for each player)
            players.forEach(player => {
               player.pointsLeft = Number(gameMode)
               player.lastScore = 0
               player.totalThrows = 0
               player.totalAttempts = 0
               player.average = 0
               player.isInputPreffered = true
            })
            
            //Updating history state
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Switching to next player who start the leg
            handleStartPlayerIndex()

            //Setting current player index:
            setCurrentPlayerIndex((startPlayerIndex + 1) % players.length)

            //Updating player's state
            setPlayers(gamePlayers) 

            //Checking game end
            checkGameEndHandler()

            //Resetting states
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setCurrentThrow(0)

            return
         }

         //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
         if(currentPlayer.pointsLeft <= 1) {
            currentPlayer.pointsLeft = newHistoryEntry.historyPointsLeft
            currentPlayer.lastScore = 0
            currentPlayer.totalThrows -= throwValueSum
            currentPlayer.totalAttempts += 1
            currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Sound effect:
            playSound('no-score')

            //Switching to the next player:
            handleSwitchPlayer()

            //Resetting states
            setCurrentThrow(0)
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)

            //Updating players state
            setPlayers(gamePlayers) 

            return
         }

         //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
         currentPlayer.totalThrows += multiplierThrowValue
         setThrowValueSum(prevSum => prevSum + multiplierThrowValue)
         setCurrentPlayerThrows(prevThrows => [...prevThrows, multiplierThrowValue].slice(-3))
         setCurrentPlayerThrowsCount(updatedThrowCount)
         setCurrentThrow(0)
      } 
      //Scenario when players has thrown already 3 times
      else {
         //Updating pointsLeft
         currentPlayer.pointsLeft -= multiplierThrowValue
         
         //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentPlayer.pointsLeft === 0){
            const newHistoryEntries = players
               .map((player, index) => {
                  if (index === currentPlayerIndex) {
                     return null //NewHistoryEntry not created for currentPlayerIndex
                  }
                  return {
                     historyPlayerIndex: index, 
                     historyPointsLeft: player.pointsLeft, 
                     historyTotalThrows: player.totalThrows, 
                     historyLastScore: player.lastScore, 
                     historyLastAverage: player.average, 
                     historyTotalAttempts: player.totalAttempts 
                  }
               })
               .filter(entry => entry !== null) //Skipping currentPlayerIndex (null)

            //Updating history with additional history entries
            setHistory(prevHistory => [...prevHistory, ...newHistoryEntries])
            currentPlayer.legs += 1 

            //Updating game stats for new leg (for each player)
            players.forEach(player => {
               player.pointsLeft = Number(gameMode)
               player.lastScore = 0
               player.totalThrows = 0
               player.totalAttempts = 0
               player.average = 0
               player.isInputPreffered = true
            })
            
            //Updating history state
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])

            //Switching to next player who start the leg
            handleStartPlayerIndex()

            //Setting current player index:
            setCurrentPlayerIndex((startPlayerIndex + 1) % players.length)

            //Checking game end
            checkGameEndHandler()

            //Resetting states
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setCurrentThrow(0)
            setPlayers(gamePlayers) 
            return
         }

         //Scenario when player has already thrown 3 times, but pointsLeft are equal or less than 1
         if(currentPlayer.pointsLeft <= 1) {
            currentPlayer.pointsLeft += multiplierThrowValue
            currentPlayer.lastScore = 0
            currentPlayer.totalThrows -= throwValueSum
            currentPlayer.totalAttempts += 1
            currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
            setHistory(prevHistory => [...prevHistory, newHistoryEntry])
            playSound('no-score')
            handleSwitchPlayer()
            setThrowValueSum(0)
            setCurrentPlayerThrowsCount(0)
            setCurrentPlayerThrows([])
            setCurrentThrow(0)
            setPlayers(gamePlayers) 
            return
         }

         //Updating lastScore, totalThrows, totalAttempts, average when player has already thrown 3 times:
         currentPlayer.lastScore = throwValueSum + multiplierThrowValue
         currentPlayer.totalThrows += multiplierThrowValue
         currentPlayer.totalAttempts += 1
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
         
         //Updating history state
         setHistory(prevHistory => [...prevHistory, newHistoryEntry])

         //Sound effect:
         playSound((throwValueSum + multiplierThrowValue).toString())

         //Resetting states:
         setThrowValueSum(0)
         setCurrentPlayerThrowsCount(0)
         setCurrentPlayerThrows([])
         setCurrentThrow(0)
         
         //Switching to the next player
         handleSwitchPlayer()
      }

      //Updating  player's state
      setPlayers(gamePlayers)
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS 
   /*
      (for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value)
   */
   const handleSubmitScoreButtons = () => {
      const updatedPlayers = [...players]
      const currentPlayer = updatedPlayers[currentPlayerIndex]

      const throwSum = currentPlayerThrows.reduce((acc, throwValue) => acc + throwValue, 0)

      //Creating newHistoryEntry
      const newHistoryEntry: HistoryEntry = {
         historyPlayerIndex: currentPlayerIndex,
         historyPointsLeft: currentPlayer.pointsLeft + throwSum,
         historyTotalThrows: currentPlayer.totalThrows, 
         historyLastScore: currentPlayer.lastScore,
         historyLastAverage: currentPlayer.average,
         historyTotalAttempts: currentPlayer.totalAttempts
      }
      
      //Updating lastScore and totalAttempts
      currentPlayer.lastScore = throwSum
      currentPlayer.totalAttempts += 1

      //Average calculation:
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts

      //Updating history state
      setHistory(prevHistory => [...prevHistory, newHistoryEntry])

      //Sound-effect
      if(throwSum === 0){
         playSound('no-score')
      } else {
         playSound(throwSum.toString())
      }
      
      //Resetting states
      setThrowValueSum(0)
      setCurrentPlayerThrows([]) 
      setCurrentPlayerThrowsCount(0)
      setCurrentThrow(0)

      //Switching to the next player
      handleSwitchPlayer()
      
      //Updating player's state
      setPlayers(updatedPlayers)
   }
   
   //UNDO HANDLER
   const handleUndo = () => {
      const lastEntry = history[history.length - 1]
      const gamePlayers = [...players]

      //Scenario when players have just finished previous leg
      if(history.length !== 0 && lastEntry.historyTotalThrows === Number(gameMode)){
         const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

         currentPlayer.legs -= 1

         //Updating game stats for each player
         gamePlayers.forEach((player, index) => {
            const playerHistory = [...history].reverse().find(entry => entry.historyPlayerIndex === index)
            if (playerHistory) {
               player.pointsLeft = playerHistory.historyPointsLeft
               player.lastScore = playerHistory.historyLastScore
               player.totalThrows = playerHistory.historyTotalThrows === Number(gameMode) ? playerHistory.historyTotalThrows - playerHistory.historyLastScore : playerHistory.historyTotalThrows
               player.totalAttempts = playerHistory.historyTotalAttempts
               player.average = playerHistory.historyLastAverage
            }
         })

         //Setting currentPlayerIndex to the last player who played in the history
         setCurrentPlayerIndex(lastEntry.historyPlayerIndex) 

         //Removing last history entries (inlcuding additional entries created when player finished leg)
         setHistory(prevHistory => prevHistory.slice(0, prevHistory.length - gamePlayers.length))

         //Updating players state
         setPlayers(gamePlayers) 

         return
      }
      
      //Undo handler for input
      if(!showNumberButtons){
         if(history.length === 0) return
         
         const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

         //Restoring pointsLeft, lastScore, average, totalAttempts, totalThrows
         currentPlayer.totalThrows -= currentPlayer.lastScore
         currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
         currentPlayer.lastScore = lastEntry.historyLastScore
         currentPlayer.average = lastEntry.historyLastAverage
         currentPlayer.totalAttempts = lastEntry.historyTotalAttempts
         
         //Setting currentPlayerIndex to the last player who played in the history
         setCurrentPlayerIndex(lastEntry.historyPlayerIndex) 
         
         //Removing last history entry
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
            
            //Removing last available throw from temporary variable
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
            
            //Restoring pointsLeft, lastScore, average
            currentPlayer.pointsLeft = lastEntry.historyPointsLeft 
            currentPlayer.lastScore = lastEntry.historyLastScore
            currentPlayer.average = lastEntry.historyLastAverage
            currentPlayer.totalThrows = lastEntry.historyTotalThrows
            currentPlayer.totalAttempts = lastEntry.historyTotalAttempts
            
            //Removing last history entry
            setHistory(prevHistory => prevHistory.slice(0, -1))
            
            //Setting currentPlayerIndex to the last player who played in the history
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
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
   
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            setCurrentPlayerThrows(updatedThrows)
            setCurrentPlayerThrowsCount(updatedThrowCount)
         }
      }
      
      //Updating players state
      setPlayers(gamePlayers) 
   }

   //GAME END HANDLER
   const checkGameEndHandler = () => {
      //Scenario when game type is set to best-of
      if (gameWinType === 'best-of') {
         //Sum of legs for all players
         const totalLegs = players.reduce((acc, player) => acc + player.legs, 0)
         
         //Check if totalLegs for players equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            //Finding winner player
            const maxLegs = Math.max(...players.map(player => player.legs))
            const winner = players.find(player => player.legs === maxLegs) || null
            setIsGameEnd(true)
            setWinner(winner)
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }      
      }
      //Scenario when game type is set to first-to
      else if (gameWinType === 'first-to') {
         //Finding winner player
         const winner = players.find(player => player.legs === Number(numberOfLegs)) || null
         if(winner){
            setIsGameEnd(true)
            setWinner(winner)
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }
      }
   }
   
   //RESTART GAME HANDLER
   const handleRestartGame = () => {
      setPlayers(urlPlayers.map((playerName: string) => ({
         name: playerName,
         pointsLeft: Number(gameMode),
         legs: 0,
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

      if(isGameEnd){
         setIsGameEnd(false)
         setWinner(null)
      }
   }

   //ERROR CLOSE HANDLER
   const closeError = () => {
      setIsError(false)
   }

   useEffect(() => {
      if (players[currentPlayerIndex].isInputPreffered) {
         setShowNumberButtons(false)
      } else {
         setShowNumberButtons(true)
      }

      if(!initialSoundPlayed){
         playSound('game-is-on')
         setInitialSoundPlayed(true)
      }

      console.log(history)
      console.log(players)
   }, [players, history, players[currentPlayerIndex].isInputPreffered, currentPlayerIndex, initialSoundPlayed])

   return (
      <div className='game-container'>
         {/*Game players section component */}
         <GamePlayersSectionRegular 
            players={players} 
            currentPlayerIndex={currentPlayerIndex} 
         />
           
         <CurrentPlayerThrowParagraph
            isSoundEnabled={isSoundEnabled}
            toggleSound={toggleSound}
            currentPlayerName={players[currentPlayerIndex].name}
         />

         {/*Main score input section (input/buttons toggle, score preview, submit score button, score buttons ):*/}
         <div className='score-section'> 

            {/*Current throws section:*/}
            <div className="throw-value-section">

               {/* Toggle between input and number buttons */}
               <button 
                  className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
                  onClick={() => {
                     //Resetting values when toggle button clicked
                     const gamePlayers = [...players]
                     const currentPlayer = gamePlayers[currentPlayerIndex]
                     if (currentPlayerThrowsCount > 0) {
                  
                        //Resetting pointsLeft and totalThrows values
                        currentPlayer.pointsLeft += throwValueSum
                        currentPlayer.totalThrows -= throwValueSum
                  
                        //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
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
               
               {/* Score input + remove-last value button*/}
               {!showNumberButtons && (
                  <div className='score-input-section'>
                     <input
                        type="number"
                        value={currentThrow}
                        onChange={(e) => handleThrowChange(e.target.value)}
                     />
                     <button 
                        className='remove-last'
                        onClick={() => {
                           const newValue = String(currentThrow).slice(0, -1)
                           setCurrentThrow(newValue ? Number(newValue) : 0)
                        }}>
                        <Image 
                           src='/backspace.svg' 
                           alt='Remove last throw icon' 
                           width={24} 
                           height={24} 
                        />
                     </button>
                  </div>
               )}

               {/* Throw details*/}
               {showNumberButtons && (
                  <div className="current-player-throws">
                     {Array.from({ length: 3 }, (_, i) => (
                        <div className='current-throw' key={i}>
                           {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                        </div>
                     ))}
                  </div>
               )}

               {/* Submit score button*/}
               <button 
                  className='submit-score' 
                  onClick={() => {
                     if (!showNumberButtons) {
                        if (isDoubleActive) {
                           handleSubmitThrowInput(2)
                        } else {
                           handleSubmitThrowInput(1)
                        }
                     } else {
                        handleSubmitScoreButtons()
                     }
                  }}>
                  Submit Score
               </button>
            </div>
            
            {/* Multiplier section*/}
            <div className='multiplier-section'>
               {!showNumberButtons ? (
                  players[currentPlayerIndex].pointsLeft <= 40 && players[currentPlayerIndex].pointsLeft % 2 === 0 && (
                     <button 
                        onClick={() => setIsDoubleActive(!isDoubleActive)} 
                        className={isDoubleActive ? 'active' : ''}>
                        Double
                     </button>
                  )
               ) : (
                  <div className="multiplier-buttons">
                     <button 
                        onClick={() => setMultiplier(1)} 
                        className={multiplier === 1 ? 'active' : ''}>
                        Single
                     </button>
                     <button 
                        onClick={() => setMultiplier(2)} 
                        className={multiplier === 2 ? 'active' : ''}>
                        Double
                     </button>
                     <button 
                        onClick={() => setMultiplier(3)} 
                        className={multiplier === 3 ? 'active' : ''}>
                        Triple
                     </button>
                  </div>
               )}
            </div>

            {/* Score buttons section*/}
            <div className="score-buttons-section">
               {!showNumberButtons ? (
                  <div className='score-input'>
                     {/* Buttons 0-9 */}
                     {Array.from({ length: 9 }, (_, i) => (
                        <button 
                           key={i} 
                           onClick={() => {
                              const newValue = Number(`${currentThrow}${i+1}`)
                              setCurrentThrow(newValue)}}>
                           {i+1}
                        </button>
                     ))}
                     <button 
                        onClick={handleUndo}>
                           Undo
                     </button>
                     <button
                        onClick={() => {
                           const newValue = Number(`${currentThrow}${0}`)
                           setCurrentThrow(newValue)
                        }}>
                           0
                     </button>
                  </div>
               ) : (
                  <div className='score-buttons'>
                     {/* Score buttons */}
                     {Array.from({ length: 20 }, (_, i) => {
                        const baseValue = i + 1
                        const displayValue = multiplier > 1 ? baseValue * multiplier : null

                        return (
                           <button 
                              key={baseValue} 
                              onClick={() => handleSubmitThrowButtons(baseValue)}>
                              <span 
                                 className="base-value">
                                 {baseValue}
                              </span>
                              {displayValue && 
                                 <span 
                                    className="multiplied-value">
                                       ({displayValue})
                                 </span>
                              }
                           </button>
                        )
                     })}

                     {/* Bull, Outer, Miss and Undo buttons */}
                     <button 
                        onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 50 / 2 : multiplier === 3 ? 50 / 3 : 50)}>
                           Bull (50)
                     </button>
                     <button 
                        onClick={() => handleSubmitThrowButtons(multiplier === 2 ? 25 / 2 : multiplier === 3 ? 25 / 3 : 25)}>
                           Outer (25)
                     </button>
                     <button 
                        onClick={() => handleSubmitThrowButtons(0)}>
                           Miss
                     </button>
                     <button 
                        onClick={handleUndo}>
                           Undo
                     </button>
                  </div>
               )}  
            </div>

         </div>

         {/* Settings buttons*/}
         <div className="settings-buttons">
            <button 
               className='go-back' 
               onClick={() => router.back()}>
                  Back to Settings
            </button>
            <button 
               className='restart-game' 
               onClick={handleRestartGame}>
                  Restart game
            </button>
         </div>
         
         {/* Error/Game End overlay */}
         {(isError || isGameEnd) && <div className="overlay"></div>}

         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <Image 
                     src='/error.svg' 
                     alt='Error icon' 
                     width={100} 
                     height={100} 
                  />
                  <p>{errorMessage}</p>
                  <button 
                     onClick={closeError}>
                        OK
                  </button>
               </div>
            </div>
         )}

         {/* End game pop-up */}
         {isGameEnd && (
            <div className='game-over-popup'>
               <div className='game-over-popup-content'>
                  <Image 
                     src='/winner.svg' 
                     alt='Winner icon' 
                     width={80} 
                     height={80} 
                  />
                  <h3>Winner: {winner?.name}</h3>
                  <button 
                     className='play-again' 
                     onClick={handleRestartGame}>
                        Play Again
                  </button>
                  <button 
                     className='go-back' 
                     onClick={() => router.back()}>
                        Back to Settings
                  </button>
                  <button 
                     className='undo' 
                     onClick={() => {
                        handleUndo(); setIsGameEnd(false)}}>
                        Undo
                  </button>
               </div>
            </div>
         )}

      </div>
   )
}
 
export default Game