import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setError } from '@/redux/slices/gameSettingsSlice'
import { socketService } from '@/socket/socket'

const ThrowTimeOnlineSection = () => {
   const dispatch = useDispatch()
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const throwTimeSettings = useSelector((state: RootState) => state.gameSettings.throwTime)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)

   const handleThrowTime = (throwTime: GameSettingsStates['throwTime']) => {
      if (role === 'host') {
         const updatedGameSettings = { throwTime: throwTime }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 

      return dispatch(setError({ isError: true, errorMessage: 'You are not the host!' }))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'ThrowTimeOnlineSection') {
            const throwTimeOptions = [30, 45, 60] 
            const currentThrowTimeSettingsOption = throwTimeOptions.findIndex(element => element === throwTimeSettings)

            if (event.key === 'ArrowRight') {
               const nextIndex = (currentThrowTimeSettingsOption + 1) % throwTimeOptions.length
               handleThrowTime(throwTimeOptions[nextIndex])
               
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentThrowTimeSettingsOption - 1 + throwTimeOptions.length) % throwTimeOptions.length
               handleThrowTime(throwTimeOptions[prevIndex])
               
            }
         }
      }

      window.addEventListener('keydown', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keydown', handleArrowKeyUp)
      }
   }, [focusedSection, throwTimeSettings])
 
   return (
      <div className='game-throwTime main-form'>
         <p className='throwTime header'>Time to throw:</p>
         <div className={`game-options ${focusedSection === 'ThrowTimeOnlineSection' ? 'focused' : ''}`}>
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

export default ThrowTimeOnlineSection