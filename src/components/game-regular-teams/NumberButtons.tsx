import React from 'react'
import { handleUndoRegular } from '@/controllers/handleUndo'
import { handleSubmitThrowNumberButtons } from '@/controllers/handleSubmitThrowNumberButtons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'


const NumberButtons = () => {
   const dispatch = useDispatch()

   const {  
      gameMode,
      numberOfLegs,
      gameWin 
   } = useSelector((state: RootState) => state.gameSettings)

   const { 
      players, 
      history,  
      currentPlayerIndex, 
      startPlayerIndex, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
      multiplier, 
      isSoundEnabled, 
   } = useSelector((state: RootState) => state.gameRegular)

   const specialButtons = [
      { label: 'Bull (50)', value: 50 },
      { label: 'Outer (25)', value: 25 },
      { label: 'Miss', value: 0 },
   ]

   
   return (
      <div className='score-buttons'>
         {/* Score buttons */}
         {Array.from({ length: 20 }, (_, i) => {
            const baseValue = i + 1
            const displayValue = multiplier > 1 ? baseValue * multiplier : null

            return (
               <button 
                  key={baseValue} 
                  onClick={() => {
                     handleSubmitThrowNumberButtons(
                        baseValue,
                        players,
                        currentPlayerIndex,
                        startPlayerIndex,
                        history,
                        throwValueSum,
                        currentPlayerThrowsCount,
                        currentPlayerThrows,
                        multiplier,
                        gameMode,
                        numberOfLegs,
                        gameWin,
                        isSoundEnabled,
                        dispatch
                     )
                  }}
               >
                  <span className="base-value">{baseValue}</span>
                  {displayValue && <span className="multiplied-value">({displayValue})</span>}
               </button>
            )
         })}

         {/* Bull, Outer, Miss and Undo buttons */}
         {specialButtons.map(({ label, value }) => (
            <button 
               key={label} 
               onClick={() => {
                  handleSubmitThrowNumberButtons(
                     multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                     players,
                     currentPlayerIndex,
                     startPlayerIndex,
                     history,
                     throwValueSum,
                     currentPlayerThrowsCount,
                     currentPlayerThrows,
                     multiplier,
                     gameMode,
                     numberOfLegs,
                     gameWin,
                     isSoundEnabled,
                     dispatch
                  )
               }}
            >
               {label}
            </button>
         ))}
         <button 
            onClick={() => {
               handleUndoRegular(
                  players, 
                  currentPlayerIndex, 
                  history, 
                  showNumberButtons, 
                  throwValueSum, 
                  currentPlayerThrows, 
                  currentPlayerThrowsCount, 
                  gameMode, 
                  dispatch
               )
            }}
         >
               Undo
         </button>
      </div>
   )
}

export default NumberButtons