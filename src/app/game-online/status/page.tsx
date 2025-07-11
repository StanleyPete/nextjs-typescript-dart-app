'use client'
import React, { useEffect, useState } from 'react'
import { resetStates, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { socketService } from '@/socket/socket'
import Footer from '@/components/Footer'
import '../../styles/status.scss'

const Status = () => {
   const [hydrated, setHydrated] = useState(false)
   useEffect(() => {
      sessionStorage.removeItem('online-allowed')
      sessionStorage.removeItem('gameId')
      sessionStorage.removeItem('socketId')
      setHydrated(true)

   }, [])

   
   const router = useRouter()
   const lobbyMessage = useSelector((state: RootState) => state.gameOnline?.message) ?? 'Connection lost'
   const joinRoomMessage = useSelector((state: RootState) => state.joinRoom?.message) ?? 'Connection lost'
   const message = lobbyMessage || joinRoomMessage || 'Connection lost'
   
   if (!hydrated) return null

   return (
      <div className='status'>
         <p className='status-message'>{message}</p>
         <button
            onClick={() => {
               socketService.close()
               resetStates()
               router.replace('/')
            }}
         >
            Back to home page
         </button>
         <Footer githubLogoSrc='/github-mark-white.svg' />
      </div>
   )
}

export default Status

