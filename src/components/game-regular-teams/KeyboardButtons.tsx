import React from 'react'
import { handleUndoRegular } from '@/controllers/handleUndo'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow, } from '@/redux/slices/gameRegularSlice'

const KeyboardButtons = () => {
   const dispatch = useDispatch()

   const gameMode = useSelector((state: RootState) => state.gameSettings)

   const { 
      players, 
      history, 
      currentThrow, 
      currentPlayerIndex, 
      showNumberButtons, 
      throwValueSum, 
      currentPlayerThrowsCount, 
      currentPlayerThrows, 
    
   } = useSelector((state: RootState) => state.gameRegular)

   return (
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
                  dispatch, 
               )}}>
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
   )
}

export default KeyboardButtons