'use client'
import React from 'react'
import { SetGuestReadyProp } from '@/types/components/componentsTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const GuestReadyButton: React.FC<SetGuestReadyProp> = ({ setGuestReady }) => {

   const { socket, role, gameId } = useSelector((state: RootState) => state.socket)

   const handleGuestReadyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (socket && role === 'guest') {
         const isChecked = event.target.checked
         socket.emit('guest-ready', { gameId }) 
         setGuestReady(isChecked)
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
