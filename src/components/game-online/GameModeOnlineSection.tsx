import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameMode, setError, setGameWin, setNumberOfLegs } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameModeOnlineSection = () => {
   const dispatch = useDispatch()
   
   const {gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
   const role = useSelector((state: RootState) => state.socket.role)
   const socket = useSelector((state: RootState) => state.socket.socket)
   const gameId = useSelector((state: RootState) => state.socket.gameId)

   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      if(role === 'host'){
         dispatch(setGameMode(mode))

         const updatedGameSettings = {
            gameMode: mode,
            gameWin,
            numberOfLegs,
         }

         socket.emit('game-settings-change', { gameId, updatedGameSettings } )

      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   useEffect(() => {
      if (role === 'guest') {
         socket.on('settings-changed', ({ updatedGameSettings }) => {
            dispatch(setGameMode(updatedGameSettings.gameMode))
            dispatch(setGameWin(updatedGameSettings.gameWin))
            dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
         })
   
         return () => {
            socket.off('settings-changed')
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