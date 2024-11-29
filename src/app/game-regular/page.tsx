'use client'

import React, { useEffect, useCallback } from 'react'
import Image from 'next/image'
import GamePlayersSectionRegular from '@/components/game-regular/GamePlayersSectionRegular'
import CurrentPlayerThrowParagraph from '@/components/CurrentPlayerThrowParagraph'
import SettingsButtons from '@/components/SettingsButtons'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameEndPopUp from '@/components/GameEndPopUp'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { 
   Player,
   setPlayers, 
   setHistory,
   HistoryEntry, 
   setCurrentThrow, 
   setCurrentPlayerIndex, 
   setStartPlayerIndex, 
   setShowNumberButtons, 
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows, 
   setMultiplier, 
   setIsDoubleActive, 
   setIsGameEnd, 
   setWinner, 
   setInitialSoundPlayed, 
} from '@/redux/slices/gameRegularSlice'


const Game = () => {

   const dispatch = useDispatch()
 

   //Game settings states destructured:
   const {  
      gameMode, 
      gameWin, 
      numberOfLegs 
   } = useSelector((state: RootState) => state.gameSettings)

   //Game regular states destructured:
   const { 
      players, 
      history, 
      currentThrow, 
      currentPlayerIndex, 
      startPlayerIndex, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      multiplier, 
      isDoubleActive, 
      isSoundEnabled, 
      initialSoundPlayed 
   } = useSelector((state: RootState) => state.gameRegular)
  
   //SCORE INPUT HANDLER
   const handleThrowChange = (value: string) => {
      dispatch(setCurrentThrow(Number(value)))
   }
   
   //NEXT PLAYER HANDLER
   const handleSwitchPlayer = () => {
      /* Switch to another player: 
         Example: If there are 4 players and currentPlayerIndex === 3 (last player's turn), 
         after increasing currentPlayerIndex by 1, 4%4 === 0 which is first player's index
      */
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
      dispatch(setCurrentPlayerIndex(nextPlayerIndex))
   }

   //NEXT PLAYER WHO STARTS THE LEG HANDLER
   const handleStartPlayerIndex = () => {
      const nextStartPlayerIndex = (startPlayerIndex + 1) % players.length
      dispatch(setStartPlayerIndex(nextStartPlayerIndex))
   }

   //SOUND EFFECT HANDLER
   const playSound = useCallback((fileName: string) => {
      if(isSoundEnabled) {
         const audio = new Audio(`/sounds/${fileName}.mp3`)
         audio.play().catch(error => console.log('Error:', error))
      }
   }, [isSoundEnabled])

 

   //SUBMIT SCORE HANDLER FOR INPUT
   const handleSubmitThrowInput = (inputMultiplier: number) => {
      const invalidScores = [163, 166, 169, 172, 173, 175, 176, 178, 179]
      const gamePlayers = JSON.parse(JSON.stringify(players))
      const currentPlayer = gamePlayers[currentPlayerIndex]
     
      //Error hanlder (currentThrow over 180)
      if(currentThrow > 180){
         dispatch(setError({ isError: true, errorMessage: 'Score higher than 180 is not possible' }))
         dispatch(setCurrentThrow(0))
         return
      }

      if(invalidScores.includes(currentThrow)){
         dispatch(setError({ isError: true, errorMessage: `${currentThrow} is not possible` }))
         dispatch(setCurrentThrow(0))
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
         const newHistoryEntries = gamePlayers
            .map((player: Player, index: number) => {
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
            .filter((entry: HistoryEntry | null) => entry !== null) //Skipping currentPlayerIndex (null)
         
         //Updating legs for current player
         currentPlayer.legs += 1
         
         //Updating game stats for new leg (for each player)
         gamePlayers.forEach((player: Player) => {
            player.pointsLeft = Number(gameMode)
            player.lastScore = 0
            player.totalThrows = 0
            player.totalAttempts = 0
            player.average = 0
            player.isInputPreffered = true
         })

         //Updating history state with currentPlayerIndex
         dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

         //Upadating player's state
         dispatch(setPlayers(gamePlayers)) 

         //Switching to next player who start the leg
         handleStartPlayerIndex()

         //Setting current player index:
         dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

         //End game check
         checkGameEndHandler(gamePlayers)

         //Resetting isDoubleActive state
         dispatch(setIsDoubleActive(false))

         //Resetting input value
         dispatch(setCurrentThrow(0))
         
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
         dispatch(setHistory([...history, newHistoryEntry]))

         //Upadating player's state
         dispatch(setPlayers(gamePlayers))

         //Sound effect
         playSound('no-score')

         //Switching to the next player
         handleSwitchPlayer()

         //Resetting input value
         dispatch(setCurrentThrow(0))

         return
      }

      //Updating lastScore, totalThrows, totalAttempts, average
      currentPlayer.lastScore = (currentThrow * inputMultiplier)
      currentPlayer.totalThrows += (currentThrow * inputMultiplier)
      currentPlayer.totalAttempts += 1
      currentPlayer.isInputPreffered = true
      currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
      
      //Updating history state
      dispatch(setHistory([...history, newHistoryEntry]))
      
      //Upadating player's state
      dispatch(setPlayers(gamePlayers))

      //Sound effect
      if (currentThrow === 0) {
         playSound('no-score')
      } else {
         playSound(currentThrow.toString())
      }
      
      //Switching to the next player
      handleSwitchPlayer()
     
      //Resetting input value
      dispatch(setCurrentThrow(0))
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS
   const handleSubmitThrowButtons = (throwValue: number) => {
      const gamePlayers = JSON.parse(JSON.stringify(players))
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
            const newHistoryEntries = gamePlayers
               .map((player: Player, index: number) => {
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
               .filter((entry: HistoryEntry | null) => entry !== null) //Skipping currentPlayerIndex (null)

            //Updating legs
            currentPlayer.legs += 1 

            //Updating game stats for new leg (for each player)
            gamePlayers.forEach((player: Player) => {
               player.pointsLeft = Number(gameMode)
               player.lastScore = 0
               player.totalThrows = 0
               player.totalAttempts = 0
               player.average = 0
               player.isInputPreffered = true
            })
            
            //Updating history state
            dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

            //Switching to next player who start the leg
            handleStartPlayerIndex()

            //Setting current player index:
            dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

            //Updating player's state
            dispatch(setPlayers(gamePlayers))

            //Checking game end
            checkGameEndHandler(gamePlayers)

            //Resetting states
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))
           
            return
         }

         //Scenario when player has not thrown 3 times yet but pointsLeft are equal or less than 1
         if(currentPlayer.pointsLeft <= 1) {
            currentPlayer.pointsLeft = newHistoryEntry.historyPointsLeft
            currentPlayer.lastScore = 0
            currentPlayer.totalThrows -= throwValueSum
            currentPlayer.totalAttempts += 1
            currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
            dispatch(setHistory([...history, newHistoryEntry]))

            //Sound effect:
            playSound('no-score')

            //Switching to the next player:
            handleSwitchPlayer()

            //Resetting states
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))

            dispatch(setPlayers(gamePlayers))

            return
         }

         //Updating totalThrows, throwValueSum, currentPlayerThrows, currentPlayerThrowsCount (currentThrow in case player would like to switch input method)
         currentPlayer.totalThrows += multiplierThrowValue
         dispatch(setThrowValueSum(throwValueSum + multiplierThrowValue))
         dispatch(setCurrentPlayerThrows([...currentPlayerThrows, multiplierThrowValue].slice(-3)))
         dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
         dispatch(setCurrentThrow(0))
      } 
      //Scenario when players has thrown already 3 times
      else {
         //Updating pointsLeft
         currentPlayer.pointsLeft -= multiplierThrowValue
         
         //End leg scenario when player has thrown already 3 times, multiplier === 2 and pointsLeft === 0
         if(multiplier === 2 && currentPlayer.pointsLeft === 0){
            const newHistoryEntries = gamePlayers
               .map((player: Player, index: number) => {
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
               .filter((entry: HistoryEntry | null) => entry !== null) //Skipping currentPlayerIndex (null)

            currentPlayer.legs += 1 

            //Updating game stats for new leg (for each player)
            gamePlayers.forEach((player: Player) => {
               player.pointsLeft = Number(gameMode)
               player.lastScore = 0
               player.totalThrows = 0
               player.totalAttempts = 0
               player.average = 0
               player.isInputPreffered = true
            })
            
            //Updating history state
            dispatch(setHistory([...history, ...newHistoryEntries, newHistoryEntry]))

            //Switching to next player who start the leg
            handleStartPlayerIndex()

            //Setting current player index:
            dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

            //Checking game end
            checkGameEndHandler(gamePlayers)

            //Resetting states
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))
            dispatch(setPlayers(gamePlayers))
            return
         }

         //Scenario when player has already thrown 3 times, but pointsLeft are equal or less than 1
         if(currentPlayer.pointsLeft <= 1) {
            currentPlayer.pointsLeft += multiplierThrowValue
            currentPlayer.lastScore = 0
            currentPlayer.totalThrows -= throwValueSum
            currentPlayer.totalAttempts += 1
            currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
            dispatch(setHistory([...history, newHistoryEntry]))
            playSound('no-score')
            handleSwitchPlayer()
            dispatch(setThrowValueSum(0))
            dispatch(setCurrentPlayerThrowsCount(0))
            dispatch(setCurrentPlayerThrows([]))
            dispatch(setCurrentThrow(0))
            dispatch(setPlayers(gamePlayers))
            return
         }

         //Updating lastScore, totalThrows, totalAttempts, average when player has already thrown 3 times:
         currentPlayer.lastScore = throwValueSum + multiplierThrowValue
         currentPlayer.totalThrows += multiplierThrowValue
         currentPlayer.totalAttempts += 1
         currentPlayer.average = currentPlayer.totalThrows / currentPlayer.totalAttempts
         
         //Updating history state
         dispatch(setHistory([...history, newHistoryEntry]))

         //Sound effect:
         playSound((throwValueSum + multiplierThrowValue).toString())

         //Resetting states:
         dispatch(setThrowValueSum(0))
         dispatch(setCurrentPlayerThrowsCount(0))
         dispatch(setCurrentPlayerThrows([]))
         dispatch(setCurrentThrow(0))
         
         //Switching to the next player
         handleSwitchPlayer()
      }

      //Updating  player's state
      dispatch(setPlayers(gamePlayers))
   }

   //SUBMIT SCORE HANDLER FOR BUTTONS 
   /*
      (for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value)
   */
   const handleSubmitScoreButtons = () => {
      const updatedPlayers = JSON.parse(JSON.stringify(players))
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
      dispatch(setHistory([...history, newHistoryEntry]))

      //Sound-effect
      if(throwSum === 0){
         playSound('no-score')
      } else {
         playSound(throwSum.toString())
      }
      
      //Resetting states
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
      dispatch(setCurrentThrow(0))

      //Switching to the next player
      handleSwitchPlayer()
      
      //Updating player's state
      dispatch(setPlayers(updatedPlayers))
   }
   
   //UNDO HANDLER
   const handleUndo = () => {
      const lastEntry = history[history.length - 1]
      const gamePlayers = JSON.parse(JSON.stringify(players))

      //Scenario when players have just finished previous leg
      if(history.length !== 0 && lastEntry.historyTotalThrows === Number(gameMode)){
         const currentPlayer = gamePlayers[lastEntry.historyPlayerIndex]

         currentPlayer.legs -= 1

         //Updating game stats for each player
         gamePlayers.forEach((player: Player, index: number) => {
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
         dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex)) 

         //Removing last history entries (inlcuding additional entries created when player finished leg)
         dispatch(setHistory(history.slice(0, history.length - gamePlayers.length)))

         //Updating players state
         dispatch(setPlayers(gamePlayers)) 

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
         dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex)) 
         
         //Removing last history entry
         dispatch(setHistory(history.slice(0, -1)))
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
            const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
            dispatch(setThrowValueSum(updatedThrowValueSum))
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
            
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            dispatch(setCurrentPlayerThrows(updatedThrows))
            dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
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
            dispatch(setHistory(history.slice(0, -1)))
            
            //Setting currentPlayerIndex to the last player who played in the history
            dispatch(setCurrentPlayerIndex(lastEntry.historyPlayerIndex))
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
            const updatedThrowValueSum = throwValueSum - currentPlayerThrows[currentPlayerThrows.length - 1]
            dispatch(setThrowValueSum(updatedThrowValueSum))
            
            //Removing last available throw from temporary variable
            updatedThrows.pop()
   
            //Updating currentPlayerThrows and currentPlayerThrowCount with temporary variables
            dispatch(setCurrentPlayerThrows(updatedThrows))
            dispatch(setCurrentPlayerThrowsCount(updatedThrowCount))
         }
      }
      
      //Updating players state
      dispatch(setPlayers(gamePlayers)) 
   }

   //GAME END HANDLER
   const checkGameEndHandler = (gamePlayers: Player[]) => {
      //Scenario when game type is set to best-of
      if (gameWin === 'best-of') {
         //Sum of legs for all players
         const totalLegs = gamePlayers.reduce((acc: number, player: Player) => acc + player.legs, 0)
         
         //Check if totalLegs for players equals to number-of-legs parameter
         if (totalLegs === Number(numberOfLegs)) {
            //Finding winner player
            const maxLegs = Math.max(...gamePlayers.map((player: Player) => player.legs))
            const winner = gamePlayers.find((player: Player) => player.legs === maxLegs) || null
            dispatch(setIsGameEnd(true))
            dispatch(setWinner(winner))
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }      
      }
      //Scenario when game type is set to first-to
      else if (gameWin === 'first-to') {
         //Finding winner player
         const winner = gamePlayers.find((player: Player) => player.legs === Number(numberOfLegs)) || null
         console.log(winner)
         if(winner){
            dispatch(setIsGameEnd(true))
            dispatch(setWinner(winner))
            playSound('and-the-game')
         } else {
            playSound('and-the-leg')
         }
      }
   }

   

  
   useEffect(() => {
      const isInputPreferred = players[currentPlayerIndex].isInputPreffered
      if (isInputPreferred) {
         dispatch(setShowNumberButtons(false))
      } else {
         dispatch(setShowNumberButtons(true))
      }

      if(!initialSoundPlayed){
         playSound('game-is-on')
         dispatch(setInitialSoundPlayed(true))
      }

      console.log('History: ', history)
      console.log('Players: ', players)
   }, [players, history, currentPlayerIndex, initialSoundPlayed, dispatch, playSound])

   

   return (
      <div className='game-container'>

         {/*Game players section component */}
         <GamePlayersSectionRegular />
         
         {/*Current player throw paragraph component */}
         <CurrentPlayerThrowParagraph />

         {/*Main score input section (input/buttons toggle, score preview, submit score button, score buttons ):*/}
         <div className='score-section'> 

            {/*Current throws section:*/}
            <div className="throw-value-section">

               {/* Toggle between input and number buttons */}
               <button 
                  className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
                  onClick={() => {
                     //Resetting values when toggle button clicked
                     const gamePlayers = JSON.parse(JSON.stringify(players))
                     const currentPlayer = gamePlayers[currentPlayerIndex]
                     if (currentPlayerThrowsCount > 0) {
                  
                        //Resetting pointsLeft and totalThrows values
                        currentPlayer.pointsLeft += throwValueSum
                        currentPlayer.totalThrows -= throwValueSum
                  
                        //Resetting throwValueSum, currentPlayerThrows and currentPlayersThrowsCount states
                        dispatch(setThrowValueSum(0))
                        dispatch(setCurrentPlayerThrows([]))
                        dispatch(setCurrentPlayerThrowsCount(0))         
                     }
                     
                     //Switching isInputPreffered
                     currentPlayer.isInputPreffered = !currentPlayer.isInputPreffered
                     //Updating player's state
                     dispatch(setPlayers(gamePlayers))    
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
                           dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
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
                        onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
                        className={isDoubleActive ? 'active' : ''}>
                        Double
                     </button>
                  )
               ) : (
                  <div className="multiplier-buttons">
                     <button 
                        onClick={() => dispatch(setMultiplier(1))} 
                        className={multiplier === 1 ? 'active' : ''}>
                        Single
                     </button>
                     <button 
                        onClick={() => dispatch(setMultiplier(2))} 
                        className={multiplier === 2 ? 'active' : ''}>
                        Double
                     </button>
                     <button 
                        onClick={() => dispatch(setMultiplier(3))} 
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
                              dispatch(setCurrentThrow(newValue))}}>
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
                           dispatch(setCurrentThrow(newValue))
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
         <SettingsButtons />
         
         {/* Error section */}
         <ErrorPopUp />

         {/* End game pop-up */}
         <GameEndPopUp />

      </div>
   )
}
 
export default Game