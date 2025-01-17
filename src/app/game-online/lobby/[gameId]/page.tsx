'use client'
import React, { useEffect } from 'react'
import UrlSection from '@/components/game-online/UrlSection'
import LobbyPlayersSection from '@/components/game-online/LobbyPlayersSection'
import GameModeOnlineSection from '@/components/game-online/GameModeOnlineSection'
import WinTypeOnlineSection from '@/components/game-online/WinTypeOnlineSection'
import NumberOfLegsOnlineSection from '@/components/game-online/NumberOfLegsOnlineSection'
import StartOnlineGameButton from '@/components/game-online/StartOnlineGameButton'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import PageNotFound from '@/components/game-online/PageNotFound'
import '../../../styles/home.scss'
import ErrorPopUp from '@/components/ErrorPopUp'


const Lobby = () => {

   const isSocketStateAvailable = useSelector((state: RootState) => 'socket' in state)

   // Jeśli klucz "socket" nie istnieje w Redux Store, wyświetl PageNotFound
   if (!isSocketStateAvailable) {
      return <PageNotFound />
   }

   const { socket, role } = useSelector((state: RootState) => state.socket)

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <h1 className='game-header'>
            GAME LOBBY
         </h1>

         {/* URL SECTION */}
         <UrlSection />

         {/* PLAYERS SECTION */}
         <LobbyPlayersSection />

         {/* GAME MODE SECTION */}
         <GameModeOnlineSection />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeOnlineSection />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsOnlineSection />

         {/* NUMBER OF LEGS SECTION*/}
         <StartOnlineGameButton />

         {/*ERROR POP UP*/}
         <ErrorPopUp />
      </div>
   )
}

export default Lobby

