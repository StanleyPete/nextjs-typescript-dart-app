import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameMode, setError, setGameWin, setNumberOfLegs } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameModeOnlineSection = () => {
   const dispatch = useDispatch()
   
   const {socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const {gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
   
 
   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      if(role === 'host'){
         dispatch(setGameMode(mode))

         if(socket) {
            const updatedGameSettings = {
               gameMode: mode,
               gameWin,
               numberOfLegs,
            }
   
            socket.emit('game-settings-change-req', { gameId, updatedGameSettings } )
         }

      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   useEffect(() => {
      if (role === 'guest' && socket) {
         socket.on('game-settings-change-res', ({ updatedGameSettings }) => {
            dispatch(setGameMode(updatedGameSettings.gameMode))
            dispatch(setGameWin(updatedGameSettings.gameWin))
            dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
         })
   
         return () => {
            socket.off('game-settings-change-res')
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