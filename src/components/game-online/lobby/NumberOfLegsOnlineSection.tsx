import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setError} from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { updateGameSettings } from '@/redux/actions/websocketActions'
import { socketService } from '@/socket/socket'

const NumberOfLegsOnlineSection = () => {
   const dispatch = useDispatch()
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const gameWin = useSelector((state: RootState) => state.gameSettings.gameWin)
   const numberOfLegs = useSelector((state: RootState) => state.gameSettings.numberOfLegs)
   
   //NUMBER OF LEGS HANDLER:
   const handleNumberOfLegs = (legs: number) => {
      if (role === 'host') {
         const updatedGameSettings = { numberOfLegs: legs }
         socketService.emitUpdateGameSettings(gameId, updatedGameSettings)
         return
      } 
      
      return dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))  
   }

   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      return gameWin === 'best-of' 
         ? [1, 3, 5, 7, 9] 
         : [1, 2, 3, 4, 5, 6, 7]
   }

   const legsOptionsAvailable = getLegsOptions(gameWin)

   // UseEffect declared in order to set default numberOfLegs value in case changing winType from first-to to best-of when numberOfLegs is set to even number
   useEffect(() => {
      if (role === 'host' && !legsOptionsAvailable.includes(numberOfLegs)) {
         const updatedGameSettings = { numberOfLegs: legsOptionsAvailable[0] }
         dispatch(updateGameSettings({ gameId, updatedGameSettings }))
      }
   }, [gameWin, legsOptionsAvailable, numberOfLegs, dispatch, role])


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