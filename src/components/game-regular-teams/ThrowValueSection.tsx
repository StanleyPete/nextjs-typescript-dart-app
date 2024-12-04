import React from 'react'
import Image from 'next/image'
import { handleThrowChange } from '@/controllers/handleThrowChange'
import { handleSubmitThrowKeyboardButtons } from '@/controllers/handleSubmitThrowKeyboardButtons'
import { handleSubmitThrowSubmitScoreButton } from '@/controllers/handleSubmitThrowSubmitScoreButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   setPlayers, 
   setCurrentThrow,  
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
                     onChange={(e) => handleThrowChange(e.target.value, dispatch)}
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
                     const multiplierNumber = isDoubleActive ? 2 : 1
                     handleSubmitThrowKeyboardButtons(
                        players,
                        currentPlayerIndex,
                        startPlayerIndex,
                        history,
                        currentThrow,
                        multiplierNumber,
                        gameMode,
                        numberOfLegs,
                        gameWin,
                        isSoundEnabled,
                        isDoubleActive,
                        dispatch
                     )
                     
                  } else {
                     handleSubmitThrowSubmitScoreButton(
                        players,
                        currentPlayerIndex,
                        currentPlayerThrows,
                        history,
                        isSoundEnabled,
                        dispatch
                     )
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
                  { [1, 2, 3].map((multiplierValue) => (
                     <button
                        key={multiplierValue}
                        onClick={() => dispatch(setMultiplier(multiplierValue))}
                        className={multiplier === multiplierValue ? 'active' : ''}
                     >
                        {multiplierValue === 1 ? 'Single' : multiplierValue === 2 ? 'Double' : 'Triple'}
                     </button>
                  ))}
               </div>
            )}
         </div>

      </>
   )
}

export default ThrowValueSection