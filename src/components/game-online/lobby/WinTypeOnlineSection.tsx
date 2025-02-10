import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameWin, setError } from '../../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const WinTypeOnlineSection:React.FC<GuestReadyProp> = ({ guestReady }) => {
   const dispatch = useDispatch()
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)
   const { gameWin } = useSelector((state: RootState) => state.gameSettings)

   //WIND TYPE CHANGE HANDLER:
   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      if( socket && role === 'host' && !guestReady){
         const updatedGameSettings = { gameWin: winType }
         socket.emit('game-settings-change-request', { gameId, updatedGameSettings } )  
      } else if ( socket && role === 'host' && guestReady) {
         dispatch(setError({ isError: true, errorMessage: 'Your opponent is ready. You cannot change settings now!' }))
      }

      if (role === 'guest'){
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   //HOST LISTENER
   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('game-settings-changed', ({ updatedGameSettings }) => {
            dispatch(setGameWin(updatedGameSettings.gameWin))
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
            dispatch(setGameWin(updatedGameSettings.gameWin)) 
         })

         return () => {
            socket.off('game-settings-changed')
         }
      }
   }, [socket, role, dispatch])

   return (
      <div className='win-type main-form'>
         <p className='type header'>Win type:</p>
         <div className="game-options">
            {['best-of', 'first-to'].map((winType) => (
               <button 
                  key={winType}
                  className={`win-type-button ${gameWin === winType ? 'active' : ''}`} 
                  onClick={() => handleWinType(winType as GameSettingsStates['gameWin'])}
               >
                  {winType === 'best-of' ? 'Best Of' : 'First To'}
               </button>
            ))}
         </div>
      </div>
   )
}

export default WinTypeOnlineSection