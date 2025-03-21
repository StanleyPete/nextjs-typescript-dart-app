import React from 'react'
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

   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      if(role === 'host'){
         const updatedGameSettings = { gameWin: winType }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 
      
      return dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
   }

   return (
      <div className='win-type main-form'>
         <p className='type header'>Win type:</p>
         <div className="game-options">
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