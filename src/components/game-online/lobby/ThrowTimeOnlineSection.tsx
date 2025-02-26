import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setError } from '@/redux/slices/gameSettingsSlice'

const ThrowTimeOnlineSection = () => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const throwTimeSettings = useSelector((state: RootState) => state.gameSettings.throwTime)
 
   const handleThrowTime = (throwTime: GameSettingsStates['throwTime']) => {
      if (role === 'host') {
         const updatedGameSettings = { throwTime: throwTime }
         socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not the host!' }))
      }
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