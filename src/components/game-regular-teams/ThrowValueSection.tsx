import React from 'react'
import Image from 'next/image'
import { playSound } from '@/lib/playSound'
import { handleSwitchPlayer } from '@/lib/handleSwitchPlayer'
import { handleSwitchStartPlayerIndex } from '@/lib/handleSwitchStartPlayerIndex'
import { checkGameEndHandler } from '@/lib/checkGameEndHandler'
import { Player, HistoryEntry } from '@/app/types/types'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { 
   setPlayers, 
   setHistory,
   setCurrentThrow, 
   setCurrentPlayerIndex,   
   setThrowValueSum, 
   setCurrentPlayerThrowsCount, 
   setCurrentPlayerThrows, 
   setMultiplier, 
   setIsDoubleActive,  
} from '@/redux/slices/gameRegularSlice'

const ThrowValueSection = () => {
   const dispatch = useDispatch()

   const {  
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

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
   } = useSelector((state: RootState) => state.gameRegular)

   //SCORE INPUT HANDLER
   const handleThrowChange = (value: string) => {
      dispatch(setCurrentThrow(Number(value)))
   }

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
         handleSwitchStartPlayerIndex(startPlayerIndex, players, dispatch)

         //Setting current player index:
         dispatch(setCurrentPlayerIndex((startPlayerIndex + 1) % players.length))

         //End game check
         checkGameEndHandler(gamePlayers, gameWin, numberOfLegs, isSoundEnabled, dispatch)

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
         playSound('no-score', isSoundEnabled)

         //Switching to the next player
         handleSwitchPlayer(currentPlayerIndex, players, dispatch)

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
         playSound('no-score', isSoundEnabled)
      } else {
         playSound(currentThrow.toString(), isSoundEnabled)
      }
    
      //Switching to the next player
      handleSwitchPlayer(currentPlayerIndex, players, dispatch)
   
      //Resetting input value
      dispatch(setCurrentThrow(0))
   }

   
   //SUBMIT SCORE HANDLER FOR BUTTONS 
   /*
      (for better user experience, i.e. when player has thrown 0 or missed any of 3 darts - no need to click on button with 0 value)
    */
   const handleSubmitScoreButtons = () => {
      const updatedPlayers = JSON.parse(JSON.stringify(players))
      const currentPlayer = updatedPlayers[currentPlayerIndex]

      const throwSum = currentPlayerThrows.reduce((acc: number, throwValue: number) => acc + throwValue, 0)

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
         playSound('no-score', isSoundEnabled)
      } else {
         playSound(throwSum.toString(), isSoundEnabled)
      }
    
      //Resetting states
      dispatch(setThrowValueSum(0))
      dispatch(setCurrentPlayerThrows([]))
      dispatch(setCurrentPlayerThrowsCount(0))
      dispatch(setCurrentThrow(0))

      //Switching to the next player
      handleSwitchPlayer(currentPlayerIndex, players, dispatch)
    
      //Updating player's state
      dispatch(setPlayers(updatedPlayers))
   }


   return (
      <> 
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

      </>
   )
}

export default ThrowValueSection