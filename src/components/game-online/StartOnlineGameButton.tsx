'use client'
import React from 'react'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const StartOnlineGameButton:React.FC<GuestReadyProp> = ({ guestReady }) => {
   
   return (
      <div className="game-start">
         <button
            className="game-start-button"  
         >
         Start game!
         </button>

      </div>
   )
}

export default StartOnlineGameButton
