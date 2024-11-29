import React from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
   setIsSoundEnabled
} from '@/redux/slices/gameRegularSlice'


const CurrentPlayerThrowParagraph = () => {

   const dispatch = useDispatch()

   const { 
      players, 
      currentPlayerIndex,
      isSoundEnabled 
   } = useSelector((state: RootState) => state.gameRegular)
   const currentPlayerName = players[currentPlayerIndex].name

   //SOUND TOGGLE HANDLER
   const toggleSound = () => {
      dispatch(setIsSoundEnabled(!isSoundEnabled))
   }
   
   return (
      //CURRENT PLAYER THROW PARAGRAPH
      <p className="current-player-throw">

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
            {`${currentPlayerName.toUpperCase()}'S TURN TO THROW!`}
         </span>
         
      </p>
   )
}

export default CurrentPlayerThrowParagraph
