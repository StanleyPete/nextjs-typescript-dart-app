'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const GameSettings = () => {
   const router = useRouter()
   const searchParams = useSearchParams() 
   const gameMode = searchParams.get('mode')! //exclamation point added (non-null assertion used when mode never returns null or undefined)

   //State to track player names
   const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
   // State to track game type (best of / first to)
   const [gameType, setGameType] = useState<'best-of' | 'first-to'>('best-of')
   //State to track number of legs
   const [numberOfLegs, setNumberOfLegs] = useState(3)
   //State to track if error occured
   const [isError, setIsError] = useState<boolean>(false)
   //State to set error message
   const [errorMessage, setErrorMessage] = useState<string>('')

   //Max number of players
   const maxPlayers = 4
   
   //Player name update handler
   const handleNameChange = (index: number, value: string) => {
      const newNames = [...playerNames]
      newNames[index] = value // Player name update for particular index
      setPlayerNames(newNames)
   }
   
   //Add a new player input field
   const addPlayerInput = () => {
      if (playerNames.length < maxPlayers) {
         setPlayerNames([...playerNames, ''])
      } else {
         setIsError(true)
         setErrorMessage('Max player number is 4')
      }
   }
   
   //Validate player names
   const validatePlayerNames = () => {
      if (playerNames.some(name => name.trim() === '')) {
         setIsError(true)
         setErrorMessage('All player names must be filled out.')
         return false
      }
      return true
   }

   // Game type handler
   const handleGameTypeChange = (type: 'best-of' | 'first-to') => {
      setGameType(type)
   }
   
   // Number of legs handler
   const handleNumberOfLegs = (legs: number) => {
      setNumberOfLegs(legs)
   }
   
   //Error close handler
   const closeError = () => {
      setIsError(false)
      setErrorMessage('')
   }
   
   // Preparing players data and generating URL
   const playersJson = encodeURIComponent(JSON.stringify(playerNames))
   const gameUrl = `/game-${gameType}?mode=${gameMode}&players=${playersJson}&numberOfLegs=${numberOfLegs}`
   
   return (
      <div className='game-settings'>
         <h2>{gameMode}</h2>

         {/* Error section */}
         {isError && (
            <div className="error">
               <div className="error-content">
                  <p>{errorMessage}</p>
                  <button onClick={closeError}>OK</button>
               </div>
            </div>
         )}

         {/* Button to add a new player */}
         <button onClick={addPlayerInput} className='add-player-button'>Add Player</button>

         {/* Selecting number of players section */}
         <div>
            {playerNames.map((name, index) => (
               <div key={index}>
                  <label htmlFor={`player-${index}`}>Player {index + 1} Name:</label>
                  <input
                     type="text"
                     id={`player-${index}`}
                     value={name}
                     onChange={(event) => handleNameChange(index, event.target.value)}
                  />
               </div>
            ))}
         </div>
         
         {/* Selecting game type section */}
         <div className='game-type-buttons'>
            <button 
               className={`game-type-button ${gameType === 'best-of' ? 'active' : ''}`} 
               onClick={() => handleGameTypeChange('best-of')}
            >
               Best Of
            </button>
            <button 
               className={`game-type-button ${gameType === 'first-to' ? 'active' : ''}`} 
               onClick={() => handleGameTypeChange('first-to')}
            >
               First To
            </button>
         </div>
         
         {/* Selecting number of legs section */}
         <div className='legs-buttons'>
            {[1, 2, 3, 4, 5].map((legs) => (
               <button
                  key={legs}
                  className={`legs-button ${numberOfLegs === legs ? 'active' : ''}`}
                  onClick={() => handleNumberOfLegs(legs)}
               >
                  {legs}
               </button>
            ))}
         </div>
       
         
         {/* Buttons section */}
         <div className='game-settings-buttons'>
            <Link href={gameUrl}>
               <button 
                  className='game-start' 
                  onClick={(event) => {
                     if(!validatePlayerNames()){
                        event.preventDefault()
                        return
                     }
                  }}
               >
                  To the game!
               </button>
            </Link>
            <button className='go-back' onClick={() => router.back()}>Go back</button>
         </div>
      </div>
   )
}

export default GameSettings