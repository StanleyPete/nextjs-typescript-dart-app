'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { handleThrowValueChangeOnline } from '@/controllers/game-online/handleThrowValueChange'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

const ScoreValueOnline = () => {
   const dispatch = useDispatch()
   const [activeButton, setActiveButton] = useState<string | null>(null)
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   const isGameEnd = useSelector((state: RootState) => state.gameOnline.isGameEnd)
   const showNumberButtons = useSelector((state: RootState) => state.gameOnline.showNumberButtons)
   const { isError } = useSelector((state: RootState) => state.gameSettings.error)
   
   useEffect(() => {
      if (isGameEnd || isError) return
      const handleKeyDown = (event: KeyboardEvent) => {
        
         if (event.key === 'Backspace' && !showNumberButtons) {
            event.preventDefault()
            setActiveButton('remove-last')
            setTimeout(() => setActiveButton(null), 100)
            const newValue = String(currentThrow).slice(0, -1) 
            dispatch(setCurrentThrow(newValue ? Number(newValue) : 0))
         }
      }
   
      window.addEventListener('keydown', handleKeyDown)
   
      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [dispatch, currentThrow, showNumberButtons, isError,  isGameEnd])


   return (
      <div className='score-input-section'>
         <input
            type="number"
            value={currentThrow}
            onChange={(e) => handleThrowValueChangeOnline(e.target.value, dispatch)}
         />
         <button 
            className={`remove-last ${activeButton === 'remove-last' ? 'clicked' : ''}`}
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
   
      
   )
}

export default ScoreValueOnline



