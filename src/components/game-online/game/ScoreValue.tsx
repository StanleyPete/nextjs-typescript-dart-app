'use client'
import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { handleThrowValueChangeOnline } from '@/controllers/game-online/handleThrowValueChange'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

const ScoreValueOnline = () => {
   const dispatch = useDispatch()
   const currentThrow = useSelector((state: RootState) => state.gameOnline.currentThrow)
   
   return (
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
   
      
   )
}

export default ScoreValueOnline



