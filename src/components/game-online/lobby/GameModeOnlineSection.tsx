import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError } from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { socketService } from '@/socket/socket'

const GameModeOnlineSection = () => {
   const dispatch = useDispatch()
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)

   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      if (role === 'host') {
         const updatedGameSettings = { gameMode: mode }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 

      return dispatch(setError({ isError: true, errorMessage: 'You are not the host!' }))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'gameModeOnlineSection') {
            const gameModeOptions = [301, 501, 701, 1001] 
            const currentGameModeOptionIndex = gameModeOptions.findIndex(element => element === gameMode)

            if (event.key === 'ArrowRight') {
               const nextIndex = (currentGameModeOptionIndex + 1) % gameModeOptions.length
               handleGameMode(gameModeOptions[nextIndex])
              
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentGameModeOptionIndex - 1 + gameModeOptions.length) % gameModeOptions.length
               handleGameMode(gameModeOptions[prevIndex])
               
            }
         }
      }

      window.addEventListener('keydown', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keydown', handleArrowKeyUp)
      }
   }, [focusedSection, gameMode])

   return (
      <div className='game-mode main-form'>
         <p className='mode header'>Game mode:</p>
         <div className={`game-options ${focusedSection === 'gameModeOnlineSection' ? 'focused' : ''}`}>
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