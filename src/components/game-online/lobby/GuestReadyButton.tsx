'use client'
import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { socketService } from '@/socket/socket'

const GuestReadyButton = () => {
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   
   const handleGuestReadyChange = () => {
      if (role === 'guest') return socketService.emitGuestReady(gameId)
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
