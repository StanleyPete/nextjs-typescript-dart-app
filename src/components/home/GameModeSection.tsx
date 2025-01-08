import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameMode } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameModeSection = () => {

   const dispatch = useDispatch()
   
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)

   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      dispatch(setGameMode(mode))
   }
 
   return (
      <div className='game-mode main-form'>
         <p className='mode header'>Game mode:</p>
         <div className="game-options">
            {[301, 501, 701, 1001, 'Cricket'].map((mode) => (
               <button
                  key={mode}
                  className={`score-button ${gameMode === mode ? 'active' : ''}`}
                  onClick={() => handleGameMode(mode)}
               >
                  {mode}
               </button>
            ))}
         </div>
      </div>
   )
}

export default GameModeSection