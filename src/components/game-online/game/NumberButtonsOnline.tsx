import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { handleSubmitThrowNumberButtonsOnline } from '@/controllers/game-online/handleSubmitThrowNumberButtonsOnline'
import { handleUndo } from '@/controllers/game-online/handleUndo'

const NumberButtonsOnline = () => {
   const gameId = useSelector((state: RootState) => state.gameOnline.gameId)
   const multiplier = useSelector((state: RootState) => state.gameOnline.multiplier)
   const specialButtons = [
      { label: 'Bull (50)', value: 50 },
      { label: 'Outer (25)', value: 25 },
      { label: 'Miss', value: 0 },
   ]

   return (
      <div className="score-buttons-section">
         <div className='score-buttons'>

            {/* NUMBER BUTTONS: 1-20 */}
            {Array.from({ length: 20 }, (_, i) => {
               const baseValue = i + 1
               const displayValue = multiplier > 1 ? baseValue * multiplier : null

               return (
                  <button 
                     key={baseValue} 
                     onClick={() => {
                        handleSubmitThrowNumberButtonsOnline(gameId, baseValue, multiplier)  
                     }}
                  >
                     <span className="base-value">{baseValue}</span>
                     {displayValue && <span className="multiplied-value">({displayValue})</span>}
                  </button>
               )
            })}

            {/* BULL, OUTER, MISS BUTTONS */}
            {specialButtons.map(({ label, value }) => (
               <button 
                  key={label} 
                  onClick={() => {
                     handleSubmitThrowNumberButtonsOnline(
                        gameId,
                        multiplier === 2 ? value / 2 : multiplier === 3 ? value / 3 : value,
                        multiplier,
                     )
                  }}
               >
                  {label}
               </button>
            ))}

            {/* UNDO BUTTON */}
            <button onClick={() => { handleUndo(gameId) }} >
               Undo
            </button>
           
         </div>

      </div>
   )
}

export default NumberButtonsOnline