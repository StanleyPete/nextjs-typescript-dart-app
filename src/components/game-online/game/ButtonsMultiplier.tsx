'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector} from 'react-redux'
import { setMultiplier } from '@/redux/slices/game-online/gameOnlineSlice'

const ButtonsMultiplierOnline = () => {
   const dispatch = useDispatch()
   const multiplier = useSelector((state: RootState) => state.gameOnline.multiplier)
  
   return (
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
   )
}

export default ButtonsMultiplierOnline



