import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameWin } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const WinTypeSection = () => {

   const dispatch = useDispatch()
   
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)

   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      dispatch(setGameWin(winType))
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

export default WinTypeSection