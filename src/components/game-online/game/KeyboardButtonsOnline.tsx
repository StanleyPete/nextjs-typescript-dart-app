import React from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

const KeyboardButtonsOnline = () => {
   const dispatch = useDispatch()
   const { currentThrow } = useSelector((state: RootState) => state.gameOnline)

   return (
      <div className='score-input'>
         {/* Buttons 0-9 */}
         {Array.from({ length: 9 }, (_, i) => (
            <button 
               key={i} 
               onClick={() => {
                  const newValue = Number(`${currentThrow}${i+1}`)
                  dispatch(setCurrentThrow(newValue))
               }}
            >
               {i+1}
            </button>
         ))}
         <button
            onClick={() => {
               const newValue = Number(`${currentThrow}${0}`)
               dispatch(setCurrentThrow(newValue))
            }}
         >
            0
         </button>
      </div>
   )
}

export default KeyboardButtonsOnline