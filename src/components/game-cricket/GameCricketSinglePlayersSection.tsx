import React from 'react'
import Image from 'next/image'
//Redux
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
//Types
import { PlayerCricket } from '@/types/components/componentsTypes'

const GameCricketSinglePlayersSection = () => {
   const { players, currentPlayerIndex, } = useSelector((state: RootState) => state.gameCricketSingle)

   return (
      <div className="game-players-section">
         {/*TWO PLAYERS VIEW:*/}
         {players.length === 2 ? (
            <div className="two-players-preview">

               {players.map((player: PlayerCricket, index: number) => (

                  <div key={index} className={`current-player-section ${currentPlayerIndex === index ? 'current-active-player' : ''}`}>
                     {/* PLAYER HEADER SECTION */}
                     <div className="current-player-name-legs">
                        <div className="current-player-name">
                           <Image
                              src={player.name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'}
                              alt="User icon"
                              width={16}
                              height={16}
                           />
                           {player.name}
                        </div>
                        <div className="player-legs">{player.legs}</div>
                     </div>
      
                     {/* Player points */}
                     <p className="current-player-points-left">{player.points}</p>
                  </div>
               ))}
            </div>
         ) : (
         //VIEW WHEN MORE THAN 2 PLAYERS:
            <>
               {/*Current player section:*/}
               <div className="current-player-section">
                  {/*Current player header */}
                  <div className='current-player-name-legs'>
                     <div className='current-player-name'>
                        <Image 
                           src='/game-user-throw.svg' 
                           alt='User icon' 
                           width={16} 
                           height={16} 
                        />
                        {players[currentPlayerIndex].name} 
                     </div>
                     <div className='player-legs'>
                        {players[currentPlayerIndex].legs}
                     </div>
                  </div>
      
                  {/*Current player points left */}
                  <p className='current-player-points-left'>
                     {players[currentPlayerIndex].points}
                  </p>
      
               </div>
      
               {/*Game player list:*/}
               <div className='game-players-list'>
                  {players.map((player: { name: string, legs: number, points:number }, index: number) => (
                     <div className={`game-players-list-player ${player.name === players[currentPlayerIndex].name ? 'active-player' : '' }`} 
                        key={index}>
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
                           <div className='player-legs'>{player.legs}</div>
                           <p>{player.points}</p>
                        </div>
                     </div>
                  ))}  
               </div>
            </>
         )}
      </div>
   )
}

export default GameCricketSinglePlayersSection