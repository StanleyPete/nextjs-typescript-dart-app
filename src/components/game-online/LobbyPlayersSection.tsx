import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { GuestReadyProp } from '@/types/components/componentsTypes'

const LobbyPlayersSection: React.FC<GuestReadyProp> = ({ guestReady }) => {
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)

   return (
      <div className="lobby-players-section main-form">
         <p className='header'>Players:</p>
         <div className='game-online-players'>
            {/* Player 1 (host) */}
            <div className='player-host'>
               <Image
                  src='/team-1-user.svg' 
                  alt="User icon"
                  width={22}
                  height={22}
               />
               <div className='player-info'>
                  <p className="player-online-header">Player 1 (host):</p>
                  <p className="player-online-name">{playerNames[0]}</p>
               </div>
            </div>
            {/* Player 2 (guest) */}
            <div className='player-guest'>
               <Image
                  src='/team-2-user.svg' 
                  alt="User icon"
                  width={22}
                  height={22}
               />
               <div className='player-info'>
                  <p className="player-online-header">Player 2 (guest):</p>
                  <div className="player-guest-details">
                     {playerNames.length === 1 ? (
                        <span style={{ color: 'gray' }}>Player to join...</span>
                     ) : (
                        <div className="player-guest-info">
                           <p className='player-online-name'>{playerNames[1]}</p>
                           <Image
                              src={guestReady ? '/ready.svg' : '/not-ready.svg'}
                              alt={guestReady ? 'Guest Ready Image' : 'Guest Not Ready Image'}
                              width={12}
                              height={12}
                              style={{ marginLeft: '4px' }} 
                           />
                           <span className={`ready-status ${guestReady ? 'ready' : 'not-ready'}`}>
                              {guestReady ? 'ready' : 'not ready'}
                           </span>  
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
        

      </div>
   )
}

export default LobbyPlayersSection