import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { setIsSoundEnabled } from '@/redux/slices/game-online/gameOnlineSlice'
import CurrentPlayerTurnTimeoutSection from './CurrentPlayerTurnTimeoutSection'

const CurrentPlayerThrowOnlineSection = () => {
   const dispatch = useDispatch()
   const players = useSelector((state: RootState) => state.gameOnline.players)
   const currentPlayerIndex = useSelector((state: RootState) => state.gameOnline.currentPlayerIndex)
   const isSoundEnabled = useSelector((state: RootState) => state.gameOnline.isSoundEnabled)
   const isItYourTurn = useSelector((state: RootState) => state.gameOnline.isItYourTurn)

   const toggleSound = () => {
      const currentIsSoundEnabled = isSoundEnabled
      dispatch(setIsSoundEnabled(!currentIsSoundEnabled))
   }
   
   return (
      <div className="current-player-throw">
         {/* Button to toggle sound */}
         <button className="sound-button" onClick={toggleSound}>
            <Image
               src={isSoundEnabled ? '/sound-on.svg' : '/sound-off.svg'}
               alt={isSoundEnabled ? 'Sound On' : 'Sound Off'}
               width={16}
               height={16}
            />
            <span>{isSoundEnabled ? 'On' : 'Off'}</span>
         </button>
         {/* Current player's turn message */}
         <span className="current-player-throw-message">
            {`${players[currentPlayerIndex].name.toUpperCase()}'S TURN TO THROW!`}
         </span>
         {isItYourTurn ? <CurrentPlayerTurnTimeoutSection /> : null}
         
      </div>
   )
}

export default CurrentPlayerThrowOnlineSection
