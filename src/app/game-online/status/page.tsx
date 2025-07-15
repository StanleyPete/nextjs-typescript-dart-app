'use client'
import React, { useEffect, useState } from 'react'
import { resetStates, RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { socketService } from '@/socket/socket'
import Footer from '@/components/Footer'
import '../../styles/status.scss'
import { setIsServerError } from '@/redux/slices/gameSettingsSlice'

const Status = () => {
   const [hydrated, setHydrated] = useState(false)
   useEffect(() => {
      sessionStorage.removeItem('online-allowed')
      sessionStorage.removeItem('gameId')
      sessionStorage.removeItem('socketId')
      sessionStorage.removeItem('storeGameOnline')
      setHydrated(true)
   }, [])

   const dispatch = useDispatch()
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
               dispatch(setIsServerError(false))
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

