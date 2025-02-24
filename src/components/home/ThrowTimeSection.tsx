import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setThrowTime } from '@/redux/slices/gameSettingsSlice'

const ThrowTimeSection = () => {
   const dispatch = useDispatch()
   
   const throwTimeSettings = useSelector((state: RootState) => state.gameSettings.throwTime)
 
   const handleThrowTime = (throwTime: GameSettingsStates['throwTime']) => {
      dispatch(setThrowTime(throwTime))
   }
 
   return (
      <div className='game-throwTime main-form'>
         <p className='throwTime header'>Time to throw:</p>
         <div className="game-options">
            {[30, 45, 60].map((throwTime) => (
               <button
                  key={throwTime}
                  className={`score-button ${throwTimeSettings === throwTime ? 'active' : ''}`}
                  onClick={() => handleThrowTime(throwTime)}
               >
                  {`${throwTime}s`}
               </button>
            ))}
         </div>
      </div>
   )
}

export default ThrowTimeSection