import React  from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/redux/store'

const LobbyPlayersSection = () => {
   const playerNames = useSelector((state: RootState) => state.gameSettings.playerNames)
   const numberOfPlayers = useSelector((state: RootState) => state.gameSettings.numberOfPlayers)
   const players =  useSelector((state: RootState) => state.gameOnline.players)
   
   return (
      <div className="lobby-players-section main-form">
         <p className="header">Players:</p>
         <div className={`game-online-players ${playerNames[1] ? 'align-start' : ''}`}>
            {[...Array(numberOfPlayers)].map((_, index) => (
               <div key={index}  className='game-online-player-details'>
                  {/* Player Header*/}
                  <div className="game-online-player-header">
                     <Image
                        src={
                           index === 0
                              ? '/user-online-host.svg'
                              : !players[index] 
                                 ? '/user-online-empty-seat.svg'
                                 : players[index].ready 
                                    ? '/user-online-guest-ready.svg'
                                    : '/user-online-guest-not-ready.svg' 
                        }
                        alt="User icon"
                        width={22}
                        height={22}
                     />
                  </div>

                  {/* Player Name */}
                  <p className='player-name'>
                     {players[index]?.name ?? 'Empty seat'}
                  </p>

                  {/* Readiness status or host label */}
                  <div className="readiness-status-section">
                     {players[index] ? (
                        index === 0 ? (
                           <span className="host-label">(Host)</span>
                        ) : (
                           <span className={`ready-status ${players[index].ready ? 'ready' : 'not-ready'}`}>
                              {players[index].ready ? '(Ready)' : '(Not ready)'}
                           </span>
                        )
                     ) : (
                        <span className="empty-status">(Awaiting...)</span>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

export default LobbyPlayersSection