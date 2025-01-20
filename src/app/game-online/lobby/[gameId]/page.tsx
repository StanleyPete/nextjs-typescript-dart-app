'use client'
import React from 'react'
import UrlToCopySection from '@/components/game-online/UrlToCopySection'
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
import GameLobbyHeader from '@/components/game-online/GameLobbyHeader'

const Lobby = () => {
   
   const { socket } = useSelector((state: RootState) => state.socket)
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   
   if (!socket) {
      return <PageNotFound />
   }

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <GameLobbyHeader />

         {/* URL SECTION  / JOIN/LEAVE NOTIFICATION */}
         {playerNames.length < 2 ? (
            <UrlToCopySection />
         ) : (
            null
         )}

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

