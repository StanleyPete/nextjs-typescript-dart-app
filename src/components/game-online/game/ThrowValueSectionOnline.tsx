import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentThrow, setMultiplier, setIsDoubleActive } from '@/redux/slices/game-online/gameOnlineSlice'
import { handleToggleInputMethodOnline } from '@/controllers/game-online/handleToggleInputMethod'
import { handleThrowValueChangeOnline } from '@/controllers/game-online/handleThrowValueChange'
import { handleSubmitThrowKeyboardButtonsOnline } from '@/controllers/game-online/handleSubmitThrowKeyboardButtonsOnline'
import { handleSubmitThrowSubmitScoreButtonOnline } from '@/controllers/game-online/handleSubmitThrowSubmitScoreButtonOnline'

const ThrowValueSectionOnline = () => {
   const dispatch = useDispatch()
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const throwValueSum = useSelector((state: RootState) => state.gameOnline.throwValueSum)
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const multiplier = useSelector((state: RootState) => state.gameOnline.multiplier)
   const currentPlayerThrowsCount = useSelector((state: RootState) => state.gameOnline.currentPlayerThrowsCount)
   const currentPlayerThrows = useSelector((state: RootState) => state.gameOnline.currentPlayerThrows)
   const isSoundEnabled = useSelector((state: RootState) => state.gameOnline.isSoundEnabled)
   const isDoubleActive = useSelector((state: RootState) => state.gameOnline.isDoubleActive)

   return (
      <>
         <div className="throw-value-section">

            {/* Toggle between input and number buttons */}
            <button 
               className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
               onClick={() => {
                  handleToggleInputMethodOnline(
                     players,
                     currentPlayerIndex,
                     currentPlayerThrowsCount,
                     throwValueSum,
                     showNumberButtons,
                     dispatch
                  )
               }}      
            >
               {showNumberButtons ? 'Input' : 'Buttons'}
            </button>
       
            {/* Score input + remove-last value button*/}
            {!showNumberButtons && (
               <div className='score-input-section'>
                  <input
                     type="number"
                     value={currentThrow}
                     onChange={(e) => handleThrowValueChangeOnline(e.target.value, dispatch)}
                  />
                  <button 
                     className='remove-last'
                     onClick={() => {
                        const newValue = String(currentThrow).slice(0, -1)
                        dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
                        
                     }}
                  >
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
                     handleSubmitThrowKeyboardButtonsOnline(
                        currentThrow,
                        multiplierNumber,
                        dispatch,
                        gameId
                     ) 
                  } else {
                     handleSubmitThrowSubmitScoreButtonOnline(
                        players, 
                        currentPlayerIndex,
                        currentPlayerThrows,
                        isSoundEnabled,
                        dispatch
                     ) 
                  }
               }}
            >
               Submit Score
            </button>
         </div>
    
         {/* Multiplier section*/}
         <div className='multiplier-section'>
            {!showNumberButtons ? (
               players[currentPlayerIndex].pointsLeft <= 40 && players[currentPlayerIndex].pointsLeft % 2 === 0 && (
                  <button 
                     className={isDoubleActive ? 'active' : ''}
                     onClick={() => dispatch(setIsDoubleActive(!isDoubleActive))} 
                  >
                     Double
                  </button>
               )
            ) : (
               <div className="multiplier-buttons">
                  { [1, 2, 3].map((multiplierValue) => (
                     <button
                        key={multiplierValue}
                        className={multiplier === multiplierValue ? 'active' : ''}
                        onClick={() => dispatch(setMultiplier(multiplierValue))}
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

export default ThrowValueSectionOnline