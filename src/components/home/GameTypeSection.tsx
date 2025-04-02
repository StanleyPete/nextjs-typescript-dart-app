import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameMode, setGameType, setPlayerNames, setPreviousFocusedSection } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const GameTypeSection = () => {
   const dispatch = useDispatch()
   const gameType = useSelector((state: RootState) => state.gameSettings.gameType)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   
  

   const handleGameTypeChange = (type: GameSettingsStates['gameType']) => {
      dispatch(setGameType(type))
      if (type === 'teams') {
         dispatch(setPlayerNames(['', '', '', '']))
      } else if (type === 'single') {
         dispatch(setPlayerNames(['', '']))
      } else if (type === 'online') {
         dispatch(setPlayerNames(['']))
      }
   }


   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'gameType') {
            const gameTypeOptions = ['single', 'teams', 'online'] as const
            const currentGameTypeOptionIndex = gameTypeOptions.findIndex(element => element === gameType)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentGameTypeOptionIndex + 1) % gameTypeOptions.length
               dispatch(setGameType(gameTypeOptions[nextIndex]))
               if (gameTypeOptions[nextIndex] === 'teams') {
                  dispatch(setPlayerNames(['', '', '', '']))
               } else if (gameTypeOptions[nextIndex] === 'single') {
                  dispatch(setPlayerNames(['', '']))
               } else if (gameTypeOptions[nextIndex] === 'online') {
                  dispatch(setPlayerNames(['']))
                  dispatch(setGameMode(501))
               }
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentGameTypeOptionIndex - 1 + gameTypeOptions.length) % gameTypeOptions.length
               dispatch(setGameType(gameTypeOptions[prevIndex]))
               if (gameTypeOptions[prevIndex] === 'teams') {
                  dispatch(setPlayerNames(['', '', '', '']))
               } else if (gameTypeOptions[prevIndex] === 'single') {
                  dispatch(setPlayerNames(['', '']))
               } else if (gameTypeOptions[prevIndex] === 'online') {
                  dispatch(setPlayerNames(['']))
                  dispatch(setGameMode(501))
               }
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, gameType])


   return (
      <div className='game-type main-form'>
         <p className='type header'>Game type:</p>
         <div className={`game-options ${focusedSection === 'gameType' ? 'focused' : ''}`}>
            {['single', 'teams', 'online'].map((type) => (
               <button
                  key={type}
                  className={`game-type-button ${gameType === type ? 'active' : ''}`}
                  onClick={() => handleGameTypeChange(type as GameSettingsStates['gameType'])}
               >
                  {type.charAt(0).toUpperCase() + type.slice(1)} 
               </button>
            ))}
         </div>
      </div>
   )
}

export default GameTypeSection