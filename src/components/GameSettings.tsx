'use client'
import React, { useState} from 'react'

interface GameSettingsProps {
   gameMode: string
}

const GameSettings: React.FC<GameSettingsProps> = ({ gameMode }) => {
   const [numberOfPlayers, setNumberOfPlayers] = useState(2)
   const [playerNames, setPlayerNames] = useState<string[]>(Array(2).fill(''))
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
      newNames[index] = value // player name update for particular index
      setPlayerNames(newNames)
   }

   // Number of legs handler
   const handleNumberOfLegs = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setNumberOfLegs(Number(event.target.value))
   }

   return (
      <div className='game-settings'>
         <h2>{gameMode}</h2>

         {/* Number of players selection */}
         <label htmlFor="numberOfPlayers">Select number of players:</label>
         <select className='number-of-players' id="numberOfPlayers" value={numberOfPlayers} onChange={handleNumberOfPlayers}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
         </select>

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
         
         {/* Number of legs selection */}
         <div>
            <label htmlFor="numberOfLegs">Select number of legs to win:</label>
            <select className='number-of-legs' id="numberOfLegs" value={numberOfLegs} onChange={handleNumberOfLegs}>
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
               <option value={4}>4</option>
               <option value={5}>5</option>
            </select>
         </div>
         
         
         <button className='game-start'>To the game!</button>
      </div>
   )
}

export default GameSettings