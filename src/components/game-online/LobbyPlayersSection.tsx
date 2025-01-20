import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Image from 'next/image'
// import { setPlayerNames } from '@/redux/slices/gameSettingsSlice'

const LobbyPlayersSection = () => {
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   

   return (
      <div className="lobby-players-section main-form">
         <p className='header'>Players:</p>
         <div className='game-online-players'>
            <div className='player-host'>
               <Image
                  src='/team-1-user.svg' 
                  alt="User icon"
                  width={16}
                  height={16}
               />
               {playerNames[0]} (host)
            </div>
            <div className='player-joiner'>
               <Image
                  src='/team-2-user.svg' 
                  alt="User icon"
                  width={16}
                  height={16}
               />
               <span>
                  {playerNames.length === 1 ? 'Player to join' : playerNames[1] || 'Waiting for player...'}
               </span>
            </div>
         </div>
        

      </div>
   )
}

export default LobbyPlayersSection