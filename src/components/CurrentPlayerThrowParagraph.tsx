import React from 'react'
import Image from 'next/image'

interface CurrentPlayerThrowParagraphProps {
   isSoundEnabled: boolean
   toggleSound: () => void
   currentPlayerName: string
}

const CurrentPlayerThrowParagraph: React.FC<CurrentPlayerThrowParagraphProps> = ({
   isSoundEnabled,
   toggleSound,
   currentPlayerName,
}) => {
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
