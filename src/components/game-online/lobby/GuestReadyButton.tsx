'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const GuestReadyButton = () => {
   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)

   const handleGuestReadyChange = () => {
      if (socket && role === 'guest') {
         socket.emit('guest-ready', { gameId }) 
      }
   }

   return (
      <div className='guest-ready-section'>
         <label className="switch">
            <input 
               type="checkbox" 
               onChange={handleGuestReadyChange} 
            />
            <span className="slider"></span>
         </label>
         <p>I am ready to start the game!</p>
      </div>
   )
}

export default GuestReadyButton
