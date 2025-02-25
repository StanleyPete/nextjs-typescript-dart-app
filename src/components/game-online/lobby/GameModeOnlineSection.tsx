import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameModeOnlineSection = () => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameMode } = useSelector((state: RootState) => state.gameSettings)
    
   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      if(role === 'host'){
         const updatedGameSettings = { gameMode: mode }
         socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not the host!' }))
      }
   }

   return (
      <div className='game-mode main-form'>
         <p className='mode header'>Game mode:</p>
         <div className="game-options">
            {[301, 501, 701, 1001].map((mode) => (
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

export default GameModeOnlineSection