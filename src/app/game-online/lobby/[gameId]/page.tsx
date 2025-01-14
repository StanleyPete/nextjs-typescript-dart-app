'use client'
import React  from 'react'
import UrlSection from '@/components/game-online/UrlSection'
import LobbyPlayersSection from '@/components/game-online/LobbyPlayersSection'
import GameModeSection from '@/components/home/GameModeSection'
import WinTypeSection from '@/components/home/WinTypeSection'
import NumberOfLegsSection from '@/components/home/NumberOfLegsSection'
import StartOnlineGameButton from '@/components/game-online/StartOnlineGameButton'
// import { RootState } from '@/redux/store'
// import { useSelector} from 'react-redux'



const Lobby = () => {

   // const socket = useSelector((state: RootState) => state.socket?.socket ?? null)

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
         <GameModeSection />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeSection />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsSection />

         {/* NUMBER OF LEGS SECTION*/}
         <StartOnlineGameButton />
      </div>
   )
}

export default Lobby

