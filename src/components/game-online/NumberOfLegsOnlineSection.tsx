import React, { useEffect } from 'react'
//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setNumberOfLegs, setError} from '../../redux/slices/gameSettingsSlice'
//Types
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const NumberOfLegsOnlineSection:React.FC<GuestReadyProp> = ({ guestReady }) => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
   
   //NUMBER OF LEGS HANDLER:
   const handleNumberOfLegs = (legs: number) => {
      if (socket && role === 'host' && !guestReady) {
         const updatedGameSettings = { numberOfLegs: legs }
         socket.emit('game-settings-change-request', { gameId, updatedGameSettings } )
      } else if ( socket && role === 'host' && guestReady) {
         dispatch(setError({ isError: true, errorMessage: 'Your opponent is ready. You cannot change settings now!' }))
      }

      if (role === 'guest') {
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

   //HOST LISTENER
   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('game-settings-changed', ({ updatedGameSettings }) => {
            dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
         })

         socket.on('game-settings-change-failed', ({ message }) => {
            dispatch(setError({ isError: true, errorMessage: message }))
         })
   
         return () => {
            socket.off('game-settings-changed')
            socket.off('game-settings-change-failed')
         }
      }
   }, [socket, role, dispatch])

   //GUEST LISTENER
   useEffect(() => {
      if (role === 'guest' && socket) {
         socket.on('game-settings-changed', ({ updatedGameSettings }) => {
            dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
         })
   
         return () => {
            socket.off('game-settings-changed')
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