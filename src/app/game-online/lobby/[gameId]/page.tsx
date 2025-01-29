'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UrlToCopySection from '@/components/game-online/UrlToCopySection'
import LobbyPlayersSection from '@/components/game-online/LobbyPlayersSection'
import GameModeOnlineSection from '@/components/game-online/GameModeOnlineSection'
import WinTypeOnlineSection from '@/components/game-online/WinTypeOnlineSection'
import NumberOfLegsOnlineSection from '@/components/game-online/NumberOfLegsOnlineSection'
import StartOnlineGameButton from '@/components/game-online/StartOnlineGameButton'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import '../../../styles/home.scss'
import ErrorPopUp from '@/components/ErrorPopUp'
import GameLobbyHeader from '@/components/game-online/GameLobbyHeader'
import GuestReadyButton from '@/components/game-online/GuestReadyButton'

const Lobby = () => {
   const router = useRouter()
   const [guestReady, setGuestReady] = useState<boolean>(false)
   const { socket, role } = useSelector((state: RootState) => state.socket)
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   useEffect(() => {
      if (role === 'host' && socket) {
         socket.on('guest-ready-res', () => {
            setGuestReady(prev => !prev) 
         })
      }
   }, [socket, role])

   useEffect(() => {
      if (!socket) {
         return router.push('/')
      }
   }, [socket, router])

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <GameLobbyHeader />

         {/* URL SECTION  / JOIN/LEAVE NOTIFICATION */}
         {
            playerNames.length < 2 
               ? ( <UrlToCopySection />) 
               : (null)
         }

         {/* PLAYERS SECTION */}
         <LobbyPlayersSection guestReady={guestReady} />

         {/* GAME MODE SECTION */}
         <GameModeOnlineSection guestReady={guestReady} />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeOnlineSection guestReady={guestReady} />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsOnlineSection guestReady={guestReady}/>

         {/* START GAME / GAME READY BUTTONS*/}
         {
            role === 'host' 
               ? (<StartOnlineGameButton guestReady={guestReady}/>)
               : (<GuestReadyButton setGuestReady={setGuestReady} />)
         }

         {/*ERROR POP UP*/}
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

