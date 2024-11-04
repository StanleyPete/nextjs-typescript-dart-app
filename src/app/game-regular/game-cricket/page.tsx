'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

interface Player {
   name: string
   legs: number
   points: number
}


const Cricket = () => {

   const scores = [
      ['20', 'D20', 'T20'],
      ['19', 'D19', 'T19'],
      ['18', 'D18', 'T18'],
      ['17', 'D17', 'T17'],
      ['16', 'D16', 'T16'],
      ['15', 'D15', 'T15'],
      ['25', '50'],
      ['Miss']
   ]

   const searchParams = useSearchParams()
   // const gameWinType = searchParams.get('game-win-type')
   // const numberOfLegs = searchParams.get('number-of-legs')
   const urlPlayers: string[] = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'))
   
   const [players, setPlayers] = useState<Player[]>(urlPlayers.map((playerName: string) => ({
      name: playerName,
      legs: 0,
      points: 0, 
       
   })))
   
   //CurrentPlayerIndex state declared in order to keep players index who currently plays
   const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
   //State to track which player starts the leg
   const [startLegPlayerIndex, setStartLegPlayerIndex] = useState<number>(0)
   //State to track throws count for each player when using buttons
   const [currentPlayerThrowsCount, setCurrentPlayerThrowsCount] = useState<number>(0)
   //State to track current player throw value and display it in current throw section
   const [currentPlayerThrows, setCurrentPlayerThrows] = useState<number[]>([])

   return (    
      <div className='game-container'>

         {/*Game players section:*/}
         <div className="game-players-section">

            {/*Two players preview:*/}
            {players.length === 2 ? (
               <div className='two-players-preview'>

                  {/*Player 1: */}
                  <div className={`current-player-section ${currentPlayerIndex === 0 ? 'current-active-player' : ''}`}>

                     {/*Player 1 header */}
                     <div className='current-player-name-legs'>
                        <div className='current-player-name'>
                           <Image src={players[0].name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                           {players[0].name} 
                        </div>
                        <div className='player-legs'>
                           {players[0].legs}
                        </div>

                     </div>

                     {/*Player 1 points*/}
                     <p className='current-player-points-left'>
                        {players[0].points}
                     </p>
                  </div>

                  {/*Player 2: */}
                  <div className={`current-player-section ${currentPlayerIndex === 1 ? 'current-active-player' : ''}`}>

                     {/*Player 2 header */}
                     <div className='current-player-name-legs'>
                        <div className='current-player-name'>
                           <Image src={players[1].name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
                           {players[1].name} 
                        </div>
                        <div className='player-legs'>
                           {players[1].legs}
                        </div>

                     </div>

                     {/*Player 2 points*/}
                     <p className='current-player-points-left'>
                        {players[1].points}
                     </p>
                  </div> 

               </div>
            ) : (

            //View when players.length > 2:

               <>
                  {/*Current player section:*/}
                  <div className="current-player-section">

                     {/*Current player header */}
                     <div className='current-player-name-legs'>
                        <div className='current-player-name'>
                           <Image src='/game-user-throw.svg' alt='User icon' width={16} height={16} />
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
                              <Image src={player.name === players[currentPlayerIndex].name ? '/game-user-throw.svg' : '/game-user.svg'} alt='User icon' width={16} height={16} />
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

         {/*Current player throw paragraph:*/}
         <p className='current-player-throw'>
            <span className='current-player-throw-message'>
               {`${players[currentPlayerIndex].name.toUpperCase()}'S TURN TO THROW!`}
            </span>
         </p>

         {/*Main score input section:*/}
         <div className='score-section'> 

            {/*Current throws section:*/}
            <div className="throw-value-section">

               {/*Undo button:*/}
               <button className="input-toggle">
                  Undo
               </button>
               
               {/* Throw details*/}
               <div className="current-player-throws">
                  {Array.from({ length: 3 }, (_, i) => (
                     <div className='current-throw' key={i}>
                        {currentPlayerThrows[i] !== undefined ? currentPlayerThrows[i] : '-'}
                     </div>
                  ))}
               </div>

               {/* Submit score button*/}
               <button className='submit-score'>
                  Submit Score
               </button>
            </div>
         
            {/*Score buttons:*/}
            {players.length === 2 ? (
               <div className='cricket-score-buttons'>
                  {scores.map((buttons, index) => (
                     <div className='score-row' key={index}>
                        <div className='player-score'>

                        </div>
                        <div className='cricket-buttons'>
                           {buttons.map((label, i) => (
                              <button key={i}>{label}</button>
                           ))}
                        </div>
                        <div className='player-score'>

                        </div>
                     </div>
                  ))}
               </div>

            ) : (
               <>
                  {/*Player row section:*/}
                  <div className="players-row">
                     {players.map((player, index) => (
                        <span key={index} className="player-name">
                           {player.name}
                        </span>
                     ))}
                  </div>
                  
                  {/* Score buttons dla >2 graczy */}
                  <div className="cricket-score-buttons-v2">
                     {scores.map((buttons, index) => (
                        <div className="score-row-v2" key={index}>
                           {/* Sekcja z player-score dla każdego gracza */}
                           <div className="player-scores-v2">
                              {players.map((_, playerIndex) => (
                                 <div key={playerIndex} className="player-score-v2">

                                 </div>
                              ))}
                           </div>
                           <div className="cricket-buttons-v2">
                              {buttons.map((label, i) => (
                                 <button key={i}>
                                    {label}
                                 </button>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>

               </>
            )}

         </div>

         <div className="settings-buttons">
            <button className='go-back' onClick={() => router.back()}>Back to Settings</button>
            <button className='restart-game'>Restart game</button>
         </div>

         
      </div>
   )
}

export default Cricket
