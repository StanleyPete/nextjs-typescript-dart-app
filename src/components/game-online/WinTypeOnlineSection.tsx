import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setGameWin, setError, setGameMode, setNumberOfLegs } from '../../redux/slices/gameSettingsSlice'
import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'

const WinTypeOnlineSection = () => {
   const dispatch = useDispatch()
   
   const {gameMode, gameWin, numberOfLegs } = useSelector((state: RootState) => state.gameSettings)
   const role = useSelector((state: RootState) => state.socket.role)
   const socket = useSelector((state: RootState) => state.socket.socket)
   const gameId = useSelector((state: RootState) => state.socket.gameId)


   const handleWinType = (winType: GameSettingsStates['gameWin']) => {
      if(role === 'host'){
         dispatch(setGameWin(winType))

         const updatedGameSettings = {
            gameMode,
            gameWin: winType,
            numberOfLegs,
         }
      
         socket.emit('game-settings-change', { gameId, updatedGameSettings } )
            
      } else {
         dispatch(setError({ isError: true, errorMessage: 'You are not host!' }))
      }
   }

   useEffect(() => {
      if (role === 'guest') {
         socket.on('settings-changed', ({ updatedGameSettings }) => {
            dispatch(setGameMode(updatedGameSettings.gameMode))
            dispatch(setGameWin(updatedGameSettings.gameWin))
            dispatch(setNumberOfLegs(updatedGameSettings.numberOfLegs))
         })

         return () => {
            socket.off('settings-changed')
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