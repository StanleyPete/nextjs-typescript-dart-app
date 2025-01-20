import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setNumberOfLegs, setError, setGameMode, setGameWin } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const NumberOfLegsOnlineSection = () => {
   const dispatch = useDispatch()
   
   const {socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const {gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
 
   const handleNumberOfLegs = (legs: number) => {
      if(role === 'host'){
         dispatch(setNumberOfLegs(legs))      

         if(socket) {
            const updatedGameSettings = {
               gameMode,
               gameWin,
               numberOfLegs: legs
            }
   
            socket.emit('game-settings-change-req', { gameId, updatedGameSettings } )
         }

      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   const getLegsOptions = (gameWin: GameSettingsStates['gameWin']) => {
      if (gameWin === 'best-of') {
         return [1, 3, 5, 7, 9]
      } else {
         return [1, 2, 3, 4, 5, 6, 7]
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