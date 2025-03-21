import React from 'react'
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

   const handleThrowTime = (throwTime: GameSettingsStates['throwTime']) => {
      if (role === 'host') {
         const updatedGameSettings = { throwTime: throwTime }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 

      return dispatch(setError({ isError: true, errorMessage: 'You are not the host!' }))
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

export default ThrowTimeOnlineSection