import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

const KeyboardButtonsOnline = () => {
   const dispatch = useDispatch()
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)

   const handleClick = (value: number) => {
      const newValueString = (`${currentThrow}${value}`)
      if (newValueString.length > 3) return
      const newValue = Number(`${currentThrow}${value}`)
      
      dispatch(setCurrentThrow(newValue))
   }

   return (
      <div className="score-buttons-section">
         <div className="score-input">
            {[...Array.from({ length: 9 }, (_, i) => i + 1), 0].map((num) => (
               <button key={num} onClick={() => handleClick(num)}>
                  {num}
               </button>
            ))}
         </div>
      </div>
   )
}

export default KeyboardButtonsOnline
