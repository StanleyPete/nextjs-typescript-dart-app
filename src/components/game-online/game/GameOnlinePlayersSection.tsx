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
         {players.length === 2 ? (
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


         ) : (
            <>
               {/*CURRENT PLAYER SECTION:*/}
               <div className="current-player-section">

                  {/*CURRENT PLAYER HEADER */}
                  <div className='current-player-name-legs'>

                     <div className='current-player-name'>

                        {/*Current player header image (active)*/}
                        <Image 
                           src='/game-user-throw.svg' 
                           alt='User icon' 
                           width={16} 
                           height={16} 
                        />

                        {/*Current player header name*/}
                        {players[currentPlayerIndex].name} 

                     </div>

                     {/*Current player header legs*/}
                     <div className='player-legs'>
                        {players[currentPlayerIndex].legs}
                     </div>

                  </div>

                  {/*CURRENT PLAYER POINTS LEFT */}
                  <p className='current-player-points-left'>
                     {players[currentPlayerIndex].pointsLeft}
                  </p>

                  {/*CURRENT PLAYER CHECKOUT OPTIONS */}
                  {players[currentPlayerIndex].pointsLeft <= 170 && (
                     <p className='checkout-options'>{checkoutArray[players[currentPlayerIndex].pointsLeft - 2]}</p>
                  )}

                  {/*CURRENT PLAYER STATS*/}
                  <div className='current-player-stats'>
                        3-DART AVERAGE: 
                     <p>{players[currentPlayerIndex].average.toFixed(2)}</p>
                  </div>

                  <div className='current-player-stats'>
                        LAST SCORE: 
                     <p>{players[currentPlayerIndex].lastScore}</p>
                  </div>

               </div>

               {/*Game player list:*/}
               <div className='game-players-list'>

                  {players.map((player: PlayerOnline, index: number) => (

                     <div className={`game-players-list-player ${player.name === players[currentPlayerIndex].name ? 'active-player' : '' }`} key={index}>

                        <div className='game-players-list-player-name'>
                           <Image 
                              src={player.name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'} 
                              alt='User icon' 
                              width={16} 
                              height={16} 
                           />
                           {player.name} 
                        </div>

                        <div className="game-players-list-stats">
                           <div className='player-legs'>
                              {player.legs}
                           </div>
                           <p>{player.pointsLeft}</p>
                        </div>
                     </div>

                  ))}  
               </div>

            </>
         )}
        

      </div>
   )
}

export default GameOnlinePlayersSection