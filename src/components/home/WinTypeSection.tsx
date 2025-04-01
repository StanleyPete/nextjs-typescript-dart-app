import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameWin } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const WinTypeSection = () => {
   const dispatch = useDispatch()
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)

   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      dispatch(setGameWin(winType))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'winType') {
            const winTypeOptions = ['best-of', 'first-to'] as const
            const currentWinTypeOptionIndex = winTypeOptions.findIndex(element => element === gameWin)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentWinTypeOptionIndex + 1) % winTypeOptions.length
               dispatch(setGameWin(winTypeOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentWinTypeOptionIndex - 1 + winTypeOptions.length) % winTypeOptions.length
               dispatch(setGameWin(winTypeOptions[prevIndex]))
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, gameWin])

   return (
      <div className='win-type main-form'>
         <p className='type header'>Win type:</p>
         <div className={`game-options ${focusedSection === 'winType' ? 'focused' : ''}`}>
            {['best-of', 'first-to'].map((winType) => (
               <button 
                  key={winType}
                  className={`win-type-button ${gameWin === winType ? 'active' : ''}`} 
                  onClick={() => handleWinType(winType as GameSettingsStates['gameWin'])}
               >
                  {winType === 'best-of' ? 'Best Of' : 'First To'}
               </button>
            ))}
         </div>
      </div>
   )
}

export default WinTypeSection