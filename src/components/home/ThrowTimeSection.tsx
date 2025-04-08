import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setFocusedSection, setThrowTime } from '@/redux/slices/gameSettingsSlice'

const ThrowTimeSection = () => {
   const dispatch = useDispatch()
   const throwTimeSettings = useSelector((state: RootState) => state.gameSettings.throwTime)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
 
   const handleThrowTime = (throwTime: GameSettingsStates['throwTime']) => {
      dispatch(setFocusedSection('timeToThrow'))
      dispatch(setThrowTime(throwTime))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'timeToThrow') {
            const timeToThrowOptions = [30, 45, 60] as const
            const currentTimeToThrowOptionsIndex = timeToThrowOptions.findIndex(element => element === throwTimeSettings)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentTimeToThrowOptionsIndex + 1) % timeToThrowOptions.length
               dispatch(setThrowTime(timeToThrowOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentTimeToThrowOptionsIndex - 1 + timeToThrowOptions.length) % timeToThrowOptions.length
               dispatch(setThrowTime(timeToThrowOptions[prevIndex]))
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, throwTimeSettings])
 
   return (
      <div className='game-throwTime main-form'>
         <p className='throwTime header'>Time to throw:</p>
         <div className={`game-options ${focusedSection === 'timeToThrow' ? 'focused' : ''}`}>
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