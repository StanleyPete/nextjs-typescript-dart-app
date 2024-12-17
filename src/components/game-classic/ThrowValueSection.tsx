import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
   setCurrentThrow, 
   setMultiplier, 
   setIsDoubleActive 
} from '@/redux/slices/game-classic/gameClassicSlice'
import { selectDataInThrowValueSectionAndNumberButtons } from '@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons'
//Controllers
import { handleToggleInputMethod } from '@/controllers/game-classic/handleToggleInputMethod'
import { handleThrowValueChange } from '@/controllers/game-classic/handleThrowValueChange'
import { handleSubmitThrowKeyboardButtons } from '@/controllers/game-classic/handleSubmitThrowKeyboardButtons'
import { handleSubmitThrowSubmitScoreButton } from '@/controllers/game-classic/handleSubmitThrowSubmitScoreButton'
//Types
import { 
   PlayerClassic, 
   TeamClassic, 
   HistoryEntryClassicSingle, 
   HistoryEntryClassicTeams 
} from '@/types/redux/gameClassicTypes'

const ThrowValueSection = () => {
   const dispatch = useDispatch()

   const {  
      gameType,
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const {
      startIndex,
      showNumberButtons,
      throwValueSum,
      currentThrow,
      currentPlayerThrowsCount,
      currentPlayerThrows,
      multiplier,
      isDoubleActive,
      isSoundEnabled,
   } = useSelector((state: RootState) => state.gameClassic)
   
   //Memoized (@/redux/selectors/game-classic/selectDataInThrowValueSectionAndNumberButtons.ts):
   const { 
      playersOrTeams, 
      index, 
      currentPlayerIndexInTeam, 
      history 
   } = useSelector(selectDataInThrowValueSectionAndNumberButtons)
   
   return (
      <>
         <div className="throw-value-section">

            {/* Toggle between input and number buttons */}
            <button 
               className={`input-toggle ${showNumberButtons ? 'buttons-active' : 'input-active'}`}
               onClick={() => {
                  handleToggleInputMethod(
                     gameType,
                     playersOrTeams,
                     index,
                     currentPlayerThrowsCount,
                     throwValueSum,
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
                     onChange={(e) => handleThrowValueChange(e.target.value, dispatch)}
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
                     handleSubmitThrowKeyboardButtons(
                        gameType,
                        playersOrTeams,
                        index,
                        gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                        startIndex,
                        history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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
                        gameType,
                        playersOrTeams as PlayerClassic[] | TeamClassic[],
                        index,
                        gameType === 'teams' ? currentPlayerIndexInTeam! : 0,
                        currentPlayerThrows,
                        history as HistoryEntryClassicSingle[] | HistoryEntryClassicTeams[],
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
               playersOrTeams[index].pointsLeft <= 40 && playersOrTeams[index].pointsLeft % 2 === 0 && (
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

export default ThrowValueSection