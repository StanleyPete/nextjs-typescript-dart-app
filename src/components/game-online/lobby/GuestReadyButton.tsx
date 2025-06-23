'use client'
import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { socketService } from '@/socket/socket'

const GuestReadyButton = () => {
   const [isReady, setIsReady] = useState(false)
   const role =  useSelector((state: RootState) => state.gameOnline.role)
   const gameId =  useSelector((state: RootState) => state.gameOnline.gameId)
   const focusedSection = useSelector((state: RootState) => state.gameSettings.focusedSection)
   
   const handleGuestReadyChange = () => {
      if (role === 'guest') {
         const newValue = !isReady
         setIsReady(newValue)
         return socketService.emitGuestReady(gameId)
      }
   }

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (focusedSection === 'guestReadyButton' && event.key === 'Enter') {
            handleGuestReadyChange()
         }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => { window.removeEventListener('keydown', handleKeyDown) }
   }, [focusedSection, isReady])

   return (
      <div className='guest-ready-section'>
         <div className={`switch-wrapper ${focusedSection === 'guestReadyButton' ? 'focused' : ''}`}>
            <label className="switch">
               <input 
                  type="checkbox"
                  checked={isReady} 
                  onChange={handleGuestReadyChange} 
               />
               <span className="slider"></span>
            </label>
         </div>
         <p>I am ready to start the game!</p>
      </div>
   )
}

export default GuestReadyButton
