import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameMode, setError } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const GameModeOnlineSection:React.FC<GuestReadyProp> = ({ guestReady }) => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameMode } = useSelector((state: RootState) => state.gameSettings)
   
 
   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      if(socket && role === 'host' && !guestReady){
         const updatedGameSettings = { gameMode: mode }
         socket.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      } else if ( socket && role === 'host' && guestReady) {
         dispatch(setError({ isError: true, errorMessage: 'Your opponent is ready. You cannot change settings now!' }))
      }

      if (role === 'guest'){
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   //HOST LISTENER
   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('game-settings-changed', ({ updatedGameSettings }) => {
            dispatch(setGameMode(updatedGameSettings.gameMode))
         })

         socket.on('game-settings-change-failed', ({ message }) => {
            dispatch(setError({ isError: true, errorMessage: message }))
         })
   
         return () => {
            socket.off('game-settings-changed')
            socket.off('game-settings-change-failed')
         }
      }
   }, [socket, role, dispatch])
   
   //GUEST LISTENER
   useEffect(() => {
      if (role === 'guest' && socket) {
         socket.on('game-settings-changed', ({ updatedGameSettings }) => {
            dispatch(setGameMode(updatedGameSettings.gameMode))
         })
   
         return () => {
            socket.off('game-settings-changed')
         }
      }
   }, [socket, role, dispatch])
 
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

export default GameModeOnlineSection