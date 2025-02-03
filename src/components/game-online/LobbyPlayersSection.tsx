import React from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { GuestReadyProp } from '@/types/components/componentsTypes'


const LobbyPlayersSection: React.FC<GuestReadyProp> = ({ guestReady }) => {
   const { playerNames } = useSelector((state: RootState) => state.gameSettings)
   

   return (
      <div className="lobby-players-section main-form">
         <p className="header">Players:</p>
         <div className={`game-online-players ${playerNames[1] ? 'align-start' : ''}`}>
            {[...Array(2)].map((_, index) => (
               <div key={index}  className='game-online-player-details'>

                  {/* Player Header*/}
                  <div className="game-online-player-header">
                     <Image
                        src={index === 0 ? '/team-1-user.svg' : '/team-2-user.svg'} 
                        alt="User icon"
                        width={10}
                        height={10}
                     />
                     <p className="player-online-header">
                        Player {index + 1} {index === 0 ? '(host)' : '(guest)'}:
                     </p>
                  </div>

                  {/* Player Name */}
                  <p className="player-name">
                     {playerNames[index] ? playerNames[index] : 'Player to join'}
                  </p>

                  {/* Readiness status for guest player */}
                  {index === 1 && playerNames[1] && (
                     <div className="readiness-status-section">
                        <Image
                           src={guestReady ? '/ready.svg' : '/not-ready.svg'}
                           alt={guestReady ? 'Guest Ready' : 'Guest Not Ready'}
                           width={12}
                           height={12}
                        />
                        <span className={`ready-status ${guestReady ? 'ready' : 'not-ready'}`}>
                           {guestReady ? 'ready' : 'not ready'}
                        </span>  
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   )
}

export default LobbyPlayersSection