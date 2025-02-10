'use client'
import React from 'react'

interface JoinLeaveNotificationProps {
    type: 'joined' | 'left' | null
    playerName: string
}

const JoinLeaveNotification: React.FC<JoinLeaveNotificationProps> = ( { type, playerName }) => {


   return (
      <div className='notification'>
         {type === 'joined' && (
            <div className='join-notification'> 
               <span className="player-joined-notification">{playerName} joined</span>
            </div>
         )}
         {type === 'left' && (
            <div className='leave-notification'> 
               <span className="player-left-notification">{playerName} left</span>
            </div>
         )}
      </div>
   )
}

export default JoinLeaveNotification