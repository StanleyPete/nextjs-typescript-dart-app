import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

const KeyboardButtonsOnline = () => {
   const dispatch = useDispatch()
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   const [activeButton, setActiveButton] = useState<number | string | null>(null)

   const handleClick = (value: number) => {
      const newValueString = (`${currentThrow}${value}`)
      if (newValueString.length > 3) return
      const newValue = Number(`${currentThrow}${value}`)
      
      dispatch(setCurrentThrow(newValue))
   }

   useEffect(() => {
      if (isError || isGameEnd) return
      const handleKeyDown = (event: KeyboardEvent) => {
         const key = event.key
         if (key >= '0' && key <= '9') {
            const num = Number(key)
            handleClick(num)
            setActiveButton(num)
            setTimeout(() => setActiveButton(null), 100)
         }   
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [currentThrow, dispatch, isError, isGameEnd])

   return (
      <div className="score-buttons-section">
         <div className="score-input">
            {[...Array.from({ length: 9 }, (_, i) => i + 1), 0].map((num) => (
               <button 
                  key={num}
                  className={activeButton === num ? 'clicked' : ''} 
                  onClick={() => {
                     handleClick(num)
                     setActiveButton(num)
                     setTimeout(() => setActiveButton(null), 100)
                  }}>
                  {num}
               </button>
            ))}
         </div>
      </div>
   )
}

export default KeyboardButtonsOnline
