import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { socketService } from '@/socket/socket'


const WinTypeOnlineSection = () => {
   const dispatch = useDispatch()
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)

   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      if(role === 'host'){
         const updatedGameSettings = { gameWin: winType }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 
      
      return dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'winTypeOnlineSection') {
            const gameWinOptions = ['best-of', 'first-to'] 
            const currentGameWinOptionIndex = gameWinOptions.findIndex(element => element === gameWin)

            if (event.key === 'ArrowRight') {
               const nextIndex = (currentGameWinOptionIndex + 1) % gameWinOptions.length
               handleWinType(gameWinOptions[nextIndex] as GameSettingsStates['gameWin'])
               
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentGameWinOptionIndex - 1 + gameWinOptions.length) % gameWinOptions.length
               handleWinType(gameWinOptions[prevIndex] as GameSettingsStates['gameWin'])
               
            }
         }
      }

      window.addEventListener('keydown', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keydown', handleArrowKeyUp)
      }
   }, [focusedSection, gameWin])

   return (
      <div className='win-type main-form'>
         <p className='type header'>Win type:</p>
         <div className={`game-options ${focusedSection === 'winTypeOnlineSection' ? 'focused' : ''}`}>
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

export default WinTypeOnlineSection