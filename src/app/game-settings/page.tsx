'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const GameSettings = () => {
   const router = useRouter()
   const searchParams = useSearchParams() 
   const gameMode = searchParams.get('mode')! //exclamation point added (non-null assertion used when mode never returns null or undefined)
   const [playerNames, setPlayerNames] = useState<string[]>(Array(2).fill(''))
   const [numberOfPlayers, setNumberOfPlayers] = useState(2)
   const [numberOfLegs, setNumberOfLegs] = useState(3)

   //Number of players handler
   const handleNumberOfPlayers = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newNumPlayers = Number(event.target.value)
      setNumberOfPlayers(newNumPlayers)
      setPlayerNames(Array(newNumPlayers).fill('')) 
   }

   // Player name update handler
   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value // Player name update for particular index
      setPlayerNames(newNames)
   }

   // Number of legs handler
   const handleNumberOfLegs = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setNumberOfLegs(Number(event.target.value))
   }

   // Preparing players data and generating URL
   const players = playerNames.map(name => ({ name, pointsLeft: gameMode}))
   const playersJson = encodeURIComponent(JSON.stringify(players))
   const gameUrl = `/game?mode=${gameMode}&players=${playersJson}`

   return (
      <div className='game-settings'>
         <h2>{gameMode}</h2>

         {/* Selecting number of players section */}
         <label htmlFor="numberOfPlayers">Select number of players:</label>
         <select className='select-element number-of-players' id="numberOfPlayers" value={numberOfPlayers} onChange={handleNumberOfPlayers}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
         </select>

         {/* Player names input section */}
         <div>
            {Array.from({ length: numberOfPlayers }).map((_, index) => (
               <div key={index}>
                  <label htmlFor={`player-${index}`}>Player {index + 1} Name:</label>
                  <input
                     type="text"
                     id={`player-${index}`}
                     value={playerNames[index]}
                     onChange={(e) => handleNameChange(index, e.target.value)}
                  />
               </div>
            ))}
         </div>
         
         {/* Selecting number of legs section */}
         <div>
            <label htmlFor="numberOfLegs">Select number of legs to win:</label>
            <select className='select-element number-of-legs' id="numberOfLegs" value={numberOfLegs} onChange={handleNumberOfLegs}>
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
               <option value={4}>4</option>
               <option value={5}>5</option>
            </select>
         </div>
         
         {/* Buttons section */}
         <div className='game-settings-buttons'>
            <Link href={gameUrl}>
               <button className='game-start'>To the game!</button>
            </Link>
            <button className='go-back' onClick={() => router.back()}>Go back</button>
         </div>
      </div>
   )
}

export default GameSettings