import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setFocusedSection, setGameMode } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'


const GameModeSection = () => {
   const dispatch = useDispatch()
   const gameMode = useSelector((state: RootState) => state.gameSettings.gameMode)
   const gameType = useSelector((state:RootState) => state.gameSettings.gameType)
   const focusedSection = useSelector((state:RootState) => state.gameSettings.focusedSection)
   const availableModes = gameType === 'online' ? [301, 501, 701, 1001] : [301, 501, 701, 1001, 'Cricket']

   const handleGameMode = (mode: GameSettingsStates['gameMode']) => {
      dispatch(setFocusedSection('gameMode'))
      dispatch(setGameMode(mode))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'gameMode' && gameType !== 'online') {
            const gameModeOptions = [301, 501, 701, 1001, 'Cricket'] 
            const currentGameModeOptionIndex = gameModeOptions.findIndex(element => element === gameMode)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentGameModeOptionIndex + 1) % gameModeOptions.length
               dispatch(setGameMode(gameModeOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentGameModeOptionIndex - 1 + gameModeOptions.length) % gameModeOptions.length
               dispatch(setGameMode(gameModeOptions[prevIndex]))
            }
         } else if (focusedSection === 'gameMode' && gameType ==='online') {
            const gameModeOptions = [301, 501, 701, 1001] 
            const currentGameModeOptionIndex = gameModeOptions.findIndex(element => element === gameMode)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentGameModeOptionIndex + 1) % gameModeOptions.length
               dispatch(setGameMode(gameModeOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentGameModeOptionIndex - 1 + gameModeOptions.length) % gameModeOptions.length
               dispatch(setGameMode(gameModeOptions[prevIndex]))
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, gameMode, gameType])

   
   return (
      <div className='game-mode main-form'>
         <p className='mode header'>Game mode:</p>
         <div className={`game-options ${focusedSection === 'gameMode' ? 'focused' : ''}`}>
            {availableModes.map((mode) => (
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