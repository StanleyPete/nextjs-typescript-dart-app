'use client'
import React  from 'react'
import LobbyPlayersSection from '@/components/game-online/LobbyPlayersSection'
import GameModeSection from '@/components/home/GameModeSection'
import WinTypeSection from '@/components/home/WinTypeSection'
import NumberOfLegsSection from '@/components/home/NumberOfLegsSection'

const Lobby = () => {

   return (
      <div className='main-container form'>
         {/* GAME LOBBY HEADER */}
         <h1 className='game-online-header'>
            GAME LOBBY
         </h1>

         <LobbyPlayersSection />

         {/* GAME MODE SECTION */}
         <GameModeSection />
                 
         {/* WIN TYPE SECTION */}
         <WinTypeSection />
                 
         {/* NUMBER OF LEGS SECTION*/}
         <NumberOfLegsSection />
      </div>
   )
}

export default Lobby

