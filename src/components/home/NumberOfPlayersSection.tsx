import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { setNumberOfPlayers } from '@/redux/slices/gameSettingsSlice'

const NumberOfPlayersSection = () => {
   const dispatch = useDispatch()
   const numberOfPlayersSettings = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
 
   const handleNumberOfPlayers = (numberOfPlayers: GameSettingsStates['numberOfPlayers']) => {
      dispatch(setNumberOfPlayers(numberOfPlayers))
   }

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'numberOfPlayers') {
            const numberOfPlayersOptions = [2, 3, 4] as const
            const currentNumberOfPlayersOptionsIndex = numberOfPlayersOptions.findIndex(element => element === numberOfPlayersSettings)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentNumberOfPlayersOptionsIndex + 1) % numberOfPlayersOptions.length
               dispatch(setNumberOfPlayers(numberOfPlayersOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentNumberOfPlayersOptionsIndex - 1 + numberOfPlayersOptions.length) % numberOfPlayersOptions.length
               dispatch(setNumberOfPlayers(numberOfPlayersOptions[prevIndex]))
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, numberOfPlayersSettings])
   
 
   return (
      <div className='game-numberOfPlayers main-form'>
         <p className='numberOfPlayers header'>Number of players:</p>
         <div className={`game-options ${focusedSection === 'numberOfPlayers' ? 'focused' : ''}`}>
            {[2, 3, 4].map((numberOfPlayers) => (
               <button
                  key={numberOfPlayers}
                  className={`score-button ${numberOfPlayersSettings === numberOfPlayers ? 'active' : ''}`}
                  onClick={() => handleNumberOfPlayers(numberOfPlayers)}
               >
                  {numberOfPlayers}
               </button>
            ))}
         </div>
      </div>
   )
}

export default NumberOfPlayersSection