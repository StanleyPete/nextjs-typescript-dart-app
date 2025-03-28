'use client'
import React from 'react'
import { resetStates, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import '../../styles/status.scss'
import { socketService } from '@/socket/socket'

const Status = () => {
   const router = useRouter()
   const lobbyMessage = useSelector((state: RootState) => state.gameOnline?.message) ?? ''
   const joinRoomMessage = useSelector((state: RootState) => state.joinRoom?.message) ?? ''
   const message = lobbyMessage || joinRoomMessage

   return (
      <div className='status'>
         <p>{message}</p>
         <button
            onClick={() => {
               socketService.close()
               resetStates()
               router.replace('/')
            }}
         >
            Back to home page
         </button>
      </div>
   )
}

export default Status

