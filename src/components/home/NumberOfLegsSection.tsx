import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setNumberOfLegs } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const NumberOfLegsSection = () => {

   const dispatch = useDispatch()
   
   const { numberOfLegs, gameWin } = useSelector((state: RootState) => state.gameSettings)

   const handleNnumberOfLegs = (legs: number) => {
      dispatch(setNumberOfLegs(legs))
   }

   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      if (gameWin === 'best-of') {
         return [1, 3, 5, 7, 9]
      } else {
         return [1, 2, 3, 4, 5, 6, 7]
      }
   }

   return (
      <div className='legs-buttons main-form'>
         <p className='legs header'>Number of legs:</p>
         <div className="game-options">
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