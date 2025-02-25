import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'


const WinTypeOnlineSection = () => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameWin } = useSelector((state: RootState) => state.gameSettings)

   //WIND TYPE CHANGE HANDLER:
   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      if(role === 'host'){
         const updatedGameSettings = { gameWin: winType }
         socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )  
      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
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