import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setError} from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'


const NumberOfLegsOnlineSection = () => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
   
   //NUMBER OF LEGS HANDLER:
   const handleNumberOfLegs = (legs: number) => {
      if (role === 'host') {
         const updatedGameSettings = { numberOfLegs: legs }
         socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }   
   }

   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      return gameWin === 'best-of' ? [1, 3, 5, 7, 9] : [1, 2, 3, 4, 5, 6, 7]
   }

   const legsOptionsAvailable = getLegsOptions(gameWin)

   // UseEffect declared in order to set default numberOfLegs value in case changing winType from first-to to best-of when numberOfLegs is set to even number
   useEffect(() => {
      if (role === 'host' && !legsOptionsAvailable.includes(numberOfLegs)) {
         const updatedGameSettings = { numberOfLegs: legsOptionsAvailable[0] }
         socket?.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      }
   }, [gameWin, legsOptionsAvailable, numberOfLegs, dispatch, socket, role])


   return (
      <div className='legs-buttons main-form'>
         <p className='legs header'>Number of legs:</p>
         <div className="game-options">
            {getLegsOptions(gameWin).map((legs) => (
               <button
                  key={legs}
                  className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                  onClick={() => handleNumberOfLegs(legs)}
               >
                  {legs}
               </button>
            ))}
         </div>
      </div>
   )
}

export default NumberOfLegsOnlineSection