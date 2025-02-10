import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
//Types

import { PlayerOnline } from '@/types/redux/gameOnlineTypes'
//Lib
import checkoutArray from '@/lib/checkout-table'

const GameOnlinePlayersSection = () => {
   
   const { players, currentPlayerIndex } = useSelector((state: RootState) => state.gameOnline)
   
   return (
      <div className="game-players-section">
         <div className='two-players-preview'>
            {players.map((player: PlayerOnline, index:number) => (
               <div key={index} className={`current-player-section ${currentPlayerIndex === index ? 'current-active-player' : ''}`}>

                  {/*PLAYER HEADER SECTION*/}
                  <div className="current-player-name-legs">
                     <div className="current-player-name">

                        {/*Player header image (active/non-active)*/}
                        <Image
                           src={player.name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'}
                           alt="User icon"
                           width={16}
                           height={16}
                        />

                        {/*Player header name*/}
                        {player.name}

                     </div>

                     {/*Player header legs*/}
                     <div className="player-legs">
                        {player.legs}
                     </div>
                  </div>

                  {/*PLAYER POINTS LEFT SECTION*/}
                  <p className="current-player-points-left">{player.pointsLeft}</p>

                  {/*CHECKOUT OPTIONS SECTION*/}
                  {player.pointsLeft <= 170 && (
                     <p className="checkout-options">{checkoutArray[player.pointsLeft - 2]}</p>
                  )}

                  {/*PLAYER STATS SECTION*/}
                  <div className="current-player-stats">
                    3-DART AVERAGE:
                     <p>{player.average.toFixed(2)}</p>
                  </div>

                  <div className="current-player-stats">
                    LAST SCORE:
                     <p>{player.lastScore}</p>
                  </div>

               </div>
            ))}

         </div>
        

      </div>
   )
}

export default GameOnlinePlayersSection