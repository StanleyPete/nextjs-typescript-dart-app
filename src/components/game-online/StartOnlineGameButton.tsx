'use client'
import React from 'react'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const StartOnlineGameButton:React.FC<GuestReadyProp> = ({ guestReady }) => {
   
   return (
      <div className="game-start">
         <button
            className="game-start-button" 
            style={{
               filter: !guestReady ? 'brightness(0.6)' : 'none', // Przyciemnia przycisk
               boxShadow: !guestReady ? 'inset 0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.3)',
               cursor: !guestReady ? 'not-allowed' : 'pointer',
               transition: 'all 0.2s ease-in-out'
            }}
            disabled={!guestReady} // Opcjonalnie, jeśli chcesz zablokować kliknięcie
         >
         Start game!
         </button>

      </div>
   )
}

export default StartOnlineGameButton
