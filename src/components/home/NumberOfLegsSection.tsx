import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setNumberOfLegs } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const NumberOfLegsSection = () => {
   const dispatch = useDispatch()
   const { numberOfLegs, gameWin } = useSelector((state: RootState) => state.gameSettings)
   const focusedSection = useSelector((state:RootState) => state.gameSettings.focusedSection)

   const handleNnumberOfLegs = (legs: number) => {
      dispatch(setNumberOfLegs(legs))
   }

   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      return gameWin === 'best-of' ? [1, 3, 5, 7, 9] : [1, 2, 3, 4, 5, 6, 7]
   }

   const legsOptionsAvailable = getLegsOptions(gameWin)

   useEffect(() => {
      const handleArrowKeyUp = (event: KeyboardEvent) => {
         if (focusedSection === 'numberOfLegs' && gameWin === 'best-of') {
            const numberOfLegsOptions = [1, 3, 5, 7, 9] as const
            const currentNumberOfLegsOptionsIndex = numberOfLegsOptions.findIndex(element => element === numberOfLegs)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentNumberOfLegsOptionsIndex + 1) % numberOfLegsOptions.length
               dispatch(setNumberOfLegs(numberOfLegsOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentNumberOfLegsOptionsIndex - 1 + numberOfLegsOptions.length) % numberOfLegsOptions.length
               dispatch(setNumberOfLegs(numberOfLegsOptions[prevIndex]))
            }
         } else if (focusedSection === 'numberOfLegs' && gameWin === 'first-to') {
            const numberOfLegsOptions = [1, 2, 3, 4, 5, 6, 7] as const
            const currentNumberOfLegsOptionsIndex = numberOfLegsOptions.findIndex(element => element === numberOfLegs)
            if (event.key === 'ArrowRight') {
               const nextIndex = (currentNumberOfLegsOptionsIndex + 1) % numberOfLegsOptions.length
               dispatch(setNumberOfLegs(numberOfLegsOptions[nextIndex]))
            } else if (event.key === 'ArrowLeft') {
               const prevIndex = (currentNumberOfLegsOptionsIndex - 1 + numberOfLegsOptions.length) % numberOfLegsOptions.length
               dispatch(setNumberOfLegs(numberOfLegsOptions[prevIndex]))
            }
         }
      }

      window.addEventListener('keyup', handleArrowKeyUp)

      return () => {
         window.removeEventListener('keyup', handleArrowKeyUp)
      }
   }, [focusedSection, numberOfLegs])

   // UseEffect declared in order to set default numberOfLegs value in case changing winType from first-to to best-of when numberOfLegs is set to even number
   useEffect(() => {
      if (!legsOptionsAvailable.includes(numberOfLegs)) {
         dispatch(setNumberOfLegs(legsOptionsAvailable[0]))
      }
   }, [gameWin, legsOptionsAvailable, numberOfLegs, dispatch])


   return (
      <div className='legs-buttons main-form'>
         <p className='legs header'>Number of legs:</p>
         <div className={`game-options ${focusedSection === 'numberOfLegs' ? 'focused' : ''}`}>
            {getLegsOptions(gameWin).map((legs) => (
               <button
                  key={legs}
                  className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                  onClick={() => handleNnumberOfLegs(legs)}
               >
                  {legs}
               </button>
            ))}
         </div>
      </div>
   )
}

export default NumberOfLegsSection